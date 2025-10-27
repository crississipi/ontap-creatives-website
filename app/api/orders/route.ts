// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

import { sendOrderConfirmationEmail } from '@/lib/emailService';
import { generateReceiptPDF } from '@/lib/receiptGenerator';

const prisma = new PrismaClient()

// Helper function to get user from token
async function getAuthenticatedUser() {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      const cookieHeader = headersList.get('cookie')
      const authCookie = cookieHeader?.split(';').find(c => c.trim().startsWith('auth-token='))
      const tokenFromCookie = authCookie?.split('=')[1]
      
      if (!tokenFromCookie) {
        return null
      }
      
      const decoded = jwt.verify(tokenFromCookie, process.env.JWT_SECRET!) as { userId: number }
      const user = await prisma.client.findUnique({
        where: { clientID: decoded.userId }
      })
      return user
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const user = await prisma.client.findUnique({
      where: { clientID: decoded.userId }
    })
    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

// Input validation schema
interface OrderItem {
  cartID: number
  productID: number
  quantity: number
  logo: string
  subtotal: number
  product: {
    name: string
    price: number
  }
}

interface OrderRequest {
  contactInfo: {
    firstName: string
    lastName: string
    companyName?: string
    contactNumber: string
    email: string
  }
  shippingInfo: {
    method: 'pickup' | 'delivery'
    address?: {
      house: string
      barangay: string
      city: string
      region: string
      zipCode: string
    }
    timeAvailability?: {
      from: string
      to: string
    }
  }
  paymentInfo: {
    method: 'cod' | 'card' | 'ewallet' | 'bank'
    referenceNo?: string
  }
  items: OrderItem[]
  voucher?: {
    id: number
    discount: number
  } | null
  totals: {
    subtotal: number
    shippingFee: number
    discount: number
  }
}

function validateOrderData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Contact info validation
  if (!data.contactInfo?.firstName?.trim()) errors.push('First name is required')
  if (!data.contactInfo?.lastName?.trim()) errors.push('Last name is required')
  if (!data.contactInfo?.contactNumber?.trim()) errors.push('Contact number is required')
  if (!data.contactInfo?.email?.trim()) errors.push('Email is required')
  if (data.contactInfo?.email && !/^\S+@\S+\.\S+$/.test(data.contactInfo.email)) {
    errors.push('Valid email is required')
  }

  // Shipping method validation
  if (!data.shippingInfo?.method) errors.push('Shipping method is required')
  
  // Delivery address validation
  if (data.shippingInfo?.method === 'delivery') {
    if (!data.shippingInfo?.address?.house?.trim()) errors.push('House number and street are required')
    if (!data.shippingInfo?.address?.barangay?.trim()) errors.push('Barangay is required')
    if (!data.shippingInfo?.address?.city?.trim()) errors.push('City is required')
    if (!data.shippingInfo?.address?.region?.trim()) errors.push('Region is required')
    if (!data.shippingInfo?.address?.zipCode?.trim()) errors.push('ZIP code is required')
  }

  // Items validation
  if (!data.items || data.items.length === 0) errors.push('At least one item is required')
  if (data.items.some((item: any) => item.quantity <= 0)) errors.push('All items must have valid quantities')

  // Payment validation
  if (!data.paymentInfo?.method) errors.push('Payment method is required')

  // Totals validation
  if (!data.totals || data.totals.total <= 0) errors.push('Valid total amount is required')

  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function POST(request: NextRequest) {
  let orderData: any = null;
  
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: OrderRequest = await request.json();
    
    // Validate input data
    const validation = validateOrderData(body);
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }

    // Generate a single transaction ID for all items
    const sharedTransactionID = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store order data for later use (outside transaction)
    orderData = {
      body,
      user,
      sharedTransactionID
    };

    // Start transaction - ONLY for database operations
    const result = await prisma.$transaction(async (tx) => {
      try {
        // 1. Create billing record
        const billing = await tx.billing.create({
          data: {
            mode: body.paymentInfo.method.toUpperCase(),
            referenceNo: body.paymentInfo.referenceNo || `REF-${Date.now()}`,
            sender: `${body.contactInfo.firstName} ${body.contactInfo.lastName}`,
            receiver: 'Burnbox Printing',
            amount: body.totals.subtotal - (body.totals.discount || 0) + (body.totals.shippingFee || 0),
            dateAdded: new Date()
          }
        });

        console.log('Billing created:', billing.billingID);

        // 2. Mark voucher as used if applicable
        if (body.voucher?.id) {
          // First check if the voucher exists
          const existingVoucher = await tx.voucher.findUnique({
            where: { voucherID: body.voucher.id }
          });

          if (existingVoucher && !existingVoucher.isUsed) {
            await tx.voucher.update({
              where: { voucherID: body.voucher.id },
              data: { isUsed: true }
            });
            console.log('Voucher marked as used:', body.voucher.id);
          } else if (existingVoucher?.isUsed) {
            console.warn('Voucher already used:', body.voucher.id);
          } else {
            console.warn('Voucher not found:', body.voucher.id);
          }
        }

        // 3. Create tracking record for the order
        const totalItems = body.items.reduce((sum, item) => sum + item.quantity, 0);
        const tracking = await tx.tracking.create({
          data: {
            status: 'Order Placed',
            info: `You purchased ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`,
            time: new Date(),
            date: new Date()
          }
        });

        console.log('Tracking record created:', tracking.trackingID);

        // 4. Create MULTIPLE transaction records
        console.log('Creating transactions for items:', body.items.length);
        
        const transactions = [];
        for (const item of body.items) {
          const itemSubtotal = item.product.price * item.quantity;
          
          console.log('Creating transaction for cartID:', item.cartID, 'subtotal:', itemSubtotal);
          
          const transactionData: any = {
            transactionID: sharedTransactionID,
            shipMethod: body.shippingInfo.method,
            subtotal: itemSubtotal,
            dateOrdered: new Date(),
            cart: {
              connect: { cartID: item.cartID }
            },
            billing: {
              connect: { billingID: billing.billingID }
            },
            client: {
              connect: { clientID: user.clientID }
            },
            tracking: {
              connect: { trackingID: tracking.trackingID }
            }
          };

          // Only include voucher if it exists and is not null
          if (body.voucher?.id) {
            transactionData.voucher = {
              connect: { voucherID: body.voucher.id }
            };
          }
          
          const transaction = await tx.transaction.create({
            data: transactionData
          });
          
          transactions.push(transaction);
          console.log('Transaction created:', transaction.orderID);
        }

        // 5. Update cart items status to 'ordered'
        await tx.cart.updateMany({
          where: {
            cartID: {
              in: body.items.map(item => item.cartID)
            }
          },
          data: {
            status: 'ordered'
          }
        });

        console.log('Cart items updated to ordered');

        return {
          transactions,
          billing,
          tracking,
          transactionId: sharedTransactionID,
          firstOrderId: transactions[0]?.orderID
        }

      } catch (dbError) {
        console.error('Database error in transaction:', dbError);
        throw dbError;
      }
    }, {
      // Increase transaction timeout to 10 seconds
      maxWait: 10000,
      timeout: 10000,
    });

    // ✅ SUCCESS: Database operations completed
    // Now perform time-consuming tasks OUTSIDE the transaction

    // Generate receipt data for PDF and email
    const receiptData = {
      orderID: result.transactionId,
      customerName: `${body.contactInfo.firstName} ${body.contactInfo.lastName}`,
      companyName: body.contactInfo.companyName || '',
      contactNumber: body.contactInfo.contactNumber,
      email: body.contactInfo.email,
      deliveryAddress: body.shippingInfo.method === 'delivery' && body.shippingInfo.address 
        ? `${body.shippingInfo.address.house}, ${body.shippingInfo.address.barangay}, ${body.shippingInfo.address.city}, ${body.shippingInfo.address.region} ${body.shippingInfo.address.zipCode}`
        : 'Store Pickup',
      items: body.items.map(item => ({
        name: item.product.name,
        qty: item.quantity,
        price: item.product.price,
        subtotal: item.subtotal,
        logo: item.logo
      })),
      shippingMethod: body.shippingInfo.method,
      shippingFee: body.totals.shippingFee,
      paymentMethod: body.paymentInfo.method,
      discount: body.totals.discount,
      subtotal: body.totals.subtotal,
      orderDate: new Date().toISOString()
    };

    // Generate PDF receipt (outside transaction)
    let receiptBuffer: Buffer;
    let pdfGenerationSuccess = false;

    try {
      console.log('🔄 Attempting server-side PDF generation...');
      const pdfResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/generate-receipt-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData)
      });

      if (pdfResponse.ok && pdfResponse.headers.get('content-type')?.includes('application/pdf')) {
        const arrayBuffer = await pdfResponse.arrayBuffer();
        // Convert ArrayBuffer to Buffer properly
        receiptBuffer = Buffer.from(arrayBuffer);
        console.log('✅ PDF receipt generated successfully via API');
        pdfGenerationSuccess = true;
      } else {
        const errorText = await pdfResponse.text();
        console.error('❌ PDF API returned error:', errorText);
        throw new Error('PDF API returned non-PDF response');
      }
    } catch (pdfError) {
      console.error('❌ PDF generation failed:', pdfError);
      receiptBuffer = Buffer.from('');
      pdfGenerationSuccess = false;
    }

    // Send confirmation email (outside transaction)
    try {
      const receiptUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/receipts/${result.transactionId}`;
      
      await sendOrderConfirmationEmail({
        to: body.contactInfo.email,
        customerName: `${body.contactInfo.firstName} ${body.contactInfo.lastName}`,
        orderId: result.transactionId,
        orderDate: new Date().toLocaleDateString(),
        total: body.totals.subtotal - (body.totals.discount || 0) + (body.totals.shippingFee || 0),
        receiptBuffer: receiptBuffer,
        receiptUrl: receiptUrl
      });
      
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails - don't fail the entire order
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      transactionId: result.transactionId,
      receiptUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/receipts/${result.transactionId}`
    });

  } catch (error) {
    console.error('Order creation error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific Prisma errors
      if (error.message.includes('Unique constraint')) {
        errorMessage = 'Duplicate transaction detected. Please try again.';
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Invalid data reference. Please check your cart items.';
      } else if (error.message.includes('Transaction already closed')) {
        errorMessage = 'Order processing took too long. Please try again.';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}