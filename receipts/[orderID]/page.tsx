import ReceiptClient from "@/components/ReceiptClient";

export default function ReceiptPage({ params }: { params: { orderID: string } }) {
  return <ReceiptClient orderID={params.orderID} />;
}
