import { IoMdClose } from "react-icons/io";
import CartContent from "../cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        onClick={toggleCartDrawer}
        className={`fixed inset-0 bg-black/50 backdrop-blur-[1px] transition-all duration-300 ease-in-out z-40 ${
          drawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col z-50 rounded-l-3xl
          w-full sm:w-[80%] md:w-[28rem] lg:w-[30rem]
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold tracking-tight text-gray-800">
            Your Cart
          </h2>
          <button
            onClick={toggleCartDrawer}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow p-5 overflow-y-auto custom-scrollbar">
          {cart && cart?.products?.length > 0 ? (
            <CartContent cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                alt="Empty Cart"
                className="w-40 mb-6 opacity-80"
              />
              <h3 className="text-gray-700 text-lg font-medium">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm mt-1 mb-6">
                Looks like you haven’t added anything yet.
              </p>
              <button
                onClick={() => {
                  toggleCartDrawer();
                  navigate("/collections/all");
                }}
                className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium shadow-md hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Checkout Footer */}
        {cart && cart?.products?.length > 0 && (
          <div className="p-5 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] sticky bottom-0">
            {/* Subtotal Section */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 text-sm">Subtotal</span>
              <span className="text-lg font-semibold text-gray-900">
              ₹ {cart.totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 shadow-lg"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Shipping, taxes & discounts calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
