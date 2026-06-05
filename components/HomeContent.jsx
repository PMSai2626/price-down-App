"use client";

import { useState, useEffect, useCallback } from "react";
import AddProductForm from "@/components/ui/AddProduct-Form";
import AuthButton from "@/components/ui/AuthButton";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/components/AuthProvider";
import { getProducts } from "@/app/actions";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Bell,
  ChevronDown,
  Rabbit,
  Shield,
  TrendingDown,
  PackageSearch,
  Loader2,
} from "lucide-react";

const FEATURES = [
  {
    icon: Rabbit,
    title: "Lightning Fast",
    description:
      "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
  },
  {
    icon: Shield,
    title: "Always Reliable",
    description:
      "Works across all major e-commerce sites with built-in anti-bot protection",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified instantly when prices drop below your target",
  },
];

export default function HomeContent() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      return;
    }
    setProductsLoading(true);
    try {
      const data = await getProducts(user.uid);
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setProductsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductAdded = useCallback((newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  }, []);

  const handleProductDeleted = useCallback((productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-200">
      {/* ── Header ── */}
      <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="flex items-center gap-3 font-extrabold text-4xl tracking-tight">
            <span className="text-5xl text-orange-600">💸</span>
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Price Drop
            </span>
            <ChevronDown className="w-6 h-6 text-orange-500 animate-bounce" />
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthButton user={user} />
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 px-6 py-2 rounded-full text-sm font-medium mb-6">
            Made with ❤️ by Sai Kumar
          </div>

          <h2 className="text-5xl font-bold text-gray-900 dark:text-zinc-50 mb-4 transition-colors">
            Never Miss a Price Drop Again!
          </h2>

          <p className="text-xl text-gray-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto transition-colors">
            Track prices across Amazon, Flipkart, Zara &amp; more. Get an
            instant email the moment the price drops.
          </p>

          <AddProductForm user={user} onProductAdded={handleProductAdded} />

          {/* Feature grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 hover:shadow-md dark:hover:shadow-zinc-950/30 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-zinc-50 mb-2 transition-colors">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400 transition-colors">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tracked Products ── */}
      {!authLoading && user && (
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-2 transition-colors">
                <TrendingDown className="w-6 h-6 text-orange-500" />
                Your Tracked Products
                {products.length > 0 && (
                  <span className="ml-2 text-sm font-normal bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                    {products.length}
                  </span>
                )}
              </h2>
            </div>

            {/* Loading skeleton */}
            {productsLoading && (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!productsLoading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 transition-colors">
                <PackageSearch className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-zinc-300 mb-1 transition-colors">
                  No products tracked yet
                </h3>
                <p className="text-sm text-gray-400 dark:text-zinc-500 max-w-xs transition-colors">
                  Paste any product URL above and we&apos;ll start monitoring
                  the price for you.
                </p>
              </div>
            )}

            {/* Product grid */}
            {!productsLoading && products.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    userId={user.uid}
                    onDeleted={handleProductDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Prompt to sign in */}
      {!authLoading && !user && (
        <section className="px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 transition-colors">
              <span className="text-5xl mb-4">🔒</span>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-zinc-300 mb-1 transition-colors">
                Sign in to track products
              </h3>
              <p className="text-sm text-gray-400 dark:text-zinc-500 transition-colors">
                Create a free account and start monitoring prices instantly.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}