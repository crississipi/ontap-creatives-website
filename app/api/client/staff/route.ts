import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sendStaffCredentialsEmail } from '@/lib/emailService'
import { PrismaClient, staff as Staff } from '@prisma/client'

const prisma = new PrismaClient()

// Helper to extract and verify JWT from cookies and return staff data
async function getStaffFromRequest(request: NextRequest): Promise<Staff | null> {
  try {
    const token = request.cookies.get('staff-auth-token')?.value
    if (!token) return null

    const secret = process.env.STAFF_JWT_SECRET || process.env.JWT_SECRET || 'staff-secret'
    const decoded: any = jwt.verify(token, secret)
    if (!decoded?.staffID) return null
    
    const staff = await prisma.staff.findUnique({
        where: { staffID: decoded.staffID }
    })
    
    return staff;
  } catch (error) {
    console.error("Error in getStaffFromRequest: ", error)
    return null
  }
}

// GET - Fetch all staff, excluding the logged-in staff member
export async function GET(request: NextRequest) {
  try {
    const loggedInStaff = await getStaffFromRequest(request);

    if (!loggedInStaff) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const staff = await prisma.staff.findMany({
      where: {
        NOT: {
          staffID: loggedInStaff.staffID,
        },
      },
      select: {
        staffID: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        dateAdded: true,
        viewDashboard: true,
        viewOrders: true,
        viewClients: true,
        viewAffiliates: true,
        addProducts: true,
        changeContent: true,
        addOffers: true,
      },
    });

    return NextResponse.json({ staff }, { status: 200 });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add new staff (Admin only)
export async function POST(request: NextRequest) {
  try {
    const adminUser = await getStaffFromRequest(request);
    if (adminUser?.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      firstName,
      lastName,
      email,
      role,
      viewDashboard,
      viewOrders,
      viewClients,
      viewAffiliates,
      addProducts,
      changeContent,
      addOffers
    } = await request.json()

    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, role' },
        { status: 400 }
      )
    }

    // Auto-generate password: firstName + _ + role
    const generatedPassword = `${firstName}_${role}`
    const hashedPassword = await bcrypt.hash(generatedPassword, 10)

    const newStaff = await prisma.staff.create({
      data: {
        firstName,
        lastName,
        email,
        role,
        password: hashedPassword,
        viewDashboard: viewDashboard || false,
        viewOrders: viewOrders || false,
        viewClients: viewClients || false,
        viewAffiliates: viewAffiliates || false,
        addProducts: addProducts || false,
        changeContent: changeContent || false,
        addOffers: addOffers || false
      }
    })

    // Send credentials email
    try {
      await sendStaffCredentialsEmail({
        staffName: `${firstName} ${lastName}`,
        staffEmail: email,
        staffRole: role,
        username: email,
        password: generatedPassword
      })
    } catch (emailError) {
      console.error('Failed to send staff credentials email:', emailError)
      // Continue even if email fails - staff is created, just notification failed
    }

    return NextResponse.json({ staff: newStaff }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating staff:', error)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return NextResponse.json({ error: 'A staff with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update staff (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const adminUser = await getStaffFromRequest(request);
    if (adminUser?.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      staffID,
      firstName,
      lastName,
      email,
      role,
      viewDashboard,
      viewOrders,
      viewClients,
      viewAffiliates,
      addProducts,
      changeContent,
      addOffers
    } = await request.json()

    if (!staffID) {
      return NextResponse.json({ error: 'Missing staffID' }, { status: 400 })
    }

    const updatedStaff = await prisma.staff.update({
      where: { staffID },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(role && { role }),
        ...(viewDashboard !== undefined && { viewDashboard }),
        ...(viewOrders !== undefined && { viewOrders }),
        ...(viewClients !== undefined && { viewClients }),
        ...(viewAffiliates !== undefined && { viewAffiliates }),
        ...(addProducts !== undefined && { addProducts }),
        ...(changeContent !== undefined && { changeContent }),
        ...(addOffers !== undefined && { addOffers })
      }
    })

    return NextResponse.json({ staff: updatedStaff }, { status: 200 })
  } catch (error) {
    console.error('Error updating staff:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove staff (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await getStaffFromRequest(request);
    if (adminUser?.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const { staffID } = await request.json()

    if (!staffID) {
      return NextResponse.json({ error: 'Missing staffID' }, { status: 400 })
    }

    // Prevent admin from deleting themselves
    if (adminUser.staffID === staffID) {
        return NextResponse.json({ error: 'Cannot delete own account.' }, { status: 400 });
    }

    await prisma.staff.delete({
      where: { staffID }
    })

    return NextResponse.json({ message: 'Staff deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting staff:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
