import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { mergeCart } from "../redux/slices/cartSlice";
import { Loader2 } from "lucide-react";
import logo from "../assets/logo.png";
import loginIllustration from "../assets/Login.png"; // Add a cool SVG illustration

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading , error} = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left Side Illustration */}
        <div className="hidden md:flex bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center p-8">
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="w-4/5 max-w-md animate-fadeIn"
          />
        </div>

        {/* Right Side Login Form */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          {/* Logo */}
          <div className="flex justify-center items-center mb-6">
            <img src={logo} alt="Logo" className="w-16 h-16 object-contain mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Anuveshana Technologies
            </h2>
          </div>

          {/* Welcome Text */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-2 text-gray-900">
            Welcome Back!
          </h2>
          <p className="text-gray-500 text-center mb-6 text-sm sm:text-base">
            Please login to your account to continue
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
              {/* Error Message */}
              {error && (
              <div className="bg-red-100 text-red-700 border border-red-400 rounded-lg px-4 py-2 text-center animate-fadeIn">
                {error || "Invalid credentials. Please try again."}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : ""}
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-gray-600 text-sm sm:text-base">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-600 hover:underline font-semibold"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
