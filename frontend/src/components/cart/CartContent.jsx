import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handle quantity updates
  const handleAddToCart = (
    productId,
    delta,
    quantity,
    size,
    color
  ) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div className="space-y-5">
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-28 object-cover rounded-lg border border-gray-100"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between flex-grow">
            <div>
              <h3 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Name:{" "}
              <span className="font-medium">{product.custName}</span> <br/>
                Size: 
                <span className="font-medium">{product.size}</span> <br/>
                TextColor:{" "}
                <span className="font-medium mr-2">{product.textColor}</span> <br/>
                 BaseColor:{" "}
                <span className="font-medium">{product.baseColor}</span>
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center mt-3">
              <button
                onClick={() =>
                  handleAddToCart(
                    product.productId,
                    -1,
                    product.quantity,
                    product.size,
                    product.color
                  )
                }
                className="border rounded-full w-7 h-7 flex items-center justify-center text-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <span className="mx-3 font-medium text-gray-700">
                {product.quantity}
              </span>
              <button
                onClick={() =>
                  handleAddToCart(
                    product.productId,
                    1,
                    product.quantity,
                    product.size,
                    product.color
                  )
                }
                className="border rounded-full w-7 h-7 flex items-center justify-center text-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Price & Delete */}
          <div className="flex flex-col items-end justify-between">
            <p className="text-base sm:text-lg font-semibold text-gray-800">
            ₹ {product.price.toLocaleString()}
            </p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
              className="mt-3 p-2 rounded-full hover:bg-red-50 transition-colors"
            >
              <RiDeleteBin3Line className="h-5 w-5 text-red-500 hover:text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;
