import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(
  req: Request,
  { params }: { params: { orderID: string } }
) {
  const { orderID } = params;

  const mockOrders: Record<string, any> = {
    "123456": {
      customerName: "Cris Chuchu",
      items: [
        { name: "Awesome T-Shirt", qty: 2, price: 499 },
        { name: "Sticker Pack", qty: 1, price: 99 },
      ],
    },
  };

  const order = mockOrders[orderID];
  if (!order)
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });

  return NextResponse.json({ orderID: orderID, ...order });
}
