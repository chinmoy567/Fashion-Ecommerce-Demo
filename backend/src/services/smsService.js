import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

const sendOTPSMS = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your FashionHub OTP is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })

    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error('SMS sending failed:', error)
    throw new Error('Failed to send SMS')
  }
}

const sendOrderConfirmationSMS = async (phoneNumber, orderId, total) => {
  try {
    const message = await client.messages.create({
      body: `Order confirmed! ID: ${orderId}. Total: ৳${total.toFixed(2)}. Reply STOP to unsubscribe.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })

    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error('SMS sending failed:', error)
    throw new Error('Failed to send SMS')
  }
}

const sendPaymentReminderSMS = async (phoneNumber, orderId, hours = 24) => {
  try {
    const message = await client.messages.create({
      body: `Reminder: Submit payment for order ${orderId} within ${hours}h to confirm. https://fashionhub.com/orders/${orderId}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })

    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error('SMS sending failed:', error)
    throw new Error('Failed to send SMS')
  }
}

const sendShippingNotificationSMS = async (phoneNumber, orderId, trackingNumber) => {
  try {
    const message = await client.messages.create({
      body: `Your order ${orderId} is shipping! Tracking: ${trackingNumber}. Track here: https://fashionhub.com/track/${trackingNumber}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })

    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error('SMS sending failed:', error)
    throw new Error('Failed to send SMS')
  }
}

const sendDeliveryNotificationSMS = async (phoneNumber, orderId) => {
  try {
    const message = await client.messages.create({
      body: `Good news! Your order ${orderId} has been delivered. Share your feedback: https://fashionhub.com/reviews`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })

    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error('SMS sending failed:', error)
    throw new Error('Failed to send SMS')
  }
}

const sendPromotionalSMS = async (phoneNumbers, promotionMessage) => {
  if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
    throw new Error('Invalid phone number list')
  }

  try {
    const messages = []

    for (const phoneNumber of phoneNumbers) {
      const message = await client.messages.create({
        body: promotionMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      })
      messages.push({
        phoneNumber,
        messageId: message.sid,
        status: message.status,
      })
    }

    return {
      success: true,
      totalSent: messages.length,
      messages,
    }
  } catch (error) {
    console.error('SMS sending failed:', error)
    throw new Error('Failed to send SMS batch')
  }
}

const sendTwoFactorAuthSMS = async (phoneNumber, code) => {
  try {
    const message = await client.messages.create({
      body: `Your FashionHub authentication code is: ${code}. Do not share this code.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })

    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error('SMS sending failed:', error)
    throw new Error('Failed to send SMS')
  }
}

export default {
  sendOTPSMS,
  sendOrderConfirmationSMS,
  sendPaymentReminderSMS,
  sendShippingNotificationSMS,
  sendDeliveryNotificationSMS,
  sendPromotionalSMS,
  sendTwoFactorAuthSMS,
}
