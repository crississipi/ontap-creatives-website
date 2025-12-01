import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const newOrder = await prisma.transaction.create({
            data
        });

        return NextResponse.json({ success: true, data: newOrder });
    } catch (err) {
        return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
}
