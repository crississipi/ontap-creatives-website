import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

interface ReceiptData {
  orderID: string;
  customerName: string;
  companyName: string;
  contactNumber: string;
  email: string;
  deliveryAddress: string;
  items: {
    name: string;
    qty: number;
    price: number;
    subtotal: number;
    logo: string;
    imgUrl?: string;
    frontUrl?: string;
  }[];
  shippingMethod: string;
  shippingFee: number;
  paymentMethod: string;
  discount: number;
  subtotal: number;
  total: number;
  orderDate: string;
}

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as ReceiptData;

    if (!data.orderID || !data.customerName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pdfBuffer = await generatePdfBuffer(data); // NOW RETURNS BUFFER

    const uint8 = new Uint8Array(pdfBuffer);
    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${data.orderID}.pdf"`,
        "Content-Length": String(uint8.length),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}

async function generatePdfBuffer(data: ReceiptData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk: Buffer | Uint8Array) => {
        buffers.push(Buffer.from(chunk));
      });
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* -------------------------------------------------
       * LOAD IMAGES (INCLUDING REMOTE URLs)
       * ------------------------------------------------- */
      async function loadImage(urlOrPath?: string) {
        if (!urlOrPath) return null;

        try {
          if (urlOrPath.startsWith("http")) {
            const res = await fetch(urlOrPath);
            const arrayBuffer = await res.arrayBuffer();
            return Buffer.from(arrayBuffer);
          } else {
            const filePath = path.resolve(process.cwd(), "public", urlOrPath);
            return fs.existsSync(filePath) ? fs.readFileSync(filePath) : null;
          }
        } catch {
          return null;
        }
      }

      /* -------------------------------------------------
       * HEADER (APPEARS ON EVERY PAGE)
       * ------------------------------------------------- */
      function drawHeader() {
        const logoPath = path.resolve(process.cwd(), "public", "images", "ontap-logo.png");
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 40, 40, { width: 70 });
        }

        doc.fontSize(18).fillColor("#0b69d1").text("OnTap Creatives", 120, 45);
        doc.fontSize(10).fillColor("#444");
        doc.text("17 Vatican City Dr, Las Piñas, Metro Manila", 120, 62);
        doc.text("ontapcreatives@gmail.com | +63 9177008364", 120, 75);

        doc.moveDown(3);
      }

      /* -------------------------------------------------
       * FOOTER (PAGE NUMBER)
       * ------------------------------------------------- */
      function drawFooter() {
        const page = doc.page;
        const bottom = page.height - 40;

        doc.fontSize(9).fillColor("#888").text(
          `Page ${page.number}`,
          40,
          bottom,
          { align: "center", width: page.width - 80 }
        );
      }

      /* -------------------------------------------------
       * PAGE BREAK (Auto when Y is too low)
       * ------------------------------------------------- */
      function checkPageBreak(extraSpace = 50) {
        if (doc.y + extraSpace >= doc.page.height - 80) {
          doc.addPage();
          drawHeader();
        }
      }

      /* -------------------------------------------------
       * RENDER HEADER FIRST PAGE
       * ------------------------------------------------- */
      drawHeader();

      /* -------------------------------------------------
       * ORDER INFO BOX
       * ------------------------------------------------- */
      const boxY = doc.y;
      doc.rect(40, boxY, 520, 65).stroke("#e6e9ef");

      doc.fontSize(12).fillColor("#000");
      doc.text(`Order ID: ${data.orderID}`, 50, boxY + 5);
      doc.fontSize(10).fillColor("#555");
      doc.text(`Date: ${new Date(data.orderDate).toLocaleString()}`, 50, boxY + 25);
      doc.text(`Payment: ${data.paymentMethod.toUpperCase()}`, 50, boxY + 42);

      doc.moveDown(5);

      /* -------------------------------------------------
       * CUSTOMER INFO
       * ------------------------------------------------- */
      doc.fontSize(13).fillColor("#0b69d1").text("Customer Information");
      doc.fontSize(10).fillColor("#222");
      doc.text(`Name: ${data.customerName}`);
      if (data.companyName) doc.text(`Company: ${data.companyName}`);
      doc.text(`Contact: ${data.contactNumber}`);
      doc.text(`Email: ${data.email}`);
      doc.text(`Delivery Address: ${data.deliveryAddress}`);

      doc.moveDown(1);

      /* -------------------------------------------------
       * ITEMS TABLE HEADER
       * ------------------------------------------------- */
      doc.fontSize(13).fillColor("#0b69d1").text("Order Items");

      const tableTop = doc.y + 5;

      const col = {
        img: 50,
        name: 120,
        qty: 350,
        price: 400,
        subtotal: 470,
      };

      // Header Bar
      doc.rect(40, tableTop - 5, 520, 20).fill("#0b69d1");
      doc.fillColor("#fff").fontSize(10);
      doc.text("Image", col.img, tableTop);
      doc.text("Item", col.name, tableTop);
      doc.text("Qty", col.qty, tableTop);
      doc.text("Price", col.price, tableTop);
      doc.text("Subtotal", col.subtotal, tableTop);

      doc.moveDown(1.5);

      /* -------------------------------------------------
       * TABLE ROWS WITH PAGE BREAK + IMAGES
       * ------------------------------------------------- */
      for (const item of data.items) {
        checkPageBreak(80);

        const imageBuffer =
          (await loadImage(item.imgUrl)) ||
          (await loadImage(item.frontUrl));

        const rowY = doc.y;

        // Alternating row background
        doc.rect(40, rowY - 3, 520, 45).fill(doc.page.number % 2 === 0 ? "#f8f9fb" : "#EEF3FB");
        doc.fillColor("#000");

        // Product image
        if (imageBuffer) {
          try {
            doc.image(imageBuffer, col.img, rowY, { width: 40, height: 40 });
          } catch {}
        }

        // Text details
        doc.fontSize(10).fillColor("#222");
        doc.text(item.name, col.name, rowY);
        doc.text(String(item.qty), col.qty, rowY);
        doc.text(`₱${item.price.toFixed(2)}`, col.price, rowY);
        doc.text(`₱${item.subtotal.toFixed(2)}`, col.subtotal, rowY);

        doc.moveDown(2.5);
      }

      /* -------------------------------------------------
       * TOTALS SECTION
       * ------------------------------------------------- */
      const total = data.subtotal - data.discount + data.shippingFee;

      doc.moveDown(2);
      checkPageBreak(100);

      doc.fontSize(11).fillColor("#000");
      doc.text(`Subtotal: ₱${data.subtotal.toFixed(2)}`, { align: "right" });
      doc.text(`Shipping Fee: ₱${data.shippingFee.toFixed(2)}`, { align: "right" });
      if (data.discount > 0)
        doc.text(`Discount: -₱${data.discount.toFixed(2)}`, { align: "right" });

      doc.moveDown(0.5);
      doc.fontSize(13).fillColor("#0b69d1").text(`Total: ₱${total.toFixed(2)}`, {
        align: "right",
      });

      /* -------------------------------------------------
       * FOOTER
       * ------------------------------------------------- */
      drawFooter();

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
