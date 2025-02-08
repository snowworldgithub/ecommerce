"use client"; // This ensures the component runs on the client side

import { client } from "@/sanity/lib/client";
import { Product } from "../../../types/products";
import { groq } from "next-sanity";
import ProductDetailClient from "@/app/components/productdetailclient"; // Client component
import Customer from "@/app/components/customer";
import YouMayLike from "@/app/components/productdetail/productyoulike";
import React from "react";

interface ProductDetailPageProps {
  params: { slug: string };
}

async function getProductDetail(slug: string): Promise<Product | null> {
  return client.fetch(
    groq`*[_type == "products" && slug.current == $slug][0]{
      _id,
      name,
      price,
      discountPercent,
      rating,
      description,
      "imageUrl": image.asset->url,
    }`,
    { slug }
  );
}

export default function ProductPage({ params }: ProductDetailPageProps) {
  const { slug } = params;
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    getProductDetail(slug)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="max-w-full h-full flex-grow justify-start items-center">
      {loading ? (
        <p>Loading...</p>
      ) : product ? (
        <>
          <ProductDetailClient product={product} />
          <Customer />
          <YouMayLike />
        </>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
}
