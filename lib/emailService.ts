import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  customerName: string;
  orderId: string;
  orderDate: string;
  total: number;
  receiptBuffer: Buffer;
  receiptUrl: string;
}

interface AdminNotificationData {
  orderData: any;
  customerEmail: string;
  transactionId: string;
  totalAmount: number;
}

export async function sendOrderConfirmationEmail(data: EmailData): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const emailHtml = `
    <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://github.com/burnboxprinting/ontap-website/raw/main/logo-ontap.png" alt="OnTap Creatives" style="max-width: 150px;">
        </div>
        
        <h2 style="color: #2563eb; text-align: center;">Order Confirmation</h2>
        
        <p>Hi <strong>${data.customerName}</strong>,</p>
        
        <p>Thank you for your order! We're excited to let you know that we've received your order and it's now being processed.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2563eb;">Order Details</h3>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Order Date:</strong> ${data.orderDate}</p>
          <p><strong>Total Amount:</strong> ₱${data.total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</p>
        </div>
        
        <p>You can view and download your receipt anytime using the link below:</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${data.receiptUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Your Receipt
          </a>
        </div>
        
        <p><strong>What's Next?</strong></p>
        <ul>
          <li>We'll start processing your order immediately</li>
          <li>You'll receive updates on your order status</li>
          <li>For delivery orders, we'll contact you to confirm the schedule</li>
          <li>For pickup orders, we'll notify you when your order is ready</li>
        </ul>
        
        <p>If you have any questions about your order, please don't hesitate to contact us:</p>
        <ul>
          <li>Email: ontapcreatives@gmail.com</li>
          <li>Phone: +63 9177008364</li>
          <li>Address: 17 Vatican City Dr, Las Piñas, 1740 Metro Manila</li>
        </ul>
        
        <p>Thank you for choosing OnTap Creatives!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} OnTap Creatives. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"OnTap Creatives" <${process.env.SMTP_USER}>`,
    to: data.to,
    subject: `Order Confirmation - ${data.orderId}`,
    html: emailHtml,
    attachments: [
      {
        filename: `receipt-${data.orderId}.pdf`,
        content: data.receiptBuffer,
        contentType: 'application/pdf'
      }
    ]
  });
}

// NEW: Admin notification function
export async function sendAdminOrderNotification(data: AdminNotificationData): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const adminEmail = process.env.COMPANY_EMAIL;

  // ✅ ADDED: Error handling for missing admin email
  if (!adminEmail) {
    console.error('COMPANY_EMAIL not configured in environment variables');
    return;
  }

  const emailHtml = generateAdminEmailContent(data);

  try {
    await transporter.sendMail({
      from: `"OnTap Creatives Order System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `📦 New Order Received - ${data.transactionId}`,
      html: emailHtml,
    });
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    throw error;
  }
}

function generateAdminEmailContent(data: AdminNotificationData): string {
  const { orderData, customerEmail, transactionId, totalAmount } = data;
  const { contactInfo, shippingInfo, paymentInfo, items, totals } = orderData;

  const itemsHtml = items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.product.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">₱${item.product.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">₱${item.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  const shippingAddress = shippingInfo.method === 'delivery' && shippingInfo.address 
    ? `${shippingInfo.address.house}, ${shippingInfo.address.barangay}, ${shippingInfo.address.city}, ${shippingInfo.address.region} ${shippingInfo.address.zipCode}`
    : 'Store Pickup';

  return `
    <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; line-height: 1.6; color: #333;">
      <div style="max-width: 700px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #5A5CA8, #2563eb); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0 0 10px 0; font-size: 28px;">📦 New Order Received</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">Order ID: ${transactionId}</p>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${new Date().toLocaleString('en-PH', { 
            timeZone: 'Asia/Manila',
            dateStyle: 'full',
            timeStyle: 'medium'
          })}</p>
        </div>

        <!-- Urgent Alert -->
        <div style="background: #fff3cd; padding: 15px 20px; border-left: 4px solid #ffc107; margin: 0;">
          <strong>🚀 Action Required:</strong> Please process this order as soon as possible.
        </div>

        <div style="padding: 0;">
          <!-- Order Summary -->
          <div style="padding: 25px; border-bottom: 1px solid #e2e8f0;">
            <h2 style="color: #5A5CA8; margin-top: 0; border-bottom: 2px solid #5A5CA8; padding-bottom: 8px;">Order Summary</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 8px 0;"><strong>Transaction ID:</strong><br>${transactionId}</p>
                <p style="margin: 8px 0;"><strong>Total Amount:</strong><br>₱${totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p style="margin: 8px 0;"><strong>Payment Method:</strong><br>${paymentInfo.method.toUpperCase()}</p>
                <p style="margin: 8px 0;"><strong>Shipping Method:</strong><br>${shippingInfo.method.toUpperCase()}</p>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div style="padding: 25px; border-bottom: 1px solid #e2e8f0;">
            <h2 style="color: #5A5CA8; margin-top: 0; border-bottom: 2px solid #5A5CA8; padding-bottom: 8px;">Customer Information</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 8px 0;"><strong>Name:</strong><br>${contactInfo.firstName} ${contactInfo.lastName}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong><br>${customerEmail}</p>
              </div>
              <div>
                <p style="margin: 8px 0;"><strong>Contact Number:</strong><br>${contactInfo.contactNumber}</p>
                ${contactInfo.companyName ? `<p style="margin: 8px 0;"><strong>Company:</strong><br>${contactInfo.companyName}</p>` : ''}
              </div>
            </div>
          </div>

          <!-- Shipping Details -->
          <div style="padding: 25px; border-bottom: 1px solid #e2e8f0;">
            <h2 style="color: #5A5CA8; margin-top: 0; border-bottom: 2px solid #5A5CA8; padding-bottom: 8px;">Shipping Details</h2>
            <p style="margin: 8px 0;"><strong>Address:</strong><br>${shippingAddress}</p>
            ${shippingInfo.timeAvailability ? `
              <p style="margin: 8px 0;"><strong>Time Availability:</strong><br>${shippingInfo.timeAvailability.from} - ${shippingInfo.timeAvailability.to}</p>
            ` : ''}
          </div>

          <!-- Order Items -->
          <div style="padding: 25px; border-bottom: 1px solid #e2e8f0;">
            <h2 style="color: #5A5CA8; margin-top: 0; border-bottom: 2px solid #5A5CA8; padding-bottom: 8px;">Order Items</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e2e8f0;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Price</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot style="background: #f8fafc;">
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #e2e8f0;"><strong>Subtotal:</strong></td>
                  <td style="padding: 12px; text-align: right; border-top: 2px solid #e2e8f0;"><strong>₱${totals.subtotal.toFixed(2)}</strong></td>
                </tr>
                ${totals.discount > 0 ? `
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;"><strong>Discount:</strong></td>
                  <td style="padding: 12px; text-align: right;"><strong>-₱${totals.discount.toFixed(2)}</strong></td>
                </tr>
                ` : ''}
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;"><strong>Shipping Fee:</strong></td>
                  <td style="padding: 12px; text-align: right;"><strong>₱${totals.shippingFee.toFixed(2)}</strong></td>
                </tr>
                <tr style="background: #e8f4fd;">
                  <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #5A5CA8;"><strong>Total Amount:</strong></td>
                  <td style="padding: 12px; text-align: right; border-top: 2px solid #5A5CA8;"><strong>₱${totalAmount.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Next Steps -->
          <div style="padding: 25px; background: #f8fafc;">
            <h2 style="color: #5A5CA8; margin-top: 0;">Next Steps</h2>
            <ol style="margin: 15px 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Review order details and verify payment</li>
              <li style="margin-bottom: 8px;">Contact customer if additional information is needed: <strong>${contactInfo.contactNumber}</strong></li>
              <li style="margin-bottom: 8px;">Update order status in the system</li>
              <li style="margin-bottom: 8px;">Begin production/order processing</li>
              <li>Schedule delivery or prepare for pickup</li>
            </ol>
            
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #5A5CA8;">
              <p style="margin: 0;"><strong>Customer Contact:</strong> ${contactInfo.contactNumber}</p>
              <p style="margin: 5px 0 0 0;"><strong>Customer Email:</strong> ${customerEmail}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1e293b; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">This is an automated notification from OnTap Creatives Order System</p>
          <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} OnTap Creatives. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;
}