import Firecrawl from "@mendable/firecrawl-js";

// The v4.x SDK exposes scrapeUrl directly on the Firecrawl instance
const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    const result = await firecrawl.v1.scrapeUrl(url, {
      formats: ["extract"],
      extract: {
        schema: {
          type: "object",
          required: ["productName", "currentPrice"],
          properties: {
            productName: {
              type: "string",
            },
            currentPrice: {
              type: "number",
            },
            currencyCode: {
              type: "string",
            },
            productImageUrl: {
              type: "string",
            },
          },
        },
        prompt:
          "Extract the product name as 'productName', the current selling price as a plain number with no currency symbols as 'currentPrice', the currency code (INR, USD, EUR, GBP, etc.) as 'currencyCode', and the main product image URL as 'productImageUrl'.",
      },
      // Extra wait time for JS-heavy sites like Zara
      waitFor: 3000,
    });

    const extractedData = result.extract;

    if (!extractedData || !extractedData.productName) {
      throw new Error("No product data could be extracted from this URL");
    }

    return extractedData;
  } catch (error) {
    console.error("Firecrawl scrape error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
