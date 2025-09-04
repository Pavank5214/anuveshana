import {BrowserRouter,Route,Routes} from "react-router-dom"
import UserLayout from "./components/layout/UserLayout"
import Home from "./pages/Home"
import {Toaster} from "sonner"
import Login from "./pages/Login"
import Register from "./pages/Register"
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
import {Provider} from "react-redux"
import store from "./redux/store"
import ProtectedRoute from "./components/common/ProtectedRoute"
import EditPortfolioPage from "./components/admin/EditPortfolioPage"
import PortfolioManagement from "./components/admin/PortfolioManagement"
import CreatePortfolioPage from "./components/admin/CreatePortfolioPage"
import ContactManagement from "./components/admin/ContactManagement"


const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path ="/upload" element={<FileUpload/>} />
          <Route path="/blog" element={<Blog/>} />
          <Route path="/about" element={<AboutUs/>} />
        
          <Route path="/contact" element={<ContactUs/>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="collections/:collection" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminHomePage />} />
        <Route path="users" element={<UserManagement />}/>
        <Route path="products" element={<ProductManagement />}/>
        <Route path="products/:id/edit" element={<EditProductPage />}/>
        <Route path="orders" element={<OrderManagement />}/>
        <Route path="products/create" element={<CreateProductPage />} />
        <Route path="portfolio" element={<PortfolioManagement />}/>
        <Route path="portfolio/:id/edit" element={<EditPortfolioPage />}/>
        <Route path="portfolio/create" element={<CreatePortfolioPage />}/>
        <Route path="contacts" element={<ContactManagement />}/>


         
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
};


export default App