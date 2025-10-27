import ReceiptClient from '@/components/ReceiptClient';

interface PageProps {
  params: Promise<{
    orderID: string;
  }>;
}

export default async function ReceiptPage({ params }: PageProps) {
  const { orderID } = await params;
  return <ReceiptClient orderID={orderID} />;
}