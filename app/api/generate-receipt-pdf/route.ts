import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

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

export async function POST(request: NextRequest) {
  try {
    const receiptData: ReceiptData = await request.json();
    
    // Validate required fields
    if (!receiptData.orderID || !receiptData.customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate PDF binary using PDFKit and return as application/pdf
    const pdfBuffer = await generatePdfBuffer(receiptData);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${receiptData.orderID}.pdf"`,
        'Content-Length': String(pdfBuffer.length)
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Your existing generateReceiptHTML function remains the same
function generateReceiptHTML(data: ReceiptData): string {
  const total = data.subtotal - (data.discount > 0 ? data.discount : 0) + data.shippingFee;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          line-height: 1.4;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 8px;
        }
        .receipt-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 12px;
        }
        .items-table th,
        .items-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .items-table th {
          background-color: #f8fafc;
          font-weight: bold;
        }
        .totals {
          margin-top: 20px;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .grand-total {
          font-size: 16px;
          font-weight: bold;
          border-top: 2px solid #2563eb;
          padding-top: 10px;
          margin-top: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 11px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }
        @media print {
          body { 
            padding: 0; 
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">OnTap Creatives</div>
        <div>17 Vatican City Dr, Las Piñas, 1740 Metro Manila</div>
        <div>ontapcreatives@gmail.com | +63 9177008364</div>
      </div>
      
      <div class="receipt-info">
        <div>
          <strong>Order ID:</strong> ${data.orderID}<br>
          <strong>Date:</strong> ${new Date(data.orderDate).toLocaleDateString()}
        </div>
        <div>
          <strong>Payment Method:</strong> ${data.paymentMethod.toUpperCase()}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Customer Information</div>
        <div><strong>Name:</strong> ${data.customerName}</div>
        <div><strong>Company:</strong> ${data.companyName || 'N/A'}</div>
        <div><strong>Contact:</strong> ${data.contactNumber}</div>
        <div><strong>Email:</strong> ${data.email}</div>
        <div><strong>Delivery Address:</strong> ${data.deliveryAddress}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Order Items</div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Logo</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td><img alt='item image' src='${item.frontUrl || item.imgUrl}'/>${item.name}</td>
                <td>${item.logo}</td>
                <td>${item.qty}</td>
                <td>₱${item.price.toFixed(2)}</td>
                <td>₱${item.subtotal.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>₱${data.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Shipping Fee:</span>
          <span>₱${data.shippingFee.toFixed(2)}</span>
        </div>
        ${data.discount > 0 ? `
        <div class="total-row">
          <span>Discount:</span>
          <span>-₱${data.discount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>₱${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="footer">
        Thank you for your order!<br>
        For any inquiries, please contact us at ontapcreatives@gmail.com
      </div>
    </body>
    </html>
  `;
}

export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed. Use POST.',
      example: {
        method: 'POST',
        body: {
          orderID: 'TXN-123456789',
          customerName: 'John Doe',
          companyName: 'Example Corp',
          contactNumber: '+1234567890',
          email: 'john@example.com',
          deliveryAddress: '123 Main St, City, Country',
          items: [
            {
              name: 'Business Cards',
              qty: 2,
              price: 100.00,
              subtotal: 200.00,
              logo: 'Standard'
            }
          ],
          shippingMethod: 'delivery',
          shippingFee: 50.00,
          paymentMethod: 'cod',
          discount: 0,
          subtotal: 200.00,
          total: 250.00,
          orderDate: new Date().toISOString()
        }
      }
    },
    { status: 405 }
  );
}

// Generate PDF buffer from receipt data using PDFKit
function generateSimpleTableRow(doc: PDFKit.PDFDocument, left: string, right: string) {
  doc.fontSize(10).text(left, { continued: true });
  doc.text(right, { align: 'right' });
}

function generatePdfBuffer(data: ReceiptData): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks: Uint8Array[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdf = Buffer.concat(chunks as any);
        resolve(new Uint8Array(pdf));
      });

        // Header with logo
        const logoPath = path.resolve(process.cwd(), 'public', 'images', 'ontap-logo.png');
        if (fs.existsSync(logoPath)) {
          try { doc.image(logoPath, 40, 45, { width: 80 }); } catch (e) { /* ignore image errors */ }
        }

        doc.fontSize(18).fillColor('#0b69d1').text('OnTap Creatives', 140, 50, { align: 'left' });
        doc.fontSize(9).fillColor('#444').text('17 Vatican City Dr, Las Piñas, 1740 Metro Manila', 140, 72);
        doc.text('ontapcreatives@gmail.com | +63 9177008364', 140, 84);
        doc.moveDown(3);

      // Order info
        // Order info box
        const startY = doc.y;
        doc.rect(40, startY, doc.page.width - 80, 70).stroke('#e6e9ef');
        doc.fontSize(11).fillColor('#000').text(`Order ID: ${data.orderID}`, 50, startY + 8);
        doc.fontSize(10).fillColor('#555').text(`Date: ${new Date(data.orderDate).toLocaleString()}`, 50, startY + 26);
        doc.fontSize(10).fillColor('#555').text(`Payment: ${data.paymentMethod.toUpperCase()}`, 50, startY + 44);
        doc.moveDown(5);

      // Customer
        // Customer
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor('#0b69d1').text('Customer Information');
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor('#222').text(`Name: ${data.customerName}`);
        if (data.companyName) doc.text(`Company: ${data.companyName}`);
        doc.text(`Contact: ${data.contactNumber}`);
        doc.text(`Email: ${data.email}`);
        doc.text(`Delivery Address: ${data.deliveryAddress}`);
        doc.moveDown();

      // Items table header
        // Items table header
        doc.fontSize(12).fillColor('#0b69d1').text('Order Items');
        doc.moveDown(0.5);

        const tableTop = doc.y;
        const columnPositions = {
          name: 50,
          logo: 300,
          qty: 380,
          price: 430,
          subtotal: 500
        };

        // Header row
        doc.fontSize(10).fillColor('#ffffff');
        doc.rect(40, tableTop - 4, doc.page.width - 80, 20).fill('#0b69d1');
        doc.fillColor('#fff').text('Item', columnPositions.name, tableTop);
        doc.text('Logo', columnPositions.logo, tableTop);
        doc.text('Qty', columnPositions.qty, tableTop);
        doc.text('Price', columnPositions.price, tableTop);
        doc.text('Subtotal', columnPositions.subtotal, tableTop);
        doc.moveDown(1.2);

        // Rows
        let rowY = doc.y;
        data.items.forEach((item, idx) => {
          const isEven = idx % 2 === 0;
          if (!isEven) {
            doc.rect(40, rowY - 2, doc.page.width - 80, 18).fill('#f6f8fb');
            doc.fillColor('#222');
          } else {
            doc.fillColor('#222');
          }

          doc.text(item.name, columnPositions.name, rowY);
          doc.text(item.logo || '-', columnPositions.logo, rowY);
          doc.text(String(item.qty), columnPositions.qty, rowY);
          doc.text(`₱${(item.price || 0).toFixed(2)}`, columnPositions.price, rowY);
          doc.text(`₱${(item.subtotal || 0).toFixed(2)}`, columnPositions.subtotal, rowY);

          rowY += 18;
          doc.y = rowY;
        });

        doc.moveTo(40, rowY).stroke();
        doc.moveDown();

      
      // Totals
      doc.fontSize(10);
      generateSimpleTableRow(doc, 'Subtotal:', `₱${(data.subtotal || 0).toFixed(2)}`);
      generateSimpleTableRow(doc, 'Shipping Fee:', `₱${(data.shippingFee || 0).toFixed(2)}`);
      if (data.discount && data.discount > 0) {
        generateSimpleTableRow(doc, 'Discount:', `-₱${(data.discount || 0).toFixed(2)}`);
      }
      const grandTotal = (data.subtotal || 0) - (data.discount || 0) + (data.shippingFee || 0);
      doc.moveDown(0.5);
      doc.fontSize(12).text(`Total: ₱${grandTotal.toFixed(2)}`, { align: 'right' });

      doc.moveDown(2);
      doc.fontSize(10).fillColor('#666').text('Thank you for your order! For inquiries contact ontapcreatives@gmail.com', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}