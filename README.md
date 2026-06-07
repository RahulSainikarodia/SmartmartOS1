# SmartMart OS - Digital Grocery Management System

A modern digital operating system for local grocery stores. Customers can check inventory availability in their area, while shop owners can manage their stock with ease.

## Features

### For Customers
- **Area-Based Search**: Find and connect with shop owners in your local area.
- **Smart Inventory Check**: Type your grocery list and instantly see what's available.
- **Structured Matching**: Matches by Product Name, Brand, and Size for accurate results.

### For Shop Owners (Admin)
- **Inventory Management**: Add, update, and toggle product availability with one click.
- **Size & Unit Tracking**: Track products by Grams, Kilograms, Milliliters, and Liters.
- **Area-Based Access**: Each shop owner manages their own inventory for their specific area.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide React (Icons).
- **Backend**: Node.js, Express.
- **Database**: Supabase (PostgreSQL).

## Deployment Guide

### Part 1: Deploy Backend on Render (Recommended)

1. **Create Account**: Go to [render.com](https://render.com) and sign up (free tier is sufficient).
2. **New Web Service**: Click "New" > "Web Service".
3. **Connect GitHub**: Connect your GitHub repository or upload the `backend/` folder.
4. **Configure Service**:
   - **Root Directory**: `backend` (if using monorepo)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**: Add these in the Render dashboard:
   - `SUPABASE_URL` = your Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase Service Role Key
   - `JWT_SECRET` = any random secret string (e.g., `my-super-secret-jwt-key-123`)
   - `NODE_ENV` = `production`
6. **Deploy**: Click "Create Web Service". Wait for deployment to complete.
7. **Copy Backend URL**: Once deployed, copy the URL (e.g., `https://smartmart-backend.onrender.com`).

### Part 2: Deploy Frontend on Vercel

1. **Create Account**: Go to [vercel.com](https://vercel.com) and sign up with GitHub.
2. **Import Project**: Click "Add New" > "Project" > Import your GitHub repository.
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**: Add this variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-render-backend-url.onrender.com/api` (use your actual Render URL)
5. **Deploy**: Click "Deploy". Vercel will automatically build and deploy your site.

### Part 3: Update Supabase Settings

1. Go to your **Supabase Dashboard**.
2. Navigate to **Authentication** > **URL Configuration**.
3. Add your Vercel frontend URL to **Site URL** and **Redirect URLs**.
4. Save changes.

## Local Development Setup

1. **Clone and Install**:
   ```bash
   npm run install-all
   ```
2. **Configure Backend**:
   - Create `backend/.env` with your Supabase credentials.
3. **Configure Frontend**:
   - Create `frontend/.env` with `VITE_API_URL=http://localhost:5000/api`
4. **Run Development**:
   ```bash
   npm run dev
   ```

## Database Setup (Supabase)

Run this SQL in your **Supabase SQL Editor**:

```sql
-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  area TEXT,
  debt DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price DECIMAL NOT NULL,
  size DECIMAL NOT NULL,
  size_unit TEXT NOT NULL DEFAULT 'g',
  is_available BOOLEAN DEFAULT true,
  owner_id UUID REFERENCES users(id),
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  order_items JSONB NOT NULL,
  total_price DECIMAL NOT NULL,
  order_type TEXT DEFAULT 'pickup',
  payment_status TEXT DEFAULT 'paid',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
smartmart-os/
├── backend/
│   ├── config/
│   │   └── supabase.js      # Supabase connection
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Shop.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── .env.example
└── package.json
```

## Live URLs (Example)

- **Frontend (Vercel)**: `https://smartmart-os.vercel.app`
- **Backend (Render)**: `https://smartmart-backend.onrender.com`

---

Built with ❤️ for local grocery stores.
