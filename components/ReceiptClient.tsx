"use client";

import { useEffect, useRef, useState } from "react";
import Receipt from "@/components/Receipt";
import Image from "next/image";
import ReceiptTemplate from "@/components/ReceiptTemplate";
import { ReceiptData } from "@/types/receipt";
import { useToast } from '@/hooks/useToast';
import Toast from './Toast';

export default function ReceiptClient({ orderID }: { orderID: string }) {
  const [data, setData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { toast, showToast } = useToast();

  // Clean the orderID to remove 'receipt-' prefix if present
  const cleanOrderID = orderID.startsWith('receipt-') 
    ? orderID.replace('receipt-', '') 
    : orderID;

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/receipts/${cleanOrderID}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            showToast('error', 'Receipt Not Found.')
          }
          showToast('error', 'Failed to fetch receipt');
        }
        
        const receiptData = await response.json();
        setData(receiptData);
      } catch (err) {
        showToast('error', 'Failed to fetch receipt');
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptData();
  }, [cleanOrderID]); // Use cleanOrderID as dependency

  const handleDownload = async () => {
    if (!receiptRef.current || !data) return;

    try {
      setDownloading(true);
      const html2pdf = (await import("html2pdf.js")).default;

      const element = receiptRef.current.cloneNode(true) as HTMLElement;
      element.style.display = "block";

      const opt = {
        margin: 0,
        filename: `receipt-${data.orderID}.pdf`,
        image: { type: "jpeg" as const, quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a6", orientation: "portrait" as const },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      showToast('error', 'Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className='h-[100vh] w-[100vw] flex items-center justify-center bg-gradient-to-t from-violet via-light-blue to-white'>
        <Image
          height={2048}
          width={2048}
          alt='animated logo'
          src='/icons/animated-logo.gif'
          className='h-20 object-contain object-center'
        />
      </div>
    );
  }

  return (
    <main className="flex justify-center h-screen overflow-x-hidden w-full relative bg-white">
      {toast.show && (
        <Toast 
          icon={toast.icon}
          message={toast.message}
        />
      )}
      {data && (
        <>
          <div className="h-max w-full flex">
            <Receipt
              orderID={data.orderID}
              customerName={data.customerName}
              companyName={data.companyName}
              contactNumber={data.contactNumber}
              email={data.email}
              deliveryAddress={data.deliveryAddress}
              items={data.items}
              shippingMethod={data.shippingMethod}
              shippingFee={data.shippingFee}
              paymentMethod={data.paymentMethod}
              discount={data.discount}
              subtotal={data.subtotal}
              total={data.total}
              orderDate={data.orderDate}
            />
          </div>
          
          {/* Hidden Receipt for PDF Generation */}
          <div ref={receiptRef} className="h-full w-full flex" style={{display:'none'}}>
            <ReceiptTemplate 
              orderID={data.orderID}
              customerName={data.customerName}
              companyName={data.companyName}
              contactNumber={data.contactNumber}
              email={data.email}
              deliveryAddress={data.deliveryAddress}
              items={data.items}
              shippingMethod={data.shippingMethod}
              shippingFee={data.shippingFee}
              paymentMethod={data.paymentMethod}
              discount={data.discount}
              subtotal={data.subtotal}
              total={data.total}
              orderDate={data.orderDate}
            />
          </div>
        </>
      )}
      
      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="rounded-lg px-4 py-2 transition z-99 fixed right-5 top-20 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {downloading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download E-Receipt
          </>
        )}
      </button>
    </main>
  );
}