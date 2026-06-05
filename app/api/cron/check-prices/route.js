import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { scrapeProduct } from "@/lib/firecrawl";
import { sendPriceDropAlert } from "@/lib/Email";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";

export async function GET(request) {
  // ── Auth: require CRON_SECRET header ──────────────────────────────────────
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = [];

  try {
    // 1. Load all tracked products
    const snapshot = await getDocs(collection(db, "products"));
    const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    for (const product of products) {
      try {
        // 2. Re-scrape the product page
        const scraped = await scrapeProduct(product.url);
        const newPrice = Number(scraped.currentPrice);
        const oldPrice = Number(product.currentPrice);

        // 3. Record price history regardless
        await addDoc(collection(db, "priceHistory"), {
          productId: product.id,
          price: newPrice,
          checkedAt: Timestamp.now(),
        });

        // 4. Price dropped → update doc + send email
        if (newPrice < oldPrice && product.userEmail) {
          await updateDoc(doc(db, "products", product.id), {
            currentPrice: newPrice,
          });

          const emailResult = await sendPriceDropAlert(
            product.userEmail,
            {
              name: product.name,
              url: product.url,
              currency:
                product.currency === "INR"
                  ? "₹"
                  : product.currency === "USD"
                  ? "$"
                  : product.currency || "₹",
            },
            oldPrice,
            newPrice
          );

          results.push({
            productId: product.id,
            name: product.name,
            oldPrice,
            newPrice,
            priceDrop: true,
            emailSent: !emailResult.error,
          });
        } else {
          // Price unchanged or went up — still update stored price
          if (newPrice !== oldPrice) {
            await updateDoc(doc(db, "products", product.id), {
              currentPrice: newPrice,
            });
          }

          results.push({
            productId: product.id,
            name: product.name,
            oldPrice,
            newPrice,
            priceDrop: false,
            emailSent: false,
          });
        }
      } catch (err) {
        console.error(`Failed to check product ${product.id}:`, err.message);
        results.push({
          productId: product.id,
          name: product.name,
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      checked: products.length,
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}