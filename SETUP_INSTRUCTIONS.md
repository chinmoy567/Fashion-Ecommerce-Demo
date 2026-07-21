# Setup Instructions for Admin & Manager Dashboards

## Prerequisites

- Node.js 16+ installed
- MongoDB running (local or Atlas)
- Backend and frontend running simultaneously

## Quick Start

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (if not already done)
cd ../backend
npm install
```

### 2. Create Manager Account

```bash
cd backend
node scripts/createManager.js
```

**Output** (save this password):
```
✅ Manager account created successfully!

📧 Email: chinmoy7776@gmail.com
🔑 Temporary Password: <random-secure-password>
```

### 3. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173 (or similar)
```

### 4. Access Staff Login

Navigate to: `http://localhost:5173/staff-login`

**Login as Manager:**
- Email: `chinmoy7776@gmail.com`
- Password: `<from step 2>`

### 5. Explore Dashboards

After login, you'll land on `/admin/manager-dashboard`:

#### Manager Dashboard Features:
- 📊 Order Status Overview (4 cards)
- 📈 Revenue Trend Chart (daily/monthly)
- 🥧 Order Status Distribution (donut)
- 📋 Recent Orders (table with actions)
- ⚠️ Low Stock Alerts
- Quick action links

#### Admin Dashboard (Super Admin only):
Navigate to `/admin/dashboard` if logged in as `super_admin`:
- 💰 Revenue Metrics (5 cards)
- 📈 Detailed charts
- 🏆 Top products ranking
- 📂 Category performance
- 📊 Order analytics
- Quick management links

## API Endpoints

### Staff Authentication
```bash
POST /api/auth/staff-login
Content-Type: application/json

{
  "email": "chinmoy7776@gmail.com",
  "password": "<password>"
}

# Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "...",
    "adminUser": {
      "_id": "...",
      "email": "chinmoy7776@gmail.com",
      "fullName": "Manager Account",
      "role": "manager",
      "isActive": true
    }
  }
}
```

### Analytics Endpoints
```bash
# Dashboard metrics
GET /api/analytics/dashboard
Authorization: Bearer <token>

# Order status breakdown (for donut chart)
GET /api/analytics/orders/status-breakdown
Authorization: Bearer <token>

# Revenue trends
GET /api/analytics/sales/daily?days=7
GET /api/analytics/sales/monthly?months=6

# Product metrics
GET /api/analytics/products

# Category performance
GET /api/analytics/categories
```

## File Structure

```
frontend/
├── src/
│   ├── components/charts/
│   │   ├── StatCard.jsx
│   │   ├── RevenueTrendChart.jsx
│   │   ├── OrderStatusChart.jsx
│   │   ├── TopProductsChart.jsx
│   │   └── CategoryPerformanceChart.jsx
│   ├── pages/
│   │   ├── StaffLogin.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx (Admin)
│   │       └── ManagerDashboard.jsx (Manager)
│   ├── layouts/AdminLayout.jsx
│   └── router.jsx
│
backend/
├── src/
│   ├── routes/
│   │   ├── auth.js (staff-login endpoint)
│   │   └── analytics.js (status-breakdown route)
│   └── services/analyticsService.js (enhanced)
└── scripts/
    └── createManager.js
```

## Role Permissions

### Manager Role
✅ Can view: Dashboard, Orders, Inventory, Reviews  
❌ Cannot view: Products, Customers, Coupons, Analytics  
❌ Cannot see: Revenue/financial data, customer data

### Super Admin Role
✅ Can view: Everything  
✅ Can see: All charts, financial data, customer data  
✅ Can manage: All operations

## Troubleshooting

### "Staff login failed"
1. Verify email: `chinmoy7776@gmail.com`
2. Check password (from createManager.js output)
3. Ensure `/api/auth/staff-login` endpoint works:
   ```bash
   curl -X POST http://localhost:5000/api/auth/staff-login \
     -H "Content-Type: application/json" \
     -d '{"email":"chinmoy7776@gmail.com","password":"..."}'
   ```

### "Charts not rendering"
1. Check browser console (F12) for errors
2. Verify `/api/analytics/dashboard` returns data:
   ```bash
   curl -H "Authorization: Bearer <token>" \
     http://localhost:5000/api/analytics/dashboard
   ```
3. Ensure `recharts` is installed: `npm list recharts` (in frontend/)

### "Dashboard redirects to staff-login"
1. Token not in localStorage
2. User role not recognized
3. Clear browser cache/localStorage and re-login

### Manager dashboard shows admin features
1. Check user.role is `'manager'` (not `'admin'` or `'super_admin'`)
2. Browser cache might be old
3. Try incognito/private window

## Development Notes

- **Charts**: Built with Recharts + Tailwind CSS
- **State Management**: React hooks (useState) + axios
- **Authentication**: JWT tokens stored in localStorage
- **Responsive**: Mobile-first Tailwind design (375px+)
- **No external CDNs**: All assets bundled with Vite

## Next Steps (Optional)

1. **Customize Manager Permissions**:
   - Edit `frontend/src/layouts/AdminLayout.jsx`
   - Modify nav links based on role

2. **Add More Charts**:
   - Create new chart component in `frontend/src/components/charts/`
   - Import and use in dashboard pages

3. **Backend Customization**:
   - Add role-based data filtering in `analyticsService.js`
   - Restrict sensitive data from managers if needed

4. **Change Manager Password**:
   - Use a proper password change form
   - Or manually update in MongoDB:
     ```js
     db.adminusers.updateOne(
       {email: "chinmoy7776@gmail.com"},
       {$set: {password: bcrypt.hashSync("newPassword")}}
     )
     ```

## Git Commit

All changes are in commit: `de0ccf7`

```
feat: implement admin and manager dashboards with charts and staff login
```

Changes:
- Backend: 4 files (auth, analytics route/service, manager script)
- Frontend: 15 files (dashboard rebuild, new routes, chart components)
- Total: 3,478 lines added, 9,713 removed (net cleanup)
