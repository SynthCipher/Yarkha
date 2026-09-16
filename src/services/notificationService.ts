import { sendEmail } from "@/lib/email/transporter";
import { IOrder } from "@/models/Order";
import { ICustomFlowerEnquiry } from "@/models/CustomFlowerEnquiry";

export const notificationService = {
  async sendOrderConfirmation(order: IOrder) {
    const customerEmail =
      (order.customer as any)?.email || order.guestInfo?.email;
    const recipientName =
      order.deliveryAddress.fullName || order.guestInfo?.name || "Valued Customer";

    if (customerEmail) {
      const itemsHtml = order.items
        .map(
          (i) =>
            `<tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${i.title} (${i.quantity} ${i.unit})</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${i.subtotal}</td>
            </tr>`
        )
        .join("");

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917; background-color: #faf7f2; padding: 24px; border-radius: 12px;">
          <h2 style="color: #b45309; margin-bottom: 4px;">Julley, ${recipientName}!</h2>
          <p style="font-size: 16px; margin-top: 0;">Thank you for your harvest order from <strong>Yarkha Farm</strong>, Ladakh.</p>
          
          <div style="background: white; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-weight: bold;">Order Number: ${order.orderNumber}</p>
            <p style="margin: 0 0 8px; font-size: 14px; color: #666;">Delivery Address: ${order.deliveryAddress.streetAddress}, ${order.deliveryAddress.locality}, ${order.deliveryAddress.city}</p>
            ${
              order.deliverySlot
                ? `<p style="margin: 0 0 8px; font-size: 14px; color: #666;">Delivery Slot: ${order.deliverySlot.title}</p>`
                : ""
            }
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
              <thead>
                <tr style="background: #f3ede2;">
                  <th style="padding: 8px; text-align: left;">Item</th>
                  <th style="padding: 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Delivery Fee</td>
                  <td style="padding: 8px; text-align: right;">₹${order.pricing.deliveryFee}</td>
                </tr>
                ${
                  order.pricing.discount > 0
                    ? `<tr>
                        <td style="padding: 8px; font-weight: bold; color: #16a34a;">Discount</td>
                        <td style="padding: 8px; text-align: right; color: #16a34a;">-₹${order.pricing.discount}</td>
                      </tr>`
                    : ""
                }
                <tr style="font-size: 16px;">
                  <td style="padding: 8px; font-weight: bold; border-top: 2px solid #b45309;">Total</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; border-top: 2px solid #b45309; color: #b45309;">₹${order.pricing.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p style="font-size: 13px; color: #666;">
            Fresh produce is harvested in the early morning from our Stakna greenhouses and delivered directly to your doorstep.
            For any queries, WhatsApp us at +91 94191 78901.
          </p>
        </div>
      `;

      await sendEmail({
        to: customerEmail,
        subject: `Order Confirmed #${order.orderNumber} - Yarkha Farm Ladakh`,
        html,
      });
    }

    // Also notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@onela.in";
    await sendEmail({
      to: adminEmail,
      subject: `[New Order Alert] #${order.orderNumber} - ₹${order.pricing.total}`,
      html: `<p>New order received from <strong>${recipientName}</strong> for ₹${order.pricing.total}. Locality: ${order.deliveryAddress.locality}.</p>`,
    });
  },

  async sendFlowerEnquiryAlert(enquiry: ICustomFlowerEnquiry) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@onela.in";
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h3>New Custom Flower Enquiry: #${enquiry.enquiryNumber}</h3>
        <p><strong>Occasion:</strong> ${enquiry.occasion}</p>
        <p><strong>Contact:</strong> ${enquiry.contactName} (${enquiry.phone})</p>
        <p><strong>Date:</strong> ${new Date(enquiry.preferredDate).toDateString()}</p>
        <p><strong>Budget:</strong> ${enquiry.budgetRange || "Flexible"}</p>
        <p><strong>Preferences:</strong> ${enquiry.flowerPreferences || "None"}</p>
        <p><strong>Notes:</strong> ${enquiry.additionalRequirements || "None"}</p>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `[Custom Flower Request] #${enquiry.enquiryNumber} - ${enquiry.occasion}`,
      html,
    });
  },
};
