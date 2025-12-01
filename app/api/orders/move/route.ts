import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const { orderID, processID } = await request.json();

        if (!orderID || processID === undefined) {
            return NextResponse.json({ 
                success: false, 
                error: "Order ID and Process ID are required" 
            }, { status: 400 });
        }

        let processName = "Newly Ordered"; // Default status

        // If processID is provided, get the actual process name from the database
        if (processID !== null) {
            const process = await prisma.process.findUnique({
                where: { processID: parseInt(processID) }
            });
            
            if (process) {
                processName = process.processName;
            }
        }

        await prisma.transaction.update({
            where: { orderID },
            data: { 
                processID: processID === null ? null : parseInt(processID),
                status: processName // Use the actual process name instead of "Process ${processID}"
            }
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error moving order:", err);
        return NextResponse.json({ success: false, error: "Failed to move order" }, { status: 500 });
    }
}