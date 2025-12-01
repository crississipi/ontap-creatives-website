import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const { orderID } = await request.json();

        await prisma.transaction.update({
            where: { orderID },
            data: { status: "Archived" }
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
}
