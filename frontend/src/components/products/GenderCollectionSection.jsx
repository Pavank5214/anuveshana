import React from "react";
import { Link } from "react-router-dom";
import mensCollectionImage from "../../assets/mens-collection.webp";
import womensCollectionImage from "../../assets/womens-collection.webp";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Women's Collection */}
        <div className="relative flex-1 group overflow-hidden rounded-2xl shadow-xl">
          <img
            src={womensCollectionImage}
            alt="Women's Collection"
            className="w-full h-[500px] md:h-[700px] object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 backdrop-blur-md bg-white/20 p-5 rounded-xl shadow-md">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="inline-block bg-white text-gray-900 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-[#ea2e0e] hover:text-white transition duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Men's Collection */}
        <div className="relative flex-1 group overflow-hidden rounded-2xl shadow-xl">
          <img
            src={mensCollectionImage}
            alt="Men's Collection"
            className="w-full h-[500px] md:h-[700px] object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 backdrop-blur-md bg-white/20 p-5 rounded-xl shadow-md">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="inline-block bg-white text-gray-900 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-[#ea2e0e] hover:text-white transition duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
