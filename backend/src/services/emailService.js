import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for FashionHub Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to FashionHub!</h2>
        <p>Hi ${name},</p>
        <p>Your One-Time Password (OTP) for email verification is:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <h1 style="letter-spacing: 5px; margin: 0; color: #333;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2026 FashionHub. All rights reserved.</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

const sendOrderConfirmationEmail = async (email, order, customer) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px;">${item.productName}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">৳${item.price.toFixed(2)}</td>
        <td style="padding: 10px; text-align: right;">৳${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join('')

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmation - #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Confirmed!</h2>
        <p>Hi ${customer.name},</p>
        <p>Thank you for your order. Here are your order details:</p>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span style="color: #ffa500;">Pending</span></p>
        </div>

        <h3>Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right;">
          <p><strong>Subtotal:</strong> ৳${order.subtotal?.toFixed(2) || 0}</p>
          ${order.discount ? `<p><strong style="color: green;">Discount:</strong> -৳${order.discount.toFixed(2)}</p>` : ''}
          <p><strong>Shipping:</strong> ৳${order.shipping?.toFixed(2) || 0}</p>
          <h3 style="border-top: 2px solid #ddd; padding-top: 10px;">Total: ৳${order.total?.toFixed(2) || 0}</h3>
        </div>

        <h3>Shipping Address</h3>
        <p>
          ${order.shippingAddress.line1}<br />
          ${order.shippingAddress.city}, ${order.shippingAddress.upazila}<br />
          ${order.shippingAddress.division} ${order.shippingAddress.postalCode}
        </p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Next Step:</strong> Please submit your payment proof within 24 hours to confirm your order.</p>
        </div>

        <p>If you have any questions, please contact our support team.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2026 FashionHub. All rights reserved.</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

const sendPaymentReceivedEmail = async (email, order, customer) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `Payment Received - Order #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: green;">✓ Payment Received!</h2>
        <p>Hi ${customer.name},</p>
        <p>We have received your payment for order <strong>#${order._id}</strong>.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid green;">
          <p style="margin: 0; color: green;"><strong>Payment Status: CONFIRMED</strong></p>
          <p style="margin: 10px 0 0 0; color: #666;">Your order is now being processed and will be shipped soon.</p>
        </div>

        <h3>Order Summary</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Total:</strong> ৳${order.total?.toFixed(2) || 0}</p>
        <p><strong>Payment Method:</strong> bKash</p>

        <p>You will receive a shipping notification with tracking details as soon as your order is dispatched.</p>

        <p>Thank you for your business!</p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2026 FashionHub. All rights reserved.</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

const sendShippingNotificationEmail = async (email, order, customer) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `Your Order is on its Way - Order #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Order is Shipping!</h2>
        <p>Hi ${customer.name},</p>
        <p>Great news! Your order has been dispatched and is on its way to you.</p>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Tracking Number:</strong> ${order.trackingNumber || 'N/A'}</p>
          <p style="margin: 10px 0 0 0;"><strong>Carrier:</strong> Standard Shipping</p>
          <p style="margin: 10px 0 0 0;"><strong>Estimated Delivery:</strong> 3-5 business days</p>
        </div>

        <h3>Shipping Address</h3>
        <p>
          ${order.shippingAddress.line1}<br />
          ${order.shippingAddress.city}, ${order.shippingAddress.upazila}<br />
          ${order.shippingAddress.division} ${order.shippingAddress.postalCode}
        </p>

        <p>You can track your order status on our website using your order ID.</p>
        <p>Thank you for shopping with us!</p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2026 FashionHub. All rights reserved.</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

const sendDeliveryNotificationEmail = async (email, order, customer) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `Delivery Confirmed - Order #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: green;">✓ Order Delivered!</h2>
        <p>Hi ${customer.name},</p>
        <p>Your order has been successfully delivered.</p>

        <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid green;">
          <p style="margin: 0; color: green;"><strong>Delivery Status: COMPLETED</strong></p>
        </div>

        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Delivery Date:</strong> ${new Date(order.updatedAt).toLocaleDateString()}</p>

        <div style="background: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>How was your experience?</strong></p>
          <p style="margin: 10px 0 0 0; color: #666;">Please share your feedback by reviewing the products.</p>
        </div>

        <p>Thank you for shopping with FashionHub. We hope to see you again soon!</p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2026 FashionHub. All rights reserved.</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

const sendPasswordResetEmail = async (email, resetLink, name) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - FashionHub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the link below to proceed:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2026 FashionHub. All rights reserved.</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

const sendMarketingEmail = async (emails, subject, htmlContent) => {
  if (!Array.isArray(emails) || emails.length === 0) {
    throw new Error('Invalid email list')
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    bcc: emails.join(','),
    subject,
    html: htmlContent,
  }

  return transporter.sendMail(mailOptions)
}

export default {
  sendOTPEmail,
  sendOrderConfirmationEmail,
  sendPaymentReceivedEmail,
  sendShippingNotificationEmail,
  sendDeliveryNotificationEmail,
  sendPasswordResetEmail,
  sendMarketingEmail,
}
