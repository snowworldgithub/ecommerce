import { client } from "@/sanity/lib/client";
import { Product } from "../../../types/products";
import { groq } from "next-sanity";
import ProductDetailClient from "@/app/components/productdetailclient"; // Client component
import Customer from "@/app/components/customer";
import YouMayLike from "@/app/components/productdetail/productyoulike";

// type ProductDetailPageProps = {
//   params: { slug: string }; // ✅ Fixed
// };

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

// export default async function ProductPage({ params }: ProductDetailPageProps) {
//   const { slug } = params; // ✅ No more errors
//   const product = await getProductDetail(slug);

//   return (
//     <div className="max-w-full h-full flex-grow justify-start items-center">
//       {/* Pass product data to the client component */}
//       <ProductDetailClient product={product} />
//       <Customer />
//       <YouMayLike />
//     </div>
//   );
// }

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params; // ✅ This should now work fine
  const product = await getProductDetail(slug);

  return (
    <div className="max-w-full h-full flex-grow justify-start items-center">
      <ProductDetailClient product={product} />
      <Customer />
      <YouMayLike />
    </div>
  );
}
