"use client";

import React, { useState } from "react";
import { Input } from "./input";
import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { AuthModel } from "./AuthModel";
import { addProduct } from "@/app/actions";
import { toast } from "sonner";

const AddProductForm = ({ user }) => {
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
    const result = await addProduct(formData);
    if (result?.error === "AUTH_REQUIRED") {
      setShowAuthModel(true); // 🔐 OPEN GOOGLE LOGIN
      setLoading(false);
      return;
    }
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product tracked successfully!");
      setUrl("");
    }
    setLoading(false);
  };

  return (
    <>
      <form className="w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="url"
            className="h-12 text-base"
            required
            placeholder="Paste product URL (Amazon, Walmart, etc.)"
            disabled={loading}
            value={url}
            onChange={handleChange}
          />
          <Button
            className="bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8"
            type="submit"
            disabled={loading}
            size={"lg"}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Track Price"
            )}
          </Button>
        </div>
      </form>

      {/* { Auth Model} */}
      <AuthModel
        isOpen={showAuthModel}
        onClose={() => setShowAuthModel(false)}
      />
    </>
  );
};

export default AddProductForm;
