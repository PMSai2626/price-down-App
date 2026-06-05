"use server";

import { scrapeProduct } from "@/lib/firecrawl";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export async function addProduct(formData) {
  try {
    if (!db) {
      return { error: "Database not initialized. Please configure your environment variables in Vercel settings." };
    }
    const url = formData.get("url");
    const userId = formData.get("userId");
    const userEmail = formData.get("userEmail");

    if (!userId) {
      return { error: "AUTH_REQUIRED" };
    }

    if (!url) {
      return { error: "URL is required" };
    }

    const productData = await scrapeProduct(url);

    if (!productData?.productName) {
      return {
        error: "Could not extract product information from this URL",
      };
    }

    const currentPrice = Number(productData.currentPrice);

    const product = {
      name: productData.productName,
      currentPrice,
      imageUrl: productData.productImageUrl || "",
      currency: productData.currencyCode || "INR",
      url,
      userId,
      userEmail: userEmail || "",
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "products"), product);

    await addDoc(collection(db, "priceHistory"), {
      productId: docRef.id,
      price: currentPrice,
      checkedAt: new Date(),
    });

    revalidatePath("/");

    return {
      success: true,
      product: {
        id: docRef.id,
        ...product,
      },
      message: "Product tracked successfully!",
    };
  } catch (error) {
    console.error("Add product error:", error);
    return {
      error: error.message || "Failed to add product",
    };
  }
}

export async function getProducts(userId) {
  try {
    if (!db) {
      console.warn("getProducts check: database not initialized.");
      return [];
    }
    if (!userId) return [];

    // Use only the where clause — avoids needing a composite Firestore index.
    // We sort client-side instead.
    const q = query(
      collection(db, "products"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    const docs = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
      // Convert Firestore Timestamps to plain ISO strings so they are
      // serialisable when passed from Server → Client components.
      createdAt: item.data().createdAt?.toDate?.()?.toISOString?.() ?? null,
    }));

    // Sort newest-first in JS
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return docs;
  } catch (error) {
    console.error("Get products error:", error);
    return [];
  }
}

export async function deleteProduct(productId, userId) {
  try {
    if (!db) {
      return { error: "Database not initialized. Please configure your environment variables in Vercel settings." };
    }
    const ref = doc(db, "products", productId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.log(`deleteProduct info: Document ${productId} not found`);
      return { error: "Product not found" };
    }

    const productUserId = snap.data().userId;
    console.log(`deleteProduct check: productUserId = [${productUserId}], passed userId = [${userId}]`);

    // Allow deleting if product has no owner (legacy doc) or if the current user is the owner
    if (productUserId && productUserId !== userId) {
      console.log("deleteProduct info: Unauthorized delete attempt");
      return { error: "Unauthorized" };
    }

    await deleteDoc(ref);
    console.log(`deleteProduct success: Deleted document ${productId}`);

    // Also delete associated priceHistory docs
    try {
      const q = query(
        collection(db, "priceHistory"),
        where("productId", "==", productId)
      );
      const historySnap = await getDocs(q);
      const deletePromises = historySnap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletePromises);
      console.log(`deleteProduct success: Cleaned up ${deletePromises.length} priceHistory entries`);
    } catch (historyErr) {
      console.error("Failed to delete price history for product:", productId, historyErr);
    }

    revalidatePath("/");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("Delete product action error:", error);
    return {
      error: error.message,
    };
  }
}

export async function getPriceHistory(productId) {
  try {
    if (!db) {
      console.warn("getPriceHistory check: database not initialized.");
      return [];
    }
    const snapshot = await getDocs(collection(db, "priceHistory"));

    return snapshot.docs
      .map((item) => ({
        id: item.id,
        ...item.data(),
        checkedAt:
          item.data().checkedAt?.toDate?.()?.toISOString?.() ??
          item.data().checkedAt,
      }))
      .filter((item) => item.productId === productId)
      .sort((a, b) => new Date(a.checkedAt) - new Date(b.checkedAt));
  } catch (error) {
    console.error("Get price history error:", error);
    return [];
  }
}