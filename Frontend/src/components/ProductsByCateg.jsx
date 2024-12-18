import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductList from "./ProductList";

const ProductsByCateg = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      await axios
        .get("https://dummyjson.com/products?limit=194")
        .then((res) => {
          setProducts(res.data.products);
        })
        .catch((err) => {
          console.log("Error while fetching products: ", err);
        });
    };
    fetchProductsByCategory();
  }, [category]); // Added dependency array to re-fetch if category changes

  // Filter products by category
  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen py-10 mt-20">
      <div className="container mx-auto px-4 ">
        <h2
          className="text-4xl font-bold text-center mb-8"
          style={{
            fontFamily: "'Cinzel Decorative', cursive",
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          Products by <span className="text-red-600 uppercase">{category}</span>
        </h2>
        {filteredProducts.length > 0 ? (
          <ProductList products={filteredProducts} />
        ) : (
          <p className="text-center text-gray-600 mt-10">
            No products found in the{" "}
            <span className="font-bold">{category}</span> category.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductsByCateg;
