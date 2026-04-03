const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log("SMTP Configuration Error:", error);
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
});

const sendEmail = async (options) => {
    const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${options.to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendOrderPlacementEmail = async (order) => {
    const orderItemsHtml = order.orderItems.map(item => `
        <tr style="border-bottom: 2px solid #f4f4f4;">
            <td style="padding: 15px 0;">
                <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;">
            </td>
            <td style="padding: 15px 10px;">
                <div style="font-weight: 600; color: #1a1a1a; font-size: 16px;">${item.name}</div>
                <div style="color: #666; font-size: 13px; margin-top: 4px;">
                    ${item.size ? `Size: ${item.size} | ` : ''}
                    ${item.custName ? `Name: ${item.custName} | ` : ''}
                    ${item.personalization ? Object.entries(item.personalization instanceof Map ? Object.fromEntries(item.personalization) : item.personalization).map(([k, v]) => `${k}: ${v}`).join(' | ') : ''}
                </div>
            </td>
            <td style="padding: 15px 0; text-align: right; font-weight: 600; color: #1a1a1a;">
                ${item.quantity} x ₹${item.price}
            </td>
        </tr>
    `).join('');

    const paymentId = order.paymentDetails?.razorpay_payment_id || order.paymentDetails?.id || 'N/A';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { padding: 40px 20px; text-align: center; background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%); color: #ffffff; }
            .content { padding: 40px 30px; }
            .summary-box { background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 30px; border: 1px solid #edf2f7; }
            .footer { padding: 40px 20px; text-align: center; background: #f8f9fa; border-top: 1px solid #edf2f7; font-size: 13px; color: #718096; }
            .button { display: inline-block; padding: 14px 30px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 25px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td>
                            <div style="text-transform: uppercase; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1; letter-spacing: -0.5px;">Anuveshana</div>
                            <div style="text-transform: uppercase; font-size: 10px; font-weight: 700; color: #ff6200; letter-spacing: 0.2em; line-height: 1; margin-top: 2px;">Technologies</div>
                        </td>
                    </tr>
                </table>
                <h1 style="margin: 25px 0 0 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Order Confirmed!</h1>
            </div>
            
            <div class="content">
                <p style="font-size: 18px; margin-top: 0;">Hi ${order.user.name.split(' ')[0] || 'Customer'},</p>
                <p>We've received your order and are getting it ready for production. Here's what happens next:</p>
                
                <div class="summary-box">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="color: #666;">Order Number</span>
                        <span style="font-weight: 600; color: #1a1a1a; font-size: 13px;">#${order.orderId || order._id}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="color: #666;">Payment Method</span>
                        <span style="font-weight: 600; color: #1a1a1a;">${order.paymentMethod}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="color: #666;">Payment ID</span>
                        <span style="font-weight: 600; color: #1a1a1a; font-size: 13px;">${paymentId}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 5px;">
                        <span style="font-size: 18px; font-weight: 700;">Total Paid</span>
                        <span style="font-size: 18px; font-weight: 700; color: #000;">₹${order.totalPrice}</span>
                    </div>
                </div>

                <h3 style="font-size: 18px; font-weight: 700; border-bottom: 1px solid #edf2f7; padding-bottom: 12px;">Order Items</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    ${orderItemsHtml}
                </table>

                <div style="margin-top: 40px; border-top: 1px solid #edf2f7; padding-top: 30px;">
                    <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 10px;">Delivery To</h3>
                    <p style="margin: 0; font-size: 15px; color: #4a5568;">
                        ${order.shippingAddress.address}<br>
                        ${order.shippingAddress.city}, ${order.shippingAddress.pincode}<br>
                    </p>
                </div>

                <div style="text-align: center;">
                    <a href="https://www.anuveshanatechnologies.in/order/${order._id}" class="button">View Order Status</a>
                </div>
            </div>

            <div class="footer">
                <p style="margin-bottom: 10px; font-weight: 600; color: #1a1a1a;">Anuveshana Technologies</p>
                <p>Nizamabad, Telangana, India</p>
                <p>Contact: +91 (your-number) | Support: <a href="https://www.anuveshanatechnologies.in/support/order?orderId=${order._id}" style="color: #0066ff; text-decoration: none;">Click Here</a></p>
                <div style="margin-top: 20px;">
                    <a href="#" style="margin: 0 10px; color: #2d3748;"><img src="https://cdn-icons-png.flaticon.com/32/733/733558.png" width="20" height="20"></a>
                    <a href="#" style="margin: 0 10px; color: #2d3748;"><img src="https://cdn-icons-png.flaticon.com/32/2111/2111463.png" width="20" height="20"></a>
                </div>
                <p style="margin-top: 25px; opacity: 0.6;">&copy; ${new Date().getFullYear()} Anuveshana Technologies. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await sendEmail({
        to: order.email,
        subject: `Your Anuveshana Order Confirmation (#${order.orderId || order._id})`,
        html,
    });
};

const sendOrderStatusUpdateEmail = async (order) => {
    let statusMessage = '';
    let statusColor = '#0066ff'; // Electric blue for updates
    let statusIcon = '📦';

    switch (order.status) {
        case 'Placed':
            statusMessage = 'Your order is in the queue and will be processed soon.';
            break;
        case 'Processing':
            statusMessage = 'Our team is currently preparing your custom order with care.';
            statusIcon = '⚙️';
            break;
        case 'Printing':
            statusMessage = 'Your items are now on the printing press! Almost there.';
            statusIcon = '🖨️';
            break;
        case 'Shipped':
            statusMessage = 'Your package is on its way! Get ready to receive your items.';
            statusIcon = '🚚';
            break;
        case 'Delivered':
            statusMessage = 'Your order has been delivered successfully. Enjoy!';
            statusColor = '#00c853'; // Vibrant green
            statusIcon = '🎉';
            break;
        case 'Cancelled':
            statusMessage = 'Your order has been cancelled. If this was a mistake, let us know.';
            statusColor = '#ff3d00'; // Vibrant red
            statusIcon = '❌';
            break;
        default:
            statusMessage = `Your order status has changed to ${order.status}.`;
    }

    let trackingHtml = '';
    if (order.status === 'Shipped' && (order.trackingId || order.trackingUrl)) {
        trackingHtml = `
            <div style="background-color: #f0f7ff; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #d0e4ff; text-align: center;">
                <h3 style="margin-top: 0; color: #0066ff; font-size: 18px;">Track Your Delivery</h3>
                <div style="font-size: 15px; color: #4a5568; margin-bottom: 15px;">
                    ${order.courier ? `<strong>Courier:</strong> ${order.courier}<br>` : ''}
                    ${order.trackingId ? `<strong>Tracking ID:</strong> ${order.trackingId}` : ''}
                </div>
                ${order.trackingUrl ? `<a href="${order.trackingUrl}" style="display: inline-block; padding: 12px 25px; background: #0066ff; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Track Package Now</a>` : ''}
            </div>
        `;
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #edf2f7; }
            .content { padding: 50px 40px; text-align: center; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
            .footer { padding: 40px 20px; text-align: center; background: #f8f9fa; border-top: 1px solid #edf2f7; font-size: 13px; color: #718096; }
        </style>
    </head>
    <body>
        <div class="container">
            <div style="padding: 30px; text-align: center; border-bottom: 1px solid #edf2f7; background: #0b0f19;">
                <div style="display: inline-block; vertical-align: middle; text-align: left;">
                    <div style="text-transform: uppercase; font-size: 18px; font-weight: 800; color: #ffffff; line-height: 1; letter-spacing: -0.5px;">Anuveshana</div>
                    <div style="text-transform: uppercase; font-size: 9px; font-weight: 700; color: #ff6200; letter-spacing: 0.2em; line-height: 1; margin-top: 2px;">Technologies</div>
                </div>
            </div>
            
            <div class="content">
                <div style="font-size: 48px; margin-bottom: 20px;">${statusIcon}</div>
                <div class="status-badge" style="background-color: ${statusColor}15; color: ${statusColor}; border: 1px solid ${statusColor}30;">
                    ${order.status}
                </div>
                <h2 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 700;">Order Update for <span style="font-size: 14px;">#${order.orderId || order._id}</span></h2>
                <p style="font-size: 16px; color: #4a5568; margin-bottom: 30px;">${statusMessage}</p>

                ${trackingHtml}

                <div style="margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 30px; text-align: left;">
                    <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 15px; color: #1a1a1a;">Items in this order</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${order.orderItems.map(item => `
                            <tr style="border-bottom: 1px solid #f4f4f4;">
                                <td style="padding: 10px 0;">
                                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
                                </td>
                                <td style="padding: 10px;">
                                    <div style="font-weight: 600; color: #1a1a1a; font-size: 14px;">${item.name}</div>
                                    <div style="color: #666; font-size: 12px; margin-top: 2px;">
                                        Qty: ${item.quantity} | 
                                        ${item.size ? `Size: ${item.size} | ` : ''}
                                        ${item.personalization ? Object.entries(item.personalization instanceof Map ? Object.fromEntries(item.personalization) : item.personalization).map(([k, v]) => `${k}: ${v}`).join(' | ') : ''}
                                    </div>
                                </td>
                                <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #1a1a1a; font-size: 14px;">
                                    ₹${item.price * item.quantity}
                                </td>
                            </tr>
                        `).join('')}
                    </table>
                </div>

                <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #edf2f7;">
                    <p style="font-size: 14px; color: #718096;">Need help? Reply to this email or visit our <a href="https://www.anuveshanatechnologies.in/support/order?orderId=${order._id}" style="color: #0066ff;">support center</a>.</p>
                </div>
            </div>

            <div class="footer">
                <p style="margin-bottom: 5px; font-weight: 600; color: #1a1a1a;">Anuveshana Technologies</p>
                <p>&copy; ${new Date().getFullYear()} Anuveshana. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await sendEmail({
        to: order.email,
        subject: `[Update] Your Order #${order.orderId || order._id} is now ${order.status}`,
        html,
    });
};

const sendOTPEmail = async (user, otp) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #edf2f7; }
            .content { padding: 50px 40px; text-align: center; }
            .otp-code { display: inline-block; padding: 15px 30px; background-color: #f0f7ff; color: #0066ff; font-size: 32px; font-weight: 800; letter-spacing: 8px; border-radius: 12px; margin: 25px 0; border: 1px solid #d0e4ff; }
            .footer { padding: 40px 20px; text-align: center; background: #f8f9fa; border-top: 1px solid #edf2f7; font-size: 13px; color: #718096; }
        </style>
    </head>
    <body>
        <div class="container">
            <div style="padding: 30px; text-align: center; border-bottom: 1px solid #edf2f7; background: #0b0f19;">
                <div style="display: inline-block; text-align: left;">
                    <div style="text-transform: uppercase; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1; letter-spacing: -0.5px;">Anuveshana</div>
                    <div style="text-transform: uppercase; font-size: 10px; font-weight: 700; color: #ff6200; letter-spacing: 0.2em; line-height: 1; margin-top: 3px;">Technologies</div>
                </div>
            </div>
            
            <div class="content">
                <h2 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 700;">Password Reset OTP</h2>
                <p style="font-size: 16px; color: #4a5568;">Hi ${user.name},</p>
                <p style="font-size: 16px; color: #4a5568;">You requested to reset your password. Use the following OTP code to proceed. This code is valid for 10 minutes.</p>
                
                <div class="otp-code">${otp}</div>

                <p style="font-size: 14px; color: #718096; margin-top: 30px;">If you didn't request this, you can safely ignore this email.</p>
            </div>

            <div class="footer">
                <p style="margin-bottom: 5px; font-weight: 600; color: #1a1a1a;">Anuveshana Technologies</p>
                <p>&copy; ${new Date().getFullYear()} Anuveshana. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await sendEmail({
        to: user.email,
        subject: `[OTP] Your Password Reset Code - Anuveshana`,
        html,
    });
};

const sendTicketNotificationEmail = async (ticket, message, recipient) => {
    const isToAdmin = recipient === 'admin';
    const recipientEmail = isToAdmin ? process.env.FROM_EMAIL : ticket.user.email;
    const ticketId = ticket.ticketId || ticket._id.toString().slice(-6).toUpperCase();

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #edf2f7; border-radius: 12px; overflow: hidden; }
            .header { background: #0b0f19; padding: 30px; text-align: center; }
            .content { padding: 40px; }
            .message-box { background: #f8f9fa; border-left: 4px solid #ff6200; padding: 20px; border-radius: 4px; margin: 20px 0; font-style: italic; }
            .footer { padding: 30px; background: #f8f9fa; text-align: center; font-size: 12px; color: #718096; }
            .button { display: inline-block; padding: 12px 25px; background: #ff6200; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 20px; text-transform: uppercase; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div style="text-align: left; display: inline-block;">
                    <div style="color: #ffffff; font-weight: 800; font-size: 18px; line-height: 1;">ANUVESHANA</div>
                    <div style="color: #ff6200; font-weight: 700; font-size: 9px; letter-spacing: 0.1em; margin-top: 2px;">TECHNOLOGIES</div>
                </div>
            </div>
            <div class="content">
                <h2 style="margin-top: 0; color: #1a1a1a;">${isToAdmin ? 'New Support Activity' : 'Support Reply Received'}</h2>
                <p>Hi ${isToAdmin ? 'Admin' : (ticket.user.name.split(' ')[0] || 'Customer')},</p>
                <p>There is new activity on ticket <strong>#AH-${ticketId}</strong> [${ticket.subject}]:</p>
                
                <div class="message-box">
                    "${message}"
                </div>

                <div style="text-align: center;">
                    <a href="${isToAdmin ? 'https://www.anuveshanatechnologies.in/admin/tickets' : `https://www.anuveshanatechnologies.in/order-support?id=${ticket._id}`}" class="button">View & Reply</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Anuveshana Technologies. Nizamabad, Telangana.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await sendEmail({
        to: recipientEmail,
        subject: `[Support #AH-${ticketId}] ${isToAdmin ? 'New Activity' : 'Update from Support'}`,
        html,
    });
};

module.exports = {
    sendOrderPlacementEmail,
    sendOrderStatusUpdateEmail,
    sendOTPEmail,
    sendTicketNotificationEmail,
};
