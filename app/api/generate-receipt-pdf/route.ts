// app/api/generate-receipt-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

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
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let browser = null;
  
  try {
    const receiptData: ReceiptData = await request.json();
    
    // Validate required fields
    if (!receiptData.orderID || !receiptData.customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Configure for Vercel
    const isProduction = process.env.NODE_ENV === 'production';
    
    const browserOptions: any = {
      args: isProduction ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1200, height: 1600 },
      executablePath: isProduction 
        ? await chromium.executablePath()
        : process.platform === 'win32' 
          ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
          : process.platform === 'darwin'
            ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
            : '/usr/bin/google-chrome',
      headless: true,
    };

    browser = await puppeteer.launch(browserOptions);

    const page = await browser.newPage();
    
    // Generate HTML content using the beautiful design
    const htmlContent = generateReceiptHTML(receiptData);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.2in',
        right: '0.2in',
        bottom: '0.2in',
        left: '0.2in'
      }
    });

    // Convert Uint8Array to Buffer properly
    const pdfBuffer = Buffer.from(pdf);

    // Return PDF directly as buffer
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${receiptData.orderID}.pdf"`,
      },
    });

  } catch (error) {
    // Fallback: return HTML if PDF generation fails
    try {
      const receiptData: ReceiptData = await request.json();
      const htmlContent = generateReceiptHTML(receiptData);
      
      return NextResponse.json(
        { 
          error: 'PDF generation failed, returning HTML as fallback',
          html: htmlContent,
          orderID: receiptData.orderID
        },
        { status: 200 }
      );
    } catch (fallbackError) {
      return NextResponse.json(
        { 
          error: 'Failed to generate PDF or HTML',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function generateReceiptHTML(data: ReceiptData): string {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      fullDate: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const formattedDate = formatDate(data.orderDate);
  const discountPercentage = data.discount > 0 ? Math.round((data.discount / data.subtotal) * 100) : 0;

  // Default tracking events
  const defaultTrackingEvents = [
    {
      timestamp: data.orderDate,
      title: 'Order Placed Successfully',
      description: 'Your order has been received and is being processed'
    },
    {
      timestamp: new Date(new Date(data.orderDate).getTime() + 30 * 60 * 1000).toISOString(),
      title: 'Payment Confirmed',
      description: 'Your payment has been confirmed'
    }
  ];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', Arial, sans-serif;
          background-color: #f9fafb;
          color: #333;
          line-height: 1.2;
          width: 100%;
          height: max-content;
          padding: 16px;
        }
        
        .receipt-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
        }
        
        .main-receipt {
          background: white;
          border: 1px solid #d1d5db;
          width: 100%;
        }
        
        .header-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 8px;
          width: 100%;
        }
        
        .logo img {
          height: 50px;
          width: 60px;
          object-fit: cover;
          object-position: center;
        }
        
        .contact-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 10px;
          font-weight: 700;
          color: #1e40af;
          line-height: 1.1;
        }
        
        .contact-info a {
          color: #1e40af;
          text-decoration: none;
        }
        
        .phone-numbers {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 6px 0 10px 0;
          border-bottom: 1px solid #d1d5db;
          color: #1e40af;
          font-size: 10px;
          font-weight: 700;
        }
        
        .phone-numbers a {
          color: #1e40af;
          text-decoration: none;
        }
        
        .order-details {
          width: 100%;
          padding: 16px 8px 8px 8px;
          gap: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid #d1d5db;
        }
        
        .order-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .order-id {
          font-size: 14px;
          font-weight: 700;
        }
        
        .order-date {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 8px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          line-height: 1.1;
        }
        
        .customer-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }
        
        .customer-field {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        
        .field-label {
          font-size: 8px;
          text-transform: uppercase;
          font-weight: 700;
          color: #6b7280;
          margin: 0 0 2px 0;
          padding-bottom: 5px;
        }
        
        .field-value {
          padding: 0 8px 6px 8px;
          background-color: #f9fafb;
          font-weight: 700;
          font-size: 10px;
          border-radius: 4px;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        .tracking-section {
          padding: 8px;
          gap: 8px;
          display: flex;
          flex-direction: column;
        }
        
        .tracking-title {
          font-size: 12px;
          font-weight: 700;
        }
        
        .tracking-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
        
        .tracking-event {
          display: flex;
          flex-direction: column;
          padding-left: 16px;
          padding-top: 8px;
          padding-bottom: 8px;
          position: relative;
        }
        
        .tracking-dot {
          height: 8px;
          width: 8px;
          background-color: #2563eb;
          border-radius: 1px;
          position: absolute;
          z-index: 20;
          left: 0;
          top: 2px;
        }
        
        .tracking-dot.circle {
          border-radius: 50%;
          top: 6px;
        }
        
        .tracking-line {
          height: 100%;
          width: 1px;
          background-color: #d1d5db;
          position: absolute;
          left: 3px;
          top: 10px;
        }
        
        .tracking-line.long {
          top: 14px;
        }
        
        .tracking-time {
          text-transform: uppercase;
          font-weight: 800;
          font-size: 8px;
          color: #6b7280;
          margin: 0 0 4px 0;
        }
        
        .tracking-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .tracking-main {
          font-size: 10px;
          font-weight: 800;
          color: #1e40af;
          line-height: 1.1;
        }
        
        .tracking-main span {
          color: black;
          font-weight: normal;
        }
        
        .tracking-desc {
          font-size: 8px;
          color: #6b7280;
          line-height: 1.2;
        }
        
        .items-section {
          background: white;
          border: 1px solid #d1d5db;
          display: flex;
          flex-direction: column;
          padding: 12px;
          width: 100%;
        }
        
        .items-title {
          font-size: 14px;
          color: #1e40af;
          font-weight: 700;
          margin: 0 0 16px 0;
        }
        
        .item-row {
          display: flex;
          width: 100%;
          padding: 8px 0;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .item-image {
          height: 40px;
          width: 40px;
          background-color: #dbeafe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          color: #6b7280;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .item-details {
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .item-name {
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          font-size: 10px;
          margin: 0;
        }
        
        .item-logo {
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          margin: 2px 0 0 0;
        }
        
        .logo-highlight {
          color: #1e40af;
          font-weight: 700;
        }
        
        .item-pricing {
          width: 50%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
        }
        
        .price-row, .subtotal-row {
          font-size: 8px;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .price-row {
          color: #6b7280;
        }
        
        .subtotal-row {
          color: #1e40af;
        }
        
        .price-large, .subtotal-large {
          font-size: 9px;
          font-weight: 700;
        }
        
        .subtotal-large {
          font-size: 11px;
        }
        
        .quantity {
          color: #6b7280;
          font-size: 10px;
          font-weight: 700;
        }
        
        .shipping-payment-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          align-items: flex-start;
          gap: 8px;
        }
        
        .shipping-method, .payment-method {
          background: white;
          border: 1px solid #d1d5db;
          display: flex;
          flex-direction: column;
          padding: 8px;
        }
        
        .section-title {
          font-size: 11px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }
        
        .shipping-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .shipping-icon {
          height: 24px;
          width: 24px;
          border-radius: 6px;
          background-color: #1e40af;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        
        .shipping-details {
          width: 100%;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .shipping-type {
          font-weight: 800;
          color: #374151;
        }
        
        .shipping-price {
          font-size: 8px;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .payment-header {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .cod-badge {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 6px 8px;
          color: white;
          border-radius: 4px;
          background-color: #1e40af;
        }
        
        .cod-text {
          text-transform: uppercase;
          font-weight: 700;
          font-size: 8px;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        
        .cod-price {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 8px;
        }
        
        .online-payment {
          display: flex;
          flex-direction: column;
          width: 100%;
          background-color: #1e40af;
          color: white;
          padding: 8px;
          border-radius: 4px;
        }
        
        .payment-type {
          text-transform: uppercase;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        
        .payment-details {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-top: 4px;
        }
        
        .payment-method-name {
          font-weight: 800;
          font-size: 10px;
        }
        
        .payment-total {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 8px;
        }
        
        .summary-section {
          background: white;
          border: 1px solid #d1d5db;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        
        .summary-title {
          font-size: 12px;
          font-weight: 700;
          padding: 8px;
          margin: 0;
        }
        
        .summary-content {
          display: flex;
          flex-direction: column;
        }
        
        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 12px;
        }
        
        .summary-label {
          font-weight: 800;
          font-size: 10px;
        }
        
        .summary-value {
          font-size: 8px;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .summary-large {
          font-weight: 800;
          font-size: 11px;
        }
        
        .discount-percentage {
          margin-right: auto;
          font-weight: 600;
          font-size: 8px;
        }
        
        .total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background-color: #1e40af;
          color: white;
          margin-top: 8px;
        }
        
        .total-label {
          font-weight: 800;
          font-size: 14px;
        }
        
        .total-value {
          font-size: 10px;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        .total-large {
          font-weight: 800;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <!-- Main Receipt Card -->
        <div class="main-receipt">
          <!-- Header -->
          <div class="header-section">
            <div class="logo">
              <img src="https://ontap.ph/images/ontap-logo.png" alt="OnTap Logo" />
            </div>
            <div class="contact-info">
              <div>ontapcreatives@gmail.com</div>
              <div>17 Vatican City Dr, Las Piñas, 1740 Metro Manila</div>
              <div>ON TAP CREATIVES</div>
            </div>
          </div>

          <!-- Phone Numbers -->
          <div class="phone-numbers">
            <div>+63 9177008364</div>•
            <div>+63 9764183188</div>•
            <div>+63 9764183189</div>
          </div>

          <!-- Order Details -->
          <div class="order-details">
            <div class="order-header">
              <h2 class="order-id">Order #${data.orderID}</h2>
              <div class="order-date">
                <strong>${formattedDate.fullDate}</strong>
                <strong>${formattedDate.weekday} • ${formattedDate.time}</strong>
              </div>
            </div>
            
            <div class="customer-grid">
              <div class="customer-field">
                <p class="field-label">Client Name</p>
                <div class="field-value">${data.customerName}</div>
              </div>
              <div class="customer-field">
                <p class="field-label">Company</p>
                <div class="field-value">${data.companyName || 'N/A'}</div>
              </div>
              <div class="customer-field">
                <p class="field-label">Contact number</p>
                <div class="field-value">${data.contactNumber}</div>
              </div>
              <div class="customer-field">
                <p class="field-label">Email Address</p>
                <div class="field-value">${data.email}</div>
              </div>
              <div class="customer-field full-width">
                <p class="field-label">${data.shippingMethod === 'delivery' ? 'Delivery Address' : 'Pickup Location'}</p>
                <div class="field-value">${data.deliveryAddress}</div>
              </div>
            </div>
          </div>

          <!-- Order Tracking -->
          <div class="tracking-section">
            <span class="tracking-title">Order Tracking</span>
            <div class="tracking-grid">
              ${defaultTrackingEvents.map((event, index) => {
                const eventDate = formatDate(event.timestamp);
                return `
                  <div class="tracking-event">
                    <div class="tracking-dot ${index === 0 ? '' : 'circle'}"></div>
                    <div class="tracking-line ${index === 0 ? '' : 'long'}"></div>
                    <strong class="tracking-time">${index === 0 ? 'today' : 'next steps'}</strong>
                    <div class="tracking-content">
                      <strong class="tracking-main">
                        ${eventDate.time} <span> ● ${event.title}</span>
                      </strong>
                      ${event.description ? `<p class="tracking-desc">${event.description}</p>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Items and Summary Section -->
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          <!-- Items Section -->
          <div class="items-section">
            <h2 class="items-title">Items</h2>
            <div>
              ${data.items.map((item, index) => `
                <div class="item-row">
                  <img src="${item.frontUrl || item.imgUrl || ''}" alt="${item.name}" class="item-image" />
                  <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-logo">Logo: <span class="logo-highlight">${item.logo}</span></p>
                  </div>
                  <div class="item-pricing">
                    <p class="price-row">₱ <strong class="price-large">${formatCurrency(item.price)}</strong></p>
                    <strong class="quantity">${item.qty}</strong>
                    <p class="subtotal-row">₱ <strong class="subtotal-large">${formatCurrency(item.subtotal)}</strong></p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Shipping & Payment -->
          <div class="shipping-payment-grid">
            <!-- Shipping Method -->
            <div class="shipping-method">
              <span class="section-title">Shipping Method</span>
              <div class="shipping-content">
                <div class="shipping-icon">
                  ${data.shippingMethod === 'delivery' ? '🚚' : '🏪'}
                </div>
                <div class="shipping-details">
                  <strong class="shipping-type">
                    ${data.shippingMethod === 'delivery' ? 'Door-to-door Delivery' : 'Pick up at Store'}
                  </strong>
                  <span class="shipping-price">
                    ₱<strong class="price-large">${data.shippingMethod === 'delivery' ? formatCurrency(data.shippingFee) : '0.00'}</strong>
                  </span>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="payment-method">
              <div class="payment-header">
                <span class="section-title">Mode of Payment</span>
              </div>
              ${data.paymentMethod === 'cod' ? `
                <div class="cod-badge">
                  <span class="cod-text">🚚 cash on delivery</span>
                  <p class="cod-price">₱<span class="price-large">${formatCurrency(data.total)}</span></p>
                </div>
              ` : `
                <div class="online-payment">
                  <p class="payment-type">${data.paymentMethod}</p>
                  <div class="payment-details">
                    <span class="payment-method-name">${data.paymentMethod.toUpperCase()} PAYMENT</span>
                    <p class="payment-total">₱<span class="price-large">${formatCurrency(data.total)}</span></p>
                  </div>
                </div>
              `}
            </div>
          </div>

          <!-- Summary -->
          <div class="summary-section">
            <span class="summary-title">Summary</span>
            <div class="summary-content">
              <div class="summary-row">
                <strong class="summary-label">Subtotal</strong>
                <span class="summary-value">₱<strong class="summary-large">${formatCurrency(data.subtotal)}</strong></span>
              </div>
              <div class="summary-row">
                <strong class="summary-label">Delivery Fee</strong>
                <span class="summary-value">₱<strong class="summary-large">${formatCurrency(data.shippingFee)}</strong></span>
              </div>
              ${data.discount > 0 ? `
                <div class="summary-row">
                  <strong class="summary-label">Discount</strong>
                  <strong class="discount-percentage">(${discountPercentage}% less)</strong>
                  <span class="summary-value">₱<strong class="summary-large">${formatCurrency(data.discount)}</strong></span>
                </div>
              ` : ''}
              <div class="total-row">
                <strong class="total-label">Total</strong>
                <span class="total-value">₱<strong class="total-large">${formatCurrency(data.total)}</strong></span>
              </div>
            </div>
          </div>
        </div>
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