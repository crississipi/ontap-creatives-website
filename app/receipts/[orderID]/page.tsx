import ReceiptClient from '@/components/ReceiptClient';

interface PageProps {
  params: {
    orderID: string;
  };
}

export default function ReceiptPage({ params }: PageProps) {
  return <ReceiptClient orderID={params.orderID} />;
}