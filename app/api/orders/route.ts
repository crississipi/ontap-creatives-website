// app/api/orders/route.ts
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

// Input validation schema
interface OrderItem {
  cartID: number
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
    total: number
  }
  clientTimestamp?: number
  clientId?: number
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
  if (!data.totals || !data.totals.total || data.totals.total <= 0) {
    errors.push('Valid total amount is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Check if cart items are already ordered
async function checkCartItemsStatus(cartIDs: number[], clientID: number) {
  const cartItems = await prisma.cart.findMany({
    where: {
      cartID: { in: cartIDs },
      clientID: clientID
    },
    select: {
      cartID: true,
      status: true
    }
  });

  const alreadyOrdered = cartItems.filter(item => item.status === 'ordered').map(item => item.cartID);
  const availableItems = cartItems.filter(item => item.status === 'onCart').map(item => item.cartID);

  return { alreadyOrdered, availableItems, allItemsExist: cartItems.length === cartIDs.length };
}

export async function POST(request: NextRequest) {
  let orderData: any = null;
  
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: OrderRequest = await request.json();
    
    console.log('🔍 Order request received for user:', user.clientID);
    console.log('🔍 Order items:', body.items?.length);
    console.log('🔍 Cart IDs:', body.items?.map(item => item.cartID));
    
    // Validate input data
    const validation = validateOrderData(body);
    if (!validation.isValid) {
      console.log('🔍 Validation failed:', validation.errors);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.errors 
      }, { status: 400 });
    }

    // Check cart items status BEFORE transaction
    const cartIDs = body.items.map(item => item.cartID);
    console.log('🔍 Checking cart items with IDs:', cartIDs);

    // Let's also check what's actually in the database
    const actualCartItems = await prisma.cart.findMany({
      where: {
        cartID: { in: cartIDs }
      },
      select: {
        cartID: true,
        status: true,
        clientID: true
      }
    });

    console.log('🔍 Actual cart items in database:', actualCartItems);

    const cartStatus = await checkCartItemsStatus(cartIDs, user.clientID);
    console.log('🔍 Cart status check result:', cartStatus);

    // If some items are already ordered, return specific error
    if (cartStatus.alreadyOrdered.length > 0) {
      return NextResponse.json({ 
        error: 'Some items have already been ordered. Please refresh your cart.',
        details: {
          alreadyOrdered: cartStatus.alreadyOrdered,
          availableItems: cartStatus.availableItems
        }
      }, { status: 410 }); // 410 Gone - resource no longer available
    }

    // If not all items exist, return error
    if (!cartStatus.allItemsExist) {
      return NextResponse.json({ 
        error: 'Some cart items are no longer available. Please refresh your cart.'
      }, { status: 404 });
    }

    // Generate unique IDs
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 12);
    const sharedTransactionID = `TXN-${timestamp}-${randomSuffix}`;
    const billingReferenceNo = `REF-${timestamp}-${Math.random().toString(36).substr(2, 8)}`;

    console.log('🔍 Generated Transaction ID:', sharedTransactionID);
    console.log('🔍 Generated Reference No:', billingReferenceNo);

    // Store order data for later use
    orderData = {
      body,
      user,
      sharedTransactionID
    };

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      try {
        // 1. Create billing record
        const billingAmount = body.totals.total;
        
        console.log('🔍 Creating billing record...');
        const billing = await tx.billing.create({
          data: {
            mode: body.paymentInfo.method.toUpperCase(),
            referenceNo: billingReferenceNo,
            sender: `${body.contactInfo.firstName} ${body.contactInfo.lastName}`,
            receiver: 'Burnbox Printing',
            amount: billingAmount,
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

        // 3. Create tracking record for the order
        const totalItems = body.items.reduce((sum, item) => sum + item.quantity, 0);
        console.log('🔍 Creating tracking record...');
        const tracking = await tx.tracking.create({
          data: {
            status: 'Order Placed',
            info: `You purchased ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`,
            time: new Date(),
            date: new Date()
          }
        });

        console.log('✅ Tracking record created:', tracking.trackingID);

        // 4. Create MULTIPLE transaction records
        console.log('🔍 Creating transactions for cart items:', body.items.length);

        const transactions = [];
        for (const item of body.items) {
          console.log('🔍 Creating transaction for cartID:', item.cartID);
          
          const transactionData: any = {
            transactionID: sharedTransactionID,
            shipMethod: body.shippingInfo.method,
            subtotal: item.subtotal,
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

          if (body.voucher?.id) {
            transactionData.voucher = {
              connect: { voucherID: body.voucher.id }
            };
          }
          
          const transaction = await tx.transaction.create({
            data: transactionData
          });
          
          transactions.push(transaction);
          console.log('✅ Transaction created for cart:', item.cartID, 'orderID:', transaction.orderID);
        }

        // 5. Update cart items status to 'ordered'
        console.log('🔍 Updating cart items status to ordered');
        const updateResult = await tx.cart.updateMany({
          where: {
            cartID: {
              in: cartIDs
            },
            status: 'onCart' // Only update items that are still in cart
          },
          data: {
            status: 'ordered'
          }
        });

        console.log('✅ Cart items updated to ordered:', updateResult.count, 'items');

        // Verify all items were updated
        if (updateResult.count !== cartIDs.length) {
          throw new Error(`Failed to update all cart items. Expected: ${cartIDs.length}, Updated: ${updateResult.count}`);
        }

        return {
          transactions,
          billing,
          tracking,
          transactionId: sharedTransactionID,
          firstOrderId: transactions[0]?.orderID
        }

      } catch (dbError: any) {
        console.error('❌ Database error in transaction:', dbError);
        
        // Handle specific Prisma errors
        if (dbError.code === 'P2002') {
          // Unique constraint violation
          const target = dbError.meta?.target;
          if (target?.includes('transactionID')) {
            throw new Error('Duplicate transaction detected. Please try again.');
          } else if (target?.includes('referenceNo')) {
            throw new Error('Duplicate billing reference detected. Please try again.');
          } else if (target?.includes('cartID')) {
            throw new Error('Some items are already part of another order. Please refresh your cart.');
          }
        }
        
        // Foreign key constraint violation
        if (dbError.code === 'P2003') {
          throw new Error('Invalid cart items detected. Please refresh your cart.');
        }
        
        throw dbError;
      }
    }, {
      maxWait: 10000,
      timeout: 10000,
    });

    // ✅ SUCCESS: Database operations completed
    console.log('✅ Order transaction completed successfully');

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
      total: body.totals.total,
      orderDate: new Date().toISOString()
    };

    // Generate PDF receipt (outside transaction)
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
        orderData: body,
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
      receiptUrl: `${process.env.NEXTAUTH_URL || 'https://ontap.ph/'}/receipts/${result.transactionId}`
    });

  } catch (error: any) {
    console.error('❌ Order creation error:', error);
    
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific Prisma errors
      if (error.message.includes('Unique constraint') || error.message.includes('Duplicate')) {
        errorMessage = 'Order processing conflict. Please try again.';
        statusCode = 409; // Conflict
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Invalid data reference. Please check your cart items.';
        statusCode = 400;
      } else if (error.message.includes('Transaction already closed')) {
        errorMessage = 'Order processing took too long. Please try again.';
        statusCode = 408;
      } else if (error.message.includes('Cart item') && error.message.includes('not found')) {
        errorMessage = 'Some cart items are no longer available. Please refresh your cart.';
        statusCode = 400;
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

// Add GET method for order retrieval
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (transactionId) {
      // Get specific order
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
      // Get all orders for user
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
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}