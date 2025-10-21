"use client";

import { JSX, useEffect, useRef, useState } from "react";
import Receipt from "@/components/Receipt";
import Image from "next/image";
import { RiTruckLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import ReceiptTemplate from "@/components/ReceiptTemplate";

interface ReceiptProps {
  orderID: string;
  customerName: string;
  items: { name: string; qty: number; price: number }[];
}

type PaymentInfo = {
  title: string;
  image: JSX.Element;
  label: string;
  digit: number;
};

const payment: Record<string, PaymentInfo> = {
  "cod": 
    { title: '', 
      image: <></>, 
      label: '', 
      digit: 0
    },
  "credit": 
    { title: 'credit/debit', 
      image: 
        <Image 
          height={2048}
          width={2048}
          src='https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg' 
          alt="PayPal Logo" 
          style={{ height: '28px', width: 'auto', objectFit: 'cover' }}
        />, 
      label: 'Card Number', 
      digit: 19 
    },
  "ewallet":
    { title: 'e-wallet',
      image: 
        <Image 
          height={2048}
          width={2048}
          src='/icons/gcash-logo.png' 
          alt="E-wallet Logo" 
          style={{ width: '64px', objectFit: 'contain', position: 'absolute', right: '12px', marginTop: 5 }}
        />,
      label: 'Number',
      digit: 11
    },
  "bank": 
    { title: 'bank transfer',
      image: 
        <Image 
          height={2048}
          width={2048}
          src='/icons/bdo.png' 
          alt="Bank Logo" 
          style={{ height: '12px', width: 'auto', objectFit: 'cover' }}
        />,
      label: 'Account Number',
      digit: 10
    }
}

export default function ReceiptClient({ orderID }: { orderID: string }) {
  const [data, setData] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [modeOfPayment, setModeOfPayment] = useState('ewallet');

  useEffect(() => {
    fetch(`/api/receipts/${orderID}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [orderID]);

  if (!data) {
    return (
      <main className="flex justify-center items-center h-screen text-gray-500">
        <p>Loading receipt...</p>
      </main>
    );
  }

  if (data.error) {
    return (
      <main className="flex justify-center items-center h-screen text-gray-500">
        <p>{data.error}</p>
      </main>
    );
  }

  
  const handleDownload = async () => {
    if (!receiptRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const element = receiptRef.current.cloneNode(true) as HTMLElement;
    element.style.display = "block";

    const opt = {
        margin: 0.5,
        filename: `receipt-${orderID}.pdf`,
        image: { type: "jpeg" as const, quality: 1 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <main className="flex justify-center h-screen overflow-x-hidden w-full relative bg-white">
      <div className="h-max w-full flex">
        <Receipt
          orderID={data.orderID}
          customerName={data.customerName}
          items={data.items}
        />
      </div>
      <div ref={receiptRef} className="h-full w-full flex" style={{display:'none'}}>
          <ReceiptTemplate 
            orderID={data.orderID}
            customerName={data.customerName}
            items={data.items}
          />
      </div>
      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="rounded-lg px-4 py-2 transition z-99 fixed right-5 top-5"
        style={{
          backgroundColor: "#2563eb", // blue-600
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
        }}
        onMouseOver={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor = "#1d4ed8") // blue-700
        }
        onMouseOut={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor = "#2563eb")
        }
      >
        Download E-Receipt
      </button>
    </main>
  );
}
