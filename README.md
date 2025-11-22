# 🛍️ Ecommerce Platform - Full Stack Development

A modern, fully-featured e-commerce platform built with **Next.js 14**, **NestJS**, **Prisma**, and **PostgreSQL**.

## 🎯 Quick Start (30 seconds)

### First Time Setup
```bash
setup-db.bat
```

### Run Everything
```bash
start-all.bat
```

### Access
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **API Docs**: http://localhost:3000/api/docs

👉 **See [QUICK_START.md](QUICK_START.md) for detailed instructions with test accounts**

---

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** v16+ (LTS recommended)
- **npm** or yarn
- **PostgreSQL** 13+ (running on localhost:5432)
- **Git**

## 🚀 Getting Started

### Step 1: Install Dependencies (If not done)
```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 2: Setup Database (First time only)
```bash
setup-db.bat
```
This will:
- Generate Prisma Client
- Run database migrations
- Seed database with 3 brands and 10+ products
- Open Prisma Studio to verify

### Step 3: Run Full Stack
```bash
start-all.bat
```
Backend and frontend will start in separate terminal windows.

### Step 4: Open in Browser
- Frontend: http://localhost:3001
- API Docs: http://localhost:3000/api/docs

---

## 📁 Project Structure

```
ecommerce-platform/
├── backend/                    # NestJS Backend (Port 3000)
│   ├── src/
│   │   ├── auth/              # JWT Authentication
│   │   ├── products/          # Product management
│   │   ├── orders/            # Order processing
│   │   ├── users/             # User management
│   │   ├── cart/              # Shopping cart
│   │   └── ...
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Sample data (3 brands, 10+ products)
│   └── package.json
│
├── frontend/                   # Next.js 14 Frontend (Port 3001)
│   ├── src/
│   │   ├── app/               # Pages (homepage, products, cart, admin)
│   │   ├── components/        # React components
│   │   ├── store/             # Redux store
│   │   ├── services/          # API services
│   │   └── ...
│   └── package.json
│
├── QUICK_START.md             # Quick reference (30 lines)
├── STARTUP_GUIDE.md           # Comprehensive guide (300+ lines)
├── start-all.bat              # Start backend + frontend
├── start-backend.bat          # Start backend only
├── start-frontend.bat         # Start frontend only
├── setup-db.bat               # Database setup (one-time)
└── README.md                  # This file
```

---

## 🛠️ Technology Stack

### Backend
- **NestJS** - Enterprise Node.js framework
- **Prisma** - Modern ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Passport** - Security middleware
- **Cloudinary** - Image hosting
- **Swagger** - API documentation

### Frontend
- **Next.js 14** - React with App Router
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Recharts** - Data visualization

## Database Setup with Prisma

1. Generate Prisma Client:
```bash
npx prisma generate
```

2. Run database migrations:
```bash
npx prisma migrate dev
```

3. (Optional) Seed the database with sample data:
```bash
npx prisma db seed
```

4. (Optional) View your database with Prisma Studio:
```bash
npx prisma studio
```
This will open Prisma Studio on http://localhost:5555

## 🎮 Test Accounts

All accounts use password: **`123456`**

| Role | Email | Purpose |
|------|-------|---------|
| **Admin** | admin1@shop.com | Full admin access |
| **Admin** | admin2@shop.com | Secondary admin |
| **Enterprise** | nivea@enterprise.com | NIVEA brand |
| **Enterprise** | laroche@enterprise.com | La Roche-Posay |
| **Enterprise** | cocoon@enterprise.com | Cocoon Vietnam |
| **Seller** | seller1@shop.com | Seller access |
| **Seller** | seller2@shop.com | Seller access |
| **Seller** | seller3@shop.com | Seller access |

---

## 📊 Features & Pages

### ✅ E-Commerce Features
- [x] Product catalog with search & filters
- [x] Product details with variants (size, color)
- [x] Shopping cart with quantity controls
- [x] Checkout process
- [x] Order management & history
- [x] Product reviews & ratings
- [x] Related products

### ✅ User Management
- [x] User registration & login
- [x] User profiles
- [x] Address management
- [x] Order history
- [x] Wishlist (structure ready)

### ✅ Admin Panel
- [x] Dashboard with statistics
- [x] User management
- [x] Product management
- [x] Category management
- [x] Order management

### ✅ Frontend Pages
| Page | Route | Features |
|------|-------|----------|
| Homepage | `/` | Featured products, categories |
| Products | `/shop/products` | Listing, filtering, search |
| Product Detail | `/shop/products/[id]` | Variants, reviews, related |
| Shopping Cart | `/shop/cart` | Items, quantity, summary |
| Checkout | `/shop/checkout` | Confirmation |
| Orders | `/shop/orders` | History, tracking |
| Profile | `/dashboard/customer/profile` | Account settings |
| Admin Dashboard | `/dashboard/admin` | Statistics, charts |
| Admin Users | `/dashboard/admin/users` | User table |
| Admin Products | `/dashboard/admin/products` | Product table |
| Admin Orders | `/dashboard/admin/orders` | Order table |
| Login | `/auth/login` | User authentication |
| Register | `/auth/register` | New account |
| About | `/about` | Company info |
| Contact | `/contact` | Contact form |

---

## 📡 API Endpoints

### Swagger UI
Visit: **http://localhost:3000/api/docs** (when backend running)

### Authentication
```
POST   /api/auth/login         Login user
POST   /api/auth/register      Register new user
GET    /api/auth/me            Get current user
POST   /api/auth/logout        Logout
POST   /api/auth/refresh       Refresh token
```

### Products
```
GET    /api/products           List all products
GET    /api/products/:id       Get product detail
GET    /api/products/search    Search products
GET    /api/categories         List categories
```

### Orders
```
GET    /api/orders             List user orders
POST   /api/orders             Create order
GET    /api/orders/:id         Get order detail
```

### Cart
```
GET    /api/cart               Get cart
POST   /api/cart/items         Add to cart
PUT    /api/cart/items/:id     Update item
DELETE /api/cart/items/:id     Remove from cart
```

### Admin
```
GET    /api/admin/users        List users
GET    /api/admin/products     List products
GET    /api/admin/orders       List orders
```

---

## 🔧 Development Scripts

### Backend (in `backend/` directory)
```bash
npm run start:dev          # Development with watch mode
npm run build             # Production build
npm run start:prod        # Run production build
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Run migrations
npm run seed              # Seed database
```

### Frontend (in `frontend/` directory)
```bash
npm run dev               # Development server with HMR
npm run build             # Production build
npm run start             # Production server
npm run lint              # Run linter
```

### Root (from project root)
```bash
start-all.bat             # Start backend + frontend
start-backend.bat         # Start backend only
start-frontend.bat        # Start frontend only
setup-db.bat              # Setup database
```

---

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts
- **products** - Product catalog
- **categories** - Product categories
- **variants** - Product variants
- **orders** - Customer orders
- **reviews** - Product reviews

### Sample Data (from seed.ts)
- **3 Categories**: Skincare, Makeup, Body Care
- **3 Brands**: NIVEA, La Roche-Posay, Cocoon
- **10+ Products**: With variants, prices, stock
- **3 Sellers**: Individual sellers with products

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000 or 3001
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID [PID] /F
```

### Database Connection Failed
1. Verify PostgreSQL running: `psql -U postgres`
2. Check `.env` file: `DATABASE_URL=postgresql://...`
3. Rebuild database: `setup-db.bat`

### Prisma Generate Error
```bash
cd backend
rm -rf node_modules/.prisma
npm install
npm run prisma:generate
```

### CORS Error in Frontend
- Ensure backend running on port 3000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Should be: `http://localhost:3000`

### Frontend Won't Load
1. Check port 3001 is available
2. Clear `.next` folder: `rm -rf frontend/.next`
3. Reinstall: `cd frontend && npm install`

### API Docs Blank
- Swagger UI needs backend running
- Visit: http://localhost:3000/api/docs
- Wait 5 seconds for docs to load

---

## 📞 Support & Documentation

- **Quick Help**: See [QUICK_START.md](QUICK_START.md)
- **Setup Help**: See [STARTUP_GUIDE.md](STARTUP_GUIDE.md)
- **API Help**: Visit http://localhost:3000/api/docs
- **Database Help**: Run `npx prisma studio`

---

## 🎓 Code Examples

### Login Request
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin1@shop.com","password":"123456"}'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{"productId":1,"quantity":2}'
```

---

## ✨ Summary

✅ Full-stack e-commerce platform  
✅ Multiple user roles with role-based access  
✅ Real-time database integration  
✅ Admin dashboard with charts  
✅ Product filtering & search  
✅ Shopping cart with persistence  
✅ User authentication & authorization  
✅ RESTful API with Swagger documentation  
✅ Responsive design  
✅ Image hosting with Cloudinary  

---

**Ready to start?** Run `setup-db.bat` then `start-all.bat` 🚀

