import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import CustomerReviews from "../components/Products/CustomerReviews";
import AdditionalMetadata from "../components/Products/AdditionalMetadata";
import Specifications from "../components/Products/Specifications";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `https://dummyjson.com/products/${productId}`
        );
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product details", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6 mt-20">
      <ProductDetails product={product} />

      <div className="flex flex-col lg:flex-row justify-between gap-4 mt-8">
        <div className="w-full lg:w-1/2">
          <Specifications product={product} />
        </div>
        <div className="w-full lg:w-1/2">
          <CustomerReviews reviews={product.reviews} />
        </div>
      </div>

      <AdditionalMetadata meta={product.meta} />
    </div>
  );
};

export default ProductPage;
