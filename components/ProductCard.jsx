"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trash2,
  TrendingDown,
  ImageOff,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { deleteProduct } from "@/app/actions";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const PriceChart = dynamic(() => import("./PriceChart"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-8 text-gray-500 w-full">
      <Loader2 className="w-5 h-5 animate-spin mr-2" />
      Loading chart...
    </div>
  ),
});

const ProductCard = ({ product, userId, onDeleted }) => {
  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return;

    setDeleting(true);

    const result = await deleteProduct(product.id, userId);

    if (result?.error) {
      toast.error(result.error);
      setDeleting(false);
    } else {
      toast.success("Product removed from tracking");
      if (onDeleted) onDeleted(product.id);
    }
  };

  const currency = product.currency || "₹";
  const currencySymbol =
    currency === "INR"
      ? "₹"
      : currency === "USD"
      ? "$"
      : currency === "EUR"
      ? "€"
      : currency === "GBP"
      ? "£"
      : currency;

  return (
    <Card className="hover:shadow-lg dark:hover:shadow-zinc-950/30 transition-all duration-200 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
      <CardHeader className="pb-3 bg-white dark:bg-zinc-900">
        <div className="flex gap-4">
          {/* Product image */}
          {product.imageUrl && !imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-xl border border-gray-100 dark:border-zinc-800 flex-shrink-0"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-24 h-24 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-850 flex items-center justify-center flex-shrink-0">
              <ImageOff className="w-8 h-8 text-gray-300 dark:text-zinc-600" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-zinc-50 line-clamp-2 mb-2 text-sm leading-snug">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-bold text-orange-500">
                {currencySymbol}
                {Number(product.currentPrice).toLocaleString("en-IN")}
              </span>

              <Badge
                variant="secondary"
                className="gap-1 text-xs bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50"
              >
                <TrendingDown className="w-3 h-3" />
                Tracking
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3 bg-white dark:bg-zinc-900">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChart(!showChart)}
            className="gap-1 text-xs h-8 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            {showChart ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Hide Chart
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Price History
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1 text-xs h-8 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <Link href={product.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" />
              View Product
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1 text-xs h-8 ml-auto"
          >
            <Trash2 className="w-3 h-3" />
            {deleting ? "Removing…" : "Remove"}
          </Button>
        </div>
      </CardContent>

      {showChart && (
        <CardFooter className="bg-gray-50 dark:bg-zinc-950/40 border-t border-gray-100 dark:border-zinc-800 pt-3">
          <PriceChart productId={product.id} />
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;