import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

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
  }[];
  shippingMethod: string;
  shippingFee: number;
  paymentMethod: string;
  discount: number;
  subtotal: number;
  total: number;
  orderDate: string;
}

export async function POST(request: NextRequest) {
  let browser;
  
  try {
    const receiptData: ReceiptData = await request.json();

    console.log('🔍 Generating PDF for order:', receiptData.orderID);

    // Validate required fields
    if (!receiptData.orderID || !receiptData.customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate PDF with Puppeteer
    let pdfBuffer: Buffer;
    let generationMethod = 'puppeteer';
    
    try {
      console.log('🔍 Launching Puppeteer for PDF generation...');
      
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      
      // Generate HTML for receipt
      const htmlContent = generateReceiptHTML(receiptData);
      
      await page.setContent(htmlContent, { 
        waitUntil: ['networkidle0', 'domcontentloaded'] 
      });
      
      await page.emulateMediaType('screen');

      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        displayHeaderFooter: false,
        preferCSSPageSize: true
      });

      pdfBuffer = Buffer.from(pdf);
      console.log(`✅ PDF generated successfully, size: ${pdfBuffer.length} bytes`);

    } catch (puppeteerError) {
      console.error('❌ Puppeteer PDF generation failed:', puppeteerError);
      
      // Fallback to simple HTML-based PDF
      try {
        console.log('🔍 Attempting HTML fallback...');
        pdfBuffer = await generateFallbackPDF(receiptData);
        generationMethod = 'html-fallback';
      } catch (fallbackError) {
        console.error('❌ HTML fallback failed:', fallbackError);
        throw new Error('All PDF generation methods failed');
      }
    }

    // Return PDF as response
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${receiptData.orderID}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'X-Generation-Method': generationMethod,
      },
    });

  } catch (error) {
    console.error('🔍 PDF generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Please try the client-side fallback method'
      },
      { status: 500 }
    );
  } finally {
    // Close browser if it was opened
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
}

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
                <td>${item.name}</td>
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

// HTML-based fallback using the same receipt template
async function generateFallbackPDF(receiptData: ReceiptData): Promise<Buffer> {
  console.log('🔍 Using HTML fallback for:', receiptData.orderID);
  
  // This would use an alternative PDF library if Puppeteer fails
  // For now, we'll throw an error to trigger client-side fallback
  throw new Error('HTML fallback not implemented - use client-side generation');
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