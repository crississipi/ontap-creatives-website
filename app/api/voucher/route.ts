import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCorsHeaders } from '@/lib/corsHeaders'

const prisma = new PrismaClient()

// Add GET method to handle the clientID query
export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || null
    const { searchParams } = new URL(request.url)
    const clientID = parseInt(searchParams.get('clientID') || '0')

    if (!clientID) {
      return NextResponse.json({ error: 'clientID is required' }, { status: 400, headers: getCorsHeaders(origin) })
    }

    const client = await prisma.client.findUnique({
      where: { clientID },
      include: {
        vouchers: {
          where: {
            voucherLabel: {
              in: ['5% Discount', '10% Discount', '15% Discount', '20% Discount', 'Better Luck Next Time']
            }
          },
          orderBy: { dateAdded: 'desc' }
        }
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404, headers: getCorsHeaders(origin) })
    }

    const spinsUsed = client.vouchers.length
    const spinsRemaining = Math.max(0, 2 - spinsUsed)

    return NextResponse.json({
      canSpin: spinsRemaining > 0,
      vouchers: client.vouchers,
      spinsUsed,
      spinsRemaining
    }, { headers: getCorsHeaders(origin) })

  } catch (error) {
    // console.error('Get vouchers error:', error)
    const origin = request.headers.get('origin') || null
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: getCorsHeaders(origin) })
  }
}

// Keep your existing POST method
export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || null
    const { clientID, voucherLabel, discount } = await request.json()

    if (!clientID || !voucherLabel) {
      return NextResponse.json({ error: 'clientID and voucherLabel are required' }, { status: 400, headers: getCorsHeaders(origin) })
    }

    const client = await prisma.client.findUnique({
      where: { clientID },
      include: {
        vouchers: {
          where: {
            voucherLabel: {
              in: ['5% Discount', '10% Discount', '15% Discount', '20% Discount', 'Better Luck Next Time']
            }
          }
        }
      }
    })

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404, headers: getCorsHeaders(origin) })
    }

    if (client.vouchers.length >= 2) {
      return NextResponse.json({ error: 'Maximum spins reached' }, { status: 400, headers: getCorsHeaders(origin) })
    }

    // Calculate discount percentage based on voucher label
    let discountValue = 0;
    if (voucherLabel.includes('5%')) discountValue = 5;
    else if (voucherLabel.includes('10%')) discountValue = 10;
    else if (voucherLabel.includes('15%')) discountValue = 15;
    else if (voucherLabel.includes('20%')) discountValue = 20;

    // Set expiration date (1 month from now)
    const expiration = new Date();
    expiration.setMonth(expiration.getMonth() + 1);

    // Create voucher
    const voucher = await prisma.voucher.create({
      data: {
        voucherLabel,
        discount: discountValue,
        clientID,
        isUsed: false,
        expiration
      }
    })

    // Get updated voucher count
    const updatedVouchers = await prisma.voucher.findMany({
      where: { 
        clientID,
        voucherLabel: {
          in: ['5% Discount', '10% Discount', '15% Discount', '20% Discount', 'Better Luck Next Time']
        }
      }
    })

    return NextResponse.json({
      message: 'Voucher saved successfully',
      voucher,
      spinsUsed: updatedVouchers.length,
      spinsRemaining: Math.max(0, 2 - updatedVouchers.length),
      canSpin: updatedVouchers.length < 2
    }, { headers: getCorsHeaders(origin) })

  } catch (error) {
    // console.error('Save voucher error:', error)
    const origin = request.headers.get('origin') || null
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: getCorsHeaders(origin) })
  }
}