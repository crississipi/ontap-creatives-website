import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderID: string }> }
) {
  try {
    const {orderID} = await params
    let orderid = orderID;

    console.log('🔍 Fetching receipt for:', orderid);

    // Handle both formats: "receipt-TXN-..." and "TXN-..."
    if (orderid.startsWith('receipt-')) {
      orderid = orderid.replace('receipt-', '');
    }

    console.log('🔍 Processing transaction ID:', orderid);

    // Fetch transaction data
    const transactions = await prisma.transaction.findMany({
      where: {
        transactionID: orderid
      },
      include: {
        cart: {
          include: {
            product: true
          }
        },
        client: true,
        billing: true,
        voucher: true
      }
    });

    console.log('🔍 Found transactions:', transactions.length);

    if (!transactions || transactions.length === 0) {
      console.log('❌ No transactions found for ID:', orderid);
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    // Use the first transaction to get common data
    const firstTransaction = transactions[0];
    
    // Calculate totals from all transactions
    const itemsSubtotal = transactions.reduce((sum, t) => sum + t.subtotal, 0);
    const discountAmount = firstTransaction.voucher ? (itemsSubtotal * firstTransaction.voucher.discount / 100) : 0;
    const shippingFee = firstTransaction.shipMethod === 'delivery' ? 250 : 0;
    const totalAmount = itemsSubtotal - discountAmount + shippingFee;

    console.log('🔍 Calculated totals:', {
      itemsSubtotal,
      discountAmount,
      shippingFee,
      totalAmount
    });

    // Format receipt data for the client
    const receiptData = {
      orderID: orderid,
      customerName: firstTransaction.client.clientName || 'Customer',
      companyName: firstTransaction.client.clientName || '', // You might want to add company name to your schema
      contactNumber: firstTransaction.client.contactNumber || '',
      email: firstTransaction.client.email,
      deliveryAddress: firstTransaction.shipMethod === 'delivery' 
        ? (firstTransaction.client.address || 'Address not specified')
        : 'Store Pickup - 17 Vatican City Dr, Las Piñas, 1740 Metro Manila',
      items: transactions.map(t => ({
        imgUrl: t.cart.product.imgUrl || '',
        frontImg: t.cart.product.frontUrl || '',
        name: t.cart.product.name,
        qty: t.cart.quantity,
        price: t.cart.product.price,
        subtotal: t.subtotal,
        logo: t.cart.logo
      })),
      shippingMethod: firstTransaction.shipMethod,
      shippingFee: shippingFee,
      paymentMethod: firstTransaction.billing!.mode.toLowerCase(),
      discount: discountAmount,
      subtotal: itemsSubtotal,
      total: totalAmount,
      orderDate: firstTransaction.dateOrdered.toISOString()
    };

    console.log('✅ Receipt data prepared for:', orderid);

    return NextResponse.json(receiptData);
  } catch (error) {
    console.error('❌ Failed to fetch receipt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch receipt' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}