import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ staffID: string }> }
) {
  const { staffID } = await params;
  const id = Number(staffID);

  const data = await req.json();

  try {
    const updated = await prisma.staff.update({
      where: { staffID: id },
      data: {
        firstName: data.fname,
        lastName: data.lname,
        role: data.position,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Update failed", details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ staffID: string }> }
) {
  const { staffID } = await params;
  const id = Number(staffID);

  try {
    await prisma.staff.delete({
      where: { staffID: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Delete failed", details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}