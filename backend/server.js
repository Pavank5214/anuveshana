require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")
const checkoutRoutes = require("./routes/checkoutRoutes")
const orderRoutes = require("./routes/orderRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const adminRoutes = require('./routes/adminRoutes');
const productAdminRoutes = require('./routes/productAdminRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const portfolioRoutes = require("./routes/portfolioRoutes");
const contactRoutes = require("./routes/contactRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const ticketRoutes = require("./routes/ticketRoutes")
const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173", "https://www.anuveshanatechnologies.in", // Local frontend
  /\.vercel\.app$/          // Any Vercel frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow non-browser requests like Postman
      if (allowedOrigins.some(o => (typeof o === "string" ? o === origin : o.test(origin)))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


const PORT = process.env.PORT || 3000;

//Connect to database
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/tickets", ticketRoutes);


// Admin Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/portfolio", portfolioRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});