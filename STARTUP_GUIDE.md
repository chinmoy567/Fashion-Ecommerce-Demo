# 🚀 Project Startup Guide

## ✅ What's Complete

The project has been **fully initialized** with:

### Git Repository
- [x] Git repository initialized (`git init`)
- [x] Git user configured
- [x] Initial commit created
- [x] .gitignore configured

### Project Structure
- [x] Frontend directory created (`frontend/`)
- [x] Backend directory created (`backend/`)
- [x] Documentation directory exists (`docs/`)
- [x] Specifications in place (`.claude/specs/`)

### Configuration Files
- [x] Frontend: `package.json`, `vite.config.js`, `tailwind.config.js`, `.eslintrc.cjs`
- [x] Backend: `package.json`, `.env.example`, `.eslintrc.cjs`
- [x] Root: `README.md`, `.gitignore`

### Critical Decisions Confirmed ✅
All 10 critical decisions have been made and documented in `.claude/specs/DECISIONS.md`:

| Decision | Choice | Status |
|----------|--------|--------|
| **A** | Build Project (not research) | ✅ Confirmed |
| **B** | Core + Future phases | ✅ Confirmed |
| **C** | MERN + Cloudinary stack | ✅ Confirmed |
| **D** | 6 order states (Pending → Confirmed → Shipped → Delivered → Completed → Cancelled) | ✅ Confirmed |
| **E** | OTP at registration only | ✅ Confirmed |
| **F** | Unified category list (admin) + Sale as filter | ✅ Confirmed |
| **G** | Products module = featured source | ✅ Confirmed |
| **J** | Hybrid address model (full Bangladesh in DB) | ✅ Confirmed |
| **K** | Require ONE payment proof (TxnID or screenshot) | ✅ Confirmed |
| **L** | Per-product stock (Phase 1) → per-variant (Phase 2) | ✅ Confirmed |

---

## 📋 Next Steps

### Step 1: Install Dependencies (30 min)

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### Step 2: Configure Environment (5 min)

Create `backend/.env` from template:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your credentials:
- **MongoDB**: Create MongoDB Atlas account → copy connection string
- **Cloudinary**: Create Cloudinary account → copy API credentials
- **Email (Optional)**: Gmail SMTP credentials for OTP emails
- **JWT Secret**: Generate secure random strings

### Step 3: Start Development Servers (15 min)

**Terminal 1: Frontend**
```bash
cd frontend
npm run dev
# Should show: VITE v5.0.0 running at http://localhost:5173/
```

**Terminal 2: Backend**
```bash
cd backend
npm run dev
# Should show: Server running on port 5000
```

### Step 4: Verify Everything Works

- [ ] Frontend running at `http://localhost:5173`
- [ ] Backend running at `http://localhost:5000`
- [ ] No console errors in either terminal
- [ ] Frontend can make API calls to backend

---

## 🏗️ Architecture Overview

### Frontend (React + Vite)
- **Port**: 5173
- **Framework**: React 18, Vite (fast build tool)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Redux Toolkit + React Hooks
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion + GSAP
- **Routing**: React Router v6

### Backend (Express + MongoDB)
- **Port**: 5000
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, rate limiting
- **File Upload**: Cloudinary (no local file system)
- **Email**: Nodemailer (for OTP)

### Database (MongoDB)
- **Host**: MongoDB Atlas (cloud)
- **Collections**: 20 (users, products, orders, carts, etc.)
- **Authentication**: Connection string in `.env`

### Storage (Cloudinary)
- **Images**: Product photos, user avatars, payment proof
- **API**: Cloudinary SDK for uploads/deletions

---

## 📁 Directory Structure

```
project/
├── frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── api/               # API client (axios)
│   │   ├── components/        # Reusable React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Route pages
│   │   ├── services/          # Business logic
│   │   ├── store/             # Redux slices
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                     # Express + MongoDB
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   ├── middlewares/       # Auth, validation, error
│   │   ├── validations/       # Input schemas
│   │   ├── config/            # Config files
│   │   ├── utils/             # Helpers
│   │   ├── app.js             # Express app
│   │   └── server.js          # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .env                   # (local, not committed)
│
├── docs/                        # Implementation guides
│   ├── ARCHITECTURE_IMPLEMENTATION.md
│   ├── FRONTEND_IMPLEMENTATION.md
│   ├── BACKEND_IMPLEMENTATION.md
│   └── DEPLOYMENT_AND_TESTING.md
│
├── .claude/                     # Specifications & tools
│   ├── specs/                 # All specifications
│   │   ├── REQUIREMENTS.md
│   │   ├── DECISIONS.md       # ← CONFIRMED DECISIONS
│   │   ├── API_SPECIFICATION.md
│   │   ├── DATABASE_SCHEMA.md
│   │   └── GETTING_STARTED.md
│   ├── agents/                # AI agents for development
│   ├── skills/                # Custom CLI skills
│   └── CLAUDE.md              # Project rules
│
├── README.md                    # Project overview
├── STARTUP_GUIDE.md            # This file
└── .git/                        # Git repository
```

---

## 🎯 Development Phases

### Phase 1: Core Features (4-6 weeks) ← START HERE
1. **Authentication** (2 weeks)
   - Register, login, email OTP
   - JWT tokens, refresh tokens
   - Password reset

2. **Product Catalogue** (1.5 weeks)
   - Browse products
   - Search & filters by category
   - Product details page
   - Related products

3. **Shopping Features** (1.5 weeks)
   - Add to cart, update cart
   - Wishlist functionality
   - Cart persistence

4. **Checkout & Payment** (1 week)
   - Checkout flow (address, shipping)
   - Manual bKash payment form
   - Order creation

5. **Order Management** (1 week)
   - My Orders page
   - Order tracking
   - Order history

6. **Admin Dashboard** (1 week)
   - Dashboard metrics
   - Order management
   - Product management

### Phase 2: Extended Features (2-3 weeks, if time allows)
- Coupons & Discounts
- Inventory Management
- Product Reviews
- Notifications
- Activity Logs
- Website CMS

### Phase 3: Polish & Deployment (1-2 weeks)
- Security hardening
- Performance optimization
- Load testing
- Production deployment

---

## 📚 Documentation Reading Order

**Essential (Read First)**:
1. `.claude/specs/REQUIREMENTS.md` — Feature list
2. `.claude/specs/DECISIONS.md` — Confirmed decisions (already read!)
3. `.claude/specs/API_SPECIFICATION.md` — API endpoints

**Implementation Guides**:
4. `docs/FRONTEND_IMPLEMENTATION.md` — React patterns
5. `docs/BACKEND_IMPLEMENTATION.md` — Express patterns
6. `docs/DEPLOYMENT_AND_TESTING.md` — Testing & deployment

**Reference**:
- `.claude/CLAUDE.md` — Project rules & standards
- `README.md` — Project overview

---

## 🔧 Common Commands

### Frontend
```bash
cd frontend

npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix lint issues
```

### Backend
```bash
cd backend

npm run dev          # Start with auto-reload
npm start            # Start production
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix lint issues
```

### Git
```bash
git status                  # Check status
git add -A                  # Stage all changes
git commit -m "message"     # Commit with message
git log --oneline          # View commit history
```

---

## ⚠️ Important Notes

### Environment Variables
- **Never commit `.env`** (it contains secrets)
- Use `.env.example` as template
- Keep `.env` in `.gitignore` (already configured)

### Database Setup
1. Create MongoDB Atlas account (free tier available)
2. Create cluster
3. Add IP whitelist (or allow all for development)
4. Create database user with password
5. Copy connection string → `MONGODB_URI` in `.env`

### Cloudinary Setup
1. Create Cloudinary account (free tier available)
2. Get Cloud Name, API Key, API Secret
3. Add to `.env` file

### Email Setup (Optional for Phase 1)
1. For Gmail: Enable "App Passwords" in Google account
2. Use app password as `SMTP_PASS` in `.env`
3. Or use any SMTP service (SendGrid, Mailgun, etc.)

---

## ✅ Startup Checklist

Before starting development:

- [ ] Dependencies installed (`npm install` in both folders)
- [ ] Environment configured (`backend/.env` with credentials)
- [ ] Frontend runs without errors (`npm run dev` on port 5173)
- [ ] Backend runs without errors (`npm run dev` on port 5000)
- [ ] MongoDB connection working (check backend logs)
- [ ] Frontend can call backend (`curl http://localhost:5000/api/health`)
- [ ] Read `.claude/specs/REQUIREMENTS.md`
- [ ] Understand decision matrix in `.claude/specs/DECISIONS.md`

---

## 🎓 What to Build Next

Once servers are running:

### Option 1: Start with Backend
Build the **Authentication API** first:
- POST `/api/auth/register` — Create account
- POST `/api/auth/login` — Login with email/password
- POST `/api/auth/verify-otp` — Verify email OTP
- POST `/api/auth/refresh` — Get new JWT token

### Option 2: Start with Frontend
Build the **Home Page** layout:
- Navigation bar (logo, search, cart, profile)
- Product showcase
- Footer
- Responsive design

### Recommendation
**Start with Backend → Frontend**, so frontend can integrate real APIs (not mock data).

---

## 🚨 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### MongoDB connection fails
- Check `.env` has correct `MONGODB_URI`
- Verify IP whitelist in MongoDB Atlas
- Ensure network access enabled

### Port already in use
```bash
# Frontend (port 5173)
# Kill any process on 5173 or change port in vite.config.js

# Backend (port 5000)
# Kill any process on 5000 or set PORT=5001 in .env
```

---

## 📞 Quick Reference

| Need | Location |
|------|----------|
| Features to build | `.claude/specs/REQUIREMENTS.md` |
| API endpoints | `.claude/specs/API_SPECIFICATION.md` |
| Database schema | `.claude/specs/DATABASE_SCHEMA.md` |
| Confirmed decisions | `.claude/specs/DECISIONS.md` |
| Project rules | `.claude/CLAUDE.md` |
| Frontend guide | `docs/FRONTEND_IMPLEMENTATION.md` |
| Backend guide | `docs/BACKEND_IMPLEMENTATION.md` |

---

## 🎉 You're Ready!

The project is initialized and ready for development.

**Next Action**: Follow the steps in "Next Steps" above and start the development servers.

**Questions?** Check the documentation in `.claude/specs/` and `docs/` folders.

---

**Status**: ✅ Project Initialized & Ready for Development  
**Date**: 2026-07-17  
**Git**: Branch `main` with initial commit  
**Next**: `npm install` → Start servers → Begin Phase 1 features
