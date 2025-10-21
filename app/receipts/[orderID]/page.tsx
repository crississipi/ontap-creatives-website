import ReceiptClient from "./ReceiptClient";

export function generateStaticParams() {
  return [
    { orderID: "123456" },
    { orderID: "789101" },
  ];
}

export const dynamicParams = false;

export default function ReceiptPage({ params }: { params: { orderID: string } }) {
  return <ReceiptClient orderID={params.orderID} />;
}
