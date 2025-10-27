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