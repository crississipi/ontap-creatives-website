import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all processes
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get("includeInactive") === "true";

        const processes = await prisma.process.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { orderIndex: "asc" }
        });

        return NextResponse.json({ success: true, data: processes });
    } catch (err) {
        console.error("Error fetching processes:", err);
        return NextResponse.json({ success: false, error: "Failed to fetch processes" }, { status: 500 });
    }
}

// CREATE a new process
export async function POST(request: Request) {
    try {
        const { processName, description, orderIndex } = await request.json();

        if (!processName) {
            return NextResponse.json({ success: false, error: "Process name is required" }, { status: 400 });
        }

        // If no orderIndex provided, place at the end
        let finalOrderIndex = orderIndex;
        if (orderIndex === undefined || orderIndex === null) {
            const lastProcess = await prisma.process.findFirst({
                orderBy: { orderIndex: "desc" }
            });
            finalOrderIndex = lastProcess ? lastProcess.orderIndex + 1 : 0;
        }

        const process = await prisma.process.create({
            data: {
                processName,
                description,
                orderIndex: finalOrderIndex
            }
        });

        return NextResponse.json({ success: true, data: process });
    } catch (err) {
        console.error("Error creating process:", err);
        return NextResponse.json({ success: false, error: "Failed to create process" }, { status: 500 });
    }
}

// UPDATE a process
export async function PUT(request: Request) {
    try {
        const { processID, processName, description, orderIndex, isActive } = await request.json();

        if (!processID) {
            return NextResponse.json({ success: false, error: "Process ID is required" }, { status: 400 });
        }

        const process = await prisma.process.update({
            where: { processID },
            data: {
                ...(processName && { processName }),
                ...(description !== undefined && { description }),
                ...(orderIndex !== undefined && { orderIndex }),
                ...(isActive !== undefined && { isActive })
            }
        });

        return NextResponse.json({ success: true, data: process });
    } catch (err) {
        console.error("Error updating process:", err);
        return NextResponse.json({ success: false, error: "Failed to update process" }, { status: 500 });
    }
}