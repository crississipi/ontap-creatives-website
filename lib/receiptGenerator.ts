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
  orderDate: string;
}

export async function generateReceiptPDF(receiptData: ReceiptData): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Generate HTML for receipt
    const htmlContent = generateReceiptHTML(receiptData);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    // Convert Uint8Array to Buffer
    const pdfBuffer = Buffer.from(pdfUint8Array);
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

function generateReceiptHTML(data: ReceiptData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
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
          margin-bottom: 10px;
        }
        .receipt-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
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
          text-align: right;
          margin-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .grand-total {
          font-size: 18px;
          font-weight: bold;
          border-top: 2px solid #2563eb;
          padding-top: 10px;
          margin-top: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #666;
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
        <div><strong>Delivery:</strong> ${data.deliveryAddress}</div>
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
          <span>₱${(data.subtotal - (data.discount > 0 ? data.discount : 0) + data.shippingFee).toFixed(2)}</span>
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