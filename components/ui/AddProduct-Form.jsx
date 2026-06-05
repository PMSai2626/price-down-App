"use client";

import React, { useState } from "react";
import { Input } from "./input";
import { Loader2, Link2 } from "lucide-react";
import { Button } from "./button";
import { AuthModel } from "./AuthModel";
import { addProduct } from "@/app/actions";
import { toast } from "sonner";

const AddProductForm = ({ user, onProductAdded }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModel, setShowAuthModel] = useState(false);

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setShowAuthModel(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("url", url);
    formData.append("userId", user.uid);
    formData.append("userEmail", user.email || "");

    const result = await addProduct(formData);

    if (result?.error === "AUTH_REQUIRED") {
      setShowAuthModel(true);
      setLoading(false);
      return;
    }

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product tracked successfully!");
      setUrl("");
      if (onProductAdded) onProductAdded(result.product);
    }

    setLoading(false);
  };

  return (
    <>
      <form className="w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              type="url"
              className="h-12 text-base pl-9"
              required
              placeholder="Paste any product URL (Amazon, Flipkart, Zara…)"
              disabled={loading}
              value={url}
              onChange={handleChange}
            />
          </div>
          <Button
            className="bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8"
            type="submit"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tracking…
              </>
            ) : (
              "Track Price"
            )}
          </Button>
        </div>
      </form>

      <AuthModel
        isOpen={showAuthModel}
        onClose={() => setShowAuthModel(false)}
      />
    </>
  );
};

export default AddProductForm;
