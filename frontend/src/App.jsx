import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserLayout from "./components/layout/UserLayout"
import Home from "./pages/Home"
import { Toaster } from "sonner"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import Profile from "./components/products/Profile"
import CollectionPage from "./pages/CollectionPage"
import ProductDetails from "./components/products/ProductDetails"
import Checkout from "./components/cart/Checkout"
import OrderConfirmationPage from "./pages/OrderConfirmationPage"
import OrderDetailsPage from "./pages/OrderDetailsPage"
import MyOrdersPage from "./pages/MyOrdersPage"
import AdminLayout from "./components/admin/AdminLayout"
import AdminHomePage from "./pages/AdminHomePage"
import UserManagement from "./components/admin/UserManagement"
import ProductManagement from "./components/admin/ProductManagement"
import EditProductPage from "./components/admin/EditProductPage"
import OrderManagement from "./components/admin/OrderManagement"
import CreateProductPage from "./components/admin/CreateProductPage"
import Portfolio from "./pages/Portfolio"
import Blog from "./pages/Blog"
import FileUpload from "./components/common/FileUpload"
import AboutUs from "./components/common/AboutUs"
import ContactUs from "./components/common/ContactUs"
import { Provider } from "react-redux"
import store from "./redux/store"
import ProtectedRoute from "./components/common/ProtectedRoute"
import EditPortfolioPage from "./components/admin/EditPortfolioPage"
import PortfolioManagement from "./components/admin/PortfolioManagement"
import CreatePortfolioPage from "./components/admin/CreatePortfolioPage"
import ContactManagement from "./components/admin/ContactManagement"
import AdminOrderDetailsPage from "./components/admin/AdminOrderDetailsPage"
import DualNamePlank from "./pages/DualNamePlank";
import InitialNameStand from "./pages/InitialNameStand";
import NameKeychain from "./pages/NameKeychain";
import OrderSupport from "./pages/OrderSupport";
import TicketChat from "./components/support/TicketChat";
import TicketManagement from "./components/admin/TicketManagement";
import { HelmetProvider } from "react-helmet-async";

import { GoogleOAuthProvider } from "@react-oauth/google"

const App = () => {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/upload" element={<FileUpload />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/visualize/dual-name-plank" element={<DualNamePlank />} />
                <Route path="/visualize/initial-name-stand" element={<InitialNameStand />} />
                <Route path="/visualize/keychain" element={<NameKeychain />} />

                <Route path="/contact" element={<ContactUs />} />
                <Route path="/support/order" element={<ProtectedRoute><OrderSupport /></ProtectedRoute>} />
                <Route path="/support/chat/:id" element={<ProtectedRoute><TicketChat /></ProtectedRoute>} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="collections/:collection" element={<CollectionPage />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="order-confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
                <Route path="order/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
                <Route path="my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminHomePage />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/:id/edit" element={<EditProductPage />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
                <Route path="products/create" element={<CreateProductPage />} />
                <Route path="portfolio" element={<PortfolioManagement />} />
                <Route path="portfolio/:id/edit" element={<EditPortfolioPage />} />
                <Route path="portfolio/create" element={<CreatePortfolioPage />} />
                <Route path="contacts" element={<ContactManagement />} />
                <Route path="tickets" element={<TicketManagement />} />



              </Route>
            </Routes>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </Provider>
    </HelmetProvider>
  );
};


export default App