# Bangladesh Clothing E-Commerce Platform

A production-quality MERN stack e-commerce platform for clothing retail in Bangladesh.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Git

### Setup

```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Start development servers
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm run dev
```

Visit `http://localhost:5173` for frontend and `http://localhost:5000/api` for backend.

## Project Structure

```
├── frontend/          # React + Vite SPA
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express.js REST API
│   ├── src/
│   ├── .env.example
│   └── package.json
├── docs/              # Documentation
└── .claude/           # Specifications
```

## Technology Stack

**Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui, Redux Toolkit, React Router, React Hook Form

**Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

**Storage**: Cloudinary

**Deployment**: Render

## Development Phases

### Phase 1: Core Features (4-6 weeks)
- Authentication (register, login, email OTP)
- Product Catalogue (browse, search, filters)
- Cart & Wishlist
- Checkout flow
- Manual bKash Payment
- Order Management & Tracking
- Admin Dashboard

### Phase 2: Extended Features (2-3 weeks, if time allows)
- Coupons & Discounts
- Inventory Management
- Product Reviews
- Notifications
- Activity Logs
- Website CMS

### Phase 3: Polish & Deployment (1-2 weeks)
- Performance optimization
- Security hardening
- Production deployment

## Documentation

All specifications and implementation guides are in `.claude/specs/` and `docs/`:

- **REQUIREMENTS.md** — Feature specifications
- **API_SPECIFICATION.md** — API endpoint design
- **DATABASE_SCHEMA.md** — Database design
- **DECISIONS.md** — Critical decisions (CONFIRMED)
- **GETTING_STARTED.md** — Quick reference guide

## Coding Standards

- Clean, readable, maintainable code
- DRY principle
- Single Responsibility Principle
- Production-ready, not temporary fixes
- Comprehensive error handling
- Validation at system boundaries
- No hardcoded secrets

## Quality Checklist

Every feature must pass:
- ✅ Specification fully implemented
- ✅ Works end-to-end
- ✅ No lint errors
- ✅ No console errors
- ✅ API endpoints tested
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessible (WCAG 2.1 AA)
- ✅ Code follows standards
- ✅ Ready to commit

## Status

✅ **Project Initialized**
- [x] Git repository setup
- [x] Frontend structure created
- [x] Backend structure created
- [x] Critical decisions confirmed
- [ ] Dependencies installed
- [ ] Development servers running
- [ ] First feature building

## Next Steps

1. Install dependencies: `npm install` in both frontend and backend
2. Configure environment variables in `backend/.env`
3. Start development servers
4. Build first feature: Customer Authentication

## License

MIT
