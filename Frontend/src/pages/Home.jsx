import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel, Categories, ProductList } from "../components";
import { Link, useOutletContext } from "react-router-dom";

const Home = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // const { searchTerm } = useOutletContext();
  const { searchTerm = "" } = useOutletContext() || {};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "https://dummyjson.com/products?limit=194"
        );

        console.log("All products: ", data);

        const uniqueCategories = [
          ...new Set(data.products.map((p) => p.category)),
        ];

        const limitedCategories = uniqueCategories.slice(0, 6).reverse();

        const groupedProducts = limitedCategories.reduce((acc, category) => {
          acc[category] = data.products
            .filter((p) => p.category === category)
            .slice(0, 8);
          return acc;
        }, {});

        setCategories(limitedCategories);
        setProductsByCategory(groupedProducts);
        setAllProducts(data.products);
        setFilteredProducts(data.products); // Initial full product list
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on the search term
    if (searchTerm.trim() === "") {
      setFilteredProducts(allProducts);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = allProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, allProducts]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-gray-100  mt-20">
      <Carousel />

      <Categories categories={categories} />

      {searchTerm.trim() !== "" ? (
        <div className="my-10">
          <h2 className="font-poppins text-2xl font-bold text-center mb-6 text-gray-800">
            Search Results for "{searchTerm}"
          </h2>
          {filteredProducts.length > 0 ? (
            <ProductList products={filteredProducts} />
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      ) : (
        categories.map((category) => (
          <div key={category} className="my-10">
            <h2
              className="text-4xl uppercase font-extrabold text-center mb-6 text-gray-800 tracking-wider leading-tight"
              style={{ fontFamily: "Edu AU VIC WA NT Arrows" }}
            >
              {category}
            </h2>
            <ProductList products={productsByCategory[category]} />
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
