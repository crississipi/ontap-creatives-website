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

    // console.log('🔍 Fetching receipt for:', orderid);

    // Handle both formats: "receipt-TXN-..." and "TXN-..."
    if (orderid.startsWith('receipt-')) {
      orderid = orderid.replace('receipt-', '');
    }

    // console.log('🔍 Processing transaction ID:', orderid);

    // Fetch transaction data. Use the `product` relation (exists on transaction)
    // The previous code referenced a non-existent `cart` relation which caused runtime errors.
    const transactions = await prisma.transaction.findMany({
      where: {
        transactionID: orderid
      },
      include: {
        product: true,
        client: true,
        billing: true,
        voucher: true
      }
    });

    // console.log('🔍 Found transactions:', transactions.length);

    if (!transactions || transactions.length === 0) {
      // console.log('❌ No transactions found for ID:', orderid);
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    // Use the first transaction to get common data
    const firstTransaction = transactions[0];
    
    // Calculate totals from all transactions
    const itemsSubtotal = transactions.reduce((sum, t) => sum + t.subtotal, 0);
    const discountAmount = firstTransaction.voucher ? (itemsSubtotal * firstTransaction.voucher.discount / 100) : 0;
    const shippingFee = firstTransaction.shipMethod === 'delivery' ? 250 : 0;
    const totalAmount = itemsSubtotal - discountAmount + shippingFee;

    // console.log('🔍 Calculated totals:', {
    //   itemsSubtotal,
    //   discountAmount,
    //   shippingFee,
    //   totalAmount
    // });

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
      // Build items from the transaction-product relation. Some fields (quantity, logo)
      // were previously taken from `cart` which doesn't exist on the `transaction` model.
      items: transactions.map(t => {
        const prod = t.product as any || {};
        // Infer quantity from subtotal/price when possible, otherwise default to 1
        let qty = 1;
        if (prod.price && prod.price !== 0) {
          qty = Math.max(1, Math.round((t.subtotal || 0) / prod.price));
        }

        return {
          imgUrl: prod.imgUrl || '',
          frontImg: prod.frontUrl || '',
          name: prod.name || 'Product',
          qty,
          price: prod.price || 0,
          subtotal: t.subtotal,
          logo: ''
        }
      }),
      shippingMethod: firstTransaction.shipMethod,
      shippingFee: shippingFee,
      paymentMethod: firstTransaction.billing!.mode.toLowerCase(),
      discount: discountAmount,
      subtotal: itemsSubtotal,
      total: totalAmount,
      orderDate: firstTransaction.dateOrdered.toISOString()
    };

    // console.log('✅ Receipt data prepared for:', orderid);

    return NextResponse.json(receiptData);
  } catch (error) {
    // console.error('❌ Failed to fetch receipt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch receipt' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}