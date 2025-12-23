import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPriceDropAlert(
  userEmail,
  product,
  oldPrice,
  newPrice
) {
  try {
    const priceDrop = oldPrice - newPrice;
    const percentageDrop = ((priceDrop / oldPrice) * 100).toFixed(1);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: userEmail,
      subject: `📉 Price Drop: ${product.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2 style="color:#FA5D19;">Price Drop Alert 🎉</h2>

          <p><strong>${product.name}</strong></p>

          <p>
            <span style="text-decoration:line-through;color:#9ca3af;">
              ${product.currency} ${oldPrice.toFixed(2)}
            </span>
            →
            <span style="color:#16a34a;font-weight:bold;">
              ${product.currency} ${newPrice.toFixed(2)}
            </span>
          </p>

          <p style="color:#16a34a;">
            You save ${product.currency} ${priceDrop.toFixed(2)}
            (${percentageDrop}% off)
          </p>

          <a href="${product.url}"
             style="display:inline-block;margin-top:16px;padding:10px 16px;
                    background:#FA5D19;color:#fff;text-decoration:none;
                    border-radius:6px;">
            View Product
          </a>

          <p style="margin-top:24px;font-size:12px;color:#6b7280;">
            You’re receiving this email because you’re tracking this product.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email error:", error);
    return { error: error.message };
  }
}
