const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const userRoutes = require("../routes/userRoutes");
const productRoutes = require("../routes/productRoutes");
const cartRoutes = require("../routes/cartRoutes");
const checkoutRoutes = require("../routes/checkoutRoutes");
const orderRoutes = require("../routes/orderRoutes");
const uploadRoutes = require("../routes/uploadRoutes");
const subscribeRoute = require("../routes/subscribeRoute");
const adminRoutes = require("../routes/adminRoutes");
const productAdminRoutes = require("../routes/productAdminRoutes");
const adminOrderRoutes = require("../routes/adminOrderRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ✅ CORS Setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://anuveshana.vercel.app",
      "https://anuveshana-rph9.vercel.app"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscribeRoute);

// ✅ Admin Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// ❌ REMOVE app.listen()
// ✅ Export app for Vercel serverless
module.exports = app;
