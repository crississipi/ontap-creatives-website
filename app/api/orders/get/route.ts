import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") || "";

        const orders = await prisma.transaction.findMany({
            where: {
                OR: [
                    { transactionID: { contains: q } },
                    { client: { clientName: { contains: q } } }
                ]
            },
            include: {
                client: true,
                product: true,
                billing: true,
                process: true, // Include process information
                tracking: true,
            },
            orderBy: { dateOrdered: "desc" }
        });

        return NextResponse.json({ success: true, data: orders });
    } catch (err) {
        return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
}