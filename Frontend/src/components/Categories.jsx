import React from "react";
import { useNavigate } from "react-router-dom";

const Categories = ({ categories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <h2
        className="text-3xl font-extrabold mb-6 text-center text-purple-800"
        style={{ fontFamily: "Cinzel Decorative, cursive" }}
      >
        Shop by Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out flex justify-center items-center text-center"
            style={{
              backgroundImage: `url('/img/category-bg.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <p className="capitalize font-bold text-gray-800">{category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
