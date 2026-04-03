# Anuveshana Technologies

![Anuveshana Logo](./frontend/src/assets/logo.png)

Anuveshana Technologies is an industrial-grade 3D printing and rapid prototyping platform. We bridge the gap between digital design and physical reality, providing high-precision manufacturing solutions for aerospace, medical, automotive, and product design industries.

## 🚀 Features

- **Industrial 3D Printing**: Support for FDM, SLA, and SLS technologies.
- **Real-time Visualization**: Interactive tools to visualize custom 3D products (Dual Name Planks, Keychains, Initial Stands).
- **Instant Quotes**: Secure file upload and analysis for custom manufacturing orders.
- **Portfolio Showcase**: A gallery of precision-engineered components.
- **E-commerce & Payments**: Integrated shopping cart with secure Razorpay payment gateway.
- **Admin Dashboard**: Comprehensive management of products, orders, users, and support tickets.
- **SEO Optimized**: Dynamic meta tags, automated sitemap generation, and JSON-LD structured data.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit
- **Routing**: React Router 7
- **3D Rendering**: Three.js & React Three Fiber
- **Icons**: Lucide React, React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Storage**: Cloudinary (for images and 3D files)
- **Payments**: Razorpay
- **Authentication**: JWT & Google OAuth

## 📁 Project Structure

```bash
anuveshana/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages
│   │   ├── redux/      # State management
│   │   └── utils/      # Helper functions
│   └── public/         # Static assets (robots.txt, etc.)
├── backend/           # Node.js + Express API
│   ├── config/         # Database and middleware config
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── uploads/        # Local temporary file storage
└── README.md          # Root documentation
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Cloudinary Account
- Razorpay Account

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your credentials.
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and set `VITE_BACKEND_URL` and `VITE_GOOGLE_CLIENT_ID`.
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛡️ License
This project is licensed under the ISC License.

---
Developed by [Anuveshana Technologies](https://www.anuveshanatechnologies.in)
