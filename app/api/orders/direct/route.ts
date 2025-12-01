import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

import { sendAdminOrderNotification, sendOrderConfirmationEmail } from '@/lib/emailService';

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

interface DirectOrderRequest {
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
  product: {
    productID: number
    name: string
    price: number
    quantity: number
    logo: string
    subtotal: number
  }
  voucher?: {
    id: number
    discount: number
  } | null
  totals: {
    subtotal: number
    shippingFee: number
    discount: number
    total: number
  }
  clientTimestamp?: number
  clientId?: number
}

function validateDirectOrderData(data: any): { isValid: boolean; errors: string[] } {
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

  // Product validation
  if (!data.product?.productID) errors.push('Product ID is required')
  if (!data.product?.quantity || data.product.quantity <= 0) errors.push('Valid quantity is required')
  if (!data.product?.subtotal || data.product.subtotal <= 0) errors.push('Valid subtotal is required')

  // Payment validation
  if (!data.paymentInfo?.method) errors.push('Payment method is required')

  // Totals validation
  if (!data.totals || !data.totals.total || data.totals.total <= 0) {
    errors.push('Valid total amount is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 DIRECT ORDER API CALLED');
  
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: DirectOrderRequest = await request.json();
    
    console.log('📦 Direct order request received for user:', user.clientID);
    console.log('📦 Product:', body.product?.name);
    
    // Validate input data
    const validation = validateDirectOrderData(body);
    if (!validation.isValid) {
      console.log('❌ Validation failed:', validation.errors);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }

    // Generate unique IDs
    const timestamp = Date.now();
    const transactionId = `TXN-${timestamp}-${Math.random().toString(36).substr(2, 8)}`;
    const billingReferenceNo = `REF-${timestamp}-${Math.random().toString(36).substr(2, 8)}`;

    console.log('🔍 Generated Transaction ID:', transactionId);
    console.log('🔍 Generated Reference No:', billingReferenceNo);

    // Use a transaction with increased timeout
    const result = await prisma.$transaction(async (tx) => {
      console.log('💰 Step 1: Creating billing record...');
      // 1. Create billing record
      const billing = await tx.billing.create({
        data: {
          mode: body.paymentInfo.method.toUpperCase(),
          referenceNo: billingReferenceNo,
          sender: `${body.contactInfo.firstName} ${body.contactInfo.lastName}`,
          receiver: 'Burnbox Printing',
          amount: body.totals.total,
          dateAdded: new Date()
        }
      });

      console.log('✅ Billing created:', billing.billingID);

      // 2. Mark voucher as used if applicable
      if (body.voucher?.id) {
        try {
          console.log('🔍 Processing voucher:', body.voucher.id);
          const existingVoucher = await tx.voucher.findUnique({
            where: { voucherID: body.voucher.id }
          });

          if (existingVoucher && !existingVoucher.isUsed) {
            await tx.voucher.update({
              where: { voucherID: body.voucher.id },
              data: { isUsed: true }
            });
            console.log('✅ Voucher marked as used:', body.voucher.id);
          } else if (existingVoucher?.isUsed) {
            console.warn('⚠️ Voucher already used:', body.voucher.id);
          } else {
            console.warn('⚠️ Voucher not found:', body.voucher.id);
          }
        } catch (voucherError) {
          console.warn('⚠️ Voucher processing failed, continuing without voucher:', voucherError);
        }
      }

      console.log('📊 Step 2: Creating tracking record...');
      // 3. Create tracking record
      const tracking = await tx.tracking.create({
        data: {
          status: 'Order Placed',
          info: `You purchased ${body.product.quantity} ${body.product.quantity === 1 ? 'item' : 'items'}`,
          time: new Date(),
          date: new Date()
        }
      });

      console.log('✅ Tracking record created:', tracking.trackingID);

      console.log('🛒 Step 3: Creating cart item...');
      // 4. Create a cart item (marked as ordered immediately)
      const cartItem = await tx.cart.create({
        data: {
          productID: body.product.productID,
          clientID: user.clientID,
          quantity: body.product.quantity,
          subtotal: body.product.subtotal,
          status: 'ordered',
          logo: body.product.logo || 'Default'
        }
      });

      console.log('✅ Cart item created:', cartItem.cartID);

      console.log('📝 Step 4: Creating transaction record...');
      // 5. Create the main transaction record
      const transaction = await tx.transaction.create({
        data: {
          transactionID: transactionId,
          shipMethod: body.shippingInfo.method,
          subtotal: body.product.subtotal,
          dateOrdered: new Date(),
          cartID: cartItem.cartID,
          billingID: billing.billingID,
          clientID: user.clientID,
          trackingID: tracking.trackingID
        }
      });

      console.log('✅ Transaction created:', transaction.orderID);

      return {
        transaction,
        billing,
        tracking,
        cartItem,
        transactionId
      }
    }, {
      maxWait: 10000, // Increase max wait time
      timeout: 10000, // Increase timeout to 10 seconds
    });

    console.log('✅ Direct order transaction completed successfully');

    // Generate receipt data for PDF and email (outside transaction)
    const receiptData = {
      orderID: result.transactionId,
      customerName: `${body.contactInfo.firstName} ${body.contactInfo.lastName}`,
      companyName: body.contactInfo.companyName || '',
      contactNumber: body.contactInfo.contactNumber,
      email: body.contactInfo.email,
      deliveryAddress: body.shippingInfo.method === 'delivery' && body.shippingInfo.address 
        ? `${body.shippingInfo.address.house}, ${body.shippingInfo.address.barangay}, ${body.shippingInfo.address.city}, ${body.shippingInfo.address.region} ${body.shippingInfo.address.zipCode}`
        : 'Store Pickup',
      items: [{
        name: body.product.name,
        qty: body.product.quantity,
        price: body.product.price,
        subtotal: body.product.subtotal,
        logo: body.product.logo
      }],
      shippingMethod: body.shippingInfo.method,
      shippingFee: body.totals.shippingFee,
      paymentMethod: body.paymentInfo.method,
      discount: body.totals.discount,
      subtotal: body.totals.subtotal,
      total: body.totals.total,
      orderDate: new Date().toISOString()
    };

    console.log('📄 Receipt data prepared:', receiptData);

    // Generate PDF receipt
    let receiptBuffer: Buffer;
    let pdfGenerationSuccess = false;

    try {
      console.log('🔍 Generating PDF receipt...');
      const pdfResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/generate-receipt-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData)
      });

      if (pdfResponse.ok && pdfResponse.headers.get('content-type')?.includes('application/pdf')) {
        const arrayBuffer = await pdfResponse.arrayBuffer();
        receiptBuffer = Buffer.from(arrayBuffer);
        pdfGenerationSuccess = true;
        console.log('✅ PDF receipt generated successfully');
      } else {
        const errorText = await pdfResponse.text();
        console.warn('⚠️ PDF API returned non-PDF response:', errorText);
        throw new Error('PDF API returned non-PDF response');
      }
    } catch (pdfError) {
      console.error('❌ PDF generation failed:', pdfError);
      receiptBuffer = Buffer.from('');
      pdfGenerationSuccess = false;
      // Continue without PDF - don't fail the entire order
    }

    // Send confirmation email to CUSTOMER
    try {
      console.log('🔍 Sending customer confirmation email...');
      const receiptUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/receipts/${result.transactionId}`;
      
      await sendOrderConfirmationEmail({
        to: body.contactInfo.email,
        customerName: `${body.contactInfo.firstName} ${body.contactInfo.lastName}`,
        orderId: result.transactionId,
        orderDate: new Date().toLocaleDateString(),
        total: body.totals.total,
        receiptBuffer: receiptBuffer,
        receiptUrl: receiptUrl
      });
      
      console.log('✅ Customer confirmation email sent successfully');
    } catch (emailError) {
      console.error('❌ Customer email sending failed:', emailError);
      // Continue even if email fails - don't fail the entire order
    }

    // Send admin notification email
    try {
      console.log('🔍 Sending admin notification email...');
      await sendAdminOrderNotification({
        orderData: {
          contactInfo: body.contactInfo,
          shippingInfo: body.shippingInfo,
          paymentInfo: body.paymentInfo,
          items: [{
            product: body.product,
            quantity: body.product.quantity,
            logo: body.product.logo,
            subtotal: body.product.subtotal
          }],
          totals: body.totals
        },
        customerEmail: body.contactInfo.email,
        transactionId: result.transactionId,
        totalAmount: body.totals.total
      });
      
      console.log('✅ Admin notification email sent successfully');
    } catch (adminEmailError) {
      console.error('❌ Admin notification email failed:', adminEmailError);
      // Continue even if admin email fails - don't fail the entire order
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      transactionId: result.transactionId,
      orderId: result.transaction.orderID,
      receiptUrl: `${process.env.NEXTAUTH_URL || 'https://ontap.ph/'}/receipts/${result.transactionId}`
    });

  } catch (error: any) {
    console.error('❌ Direct order creation error:', error);
    
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific Prisma errors
      if (error.message.includes('Unique constraint') || error.message.includes('Duplicate')) {
        errorMessage = 'Order processing conflict. Please try again.';
        statusCode = 409; // Conflict
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Invalid data reference. Please check your product.';
        statusCode = 400;
      } else if (error.message.includes('Transaction already closed') || error.message.includes('timeout')) {
        errorMessage = 'Order processing took too long. Please try again.';
        statusCode = 408;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Add GET method for direct order retrieval if needed
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (transactionId) {
      // Get specific direct order
      const orders = await prisma.transaction.findMany({
        where: {
          transactionID: transactionId,
          clientID: user.clientID
        },
        include: {
          cart: {
            include: {
              product: true
            }
          },
          billing: true,
          tracking: true,
          voucher: true
        },
        orderBy: {
          dateOrdered: 'desc'
        }
      });

      return NextResponse.json({ orders });
    } else {
      // Get all direct orders for user
      const orders = await prisma.transaction.findMany({
        where: {
          clientID: user.clientID
        },
        include: {
          cart: {
            include: {
              product: true
            }
          },
          billing: true,
          tracking: true,
          voucher: true
        },
        orderBy: {
          dateOrdered: 'desc'
        },
        take: 50 // Limit to recent orders
      });

      return NextResponse.json({ orders });
    }
  } catch (error) {
    console.error('Error fetching direct orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}