# Admin & Manager Dashboards Implementation Guide

## Overview

This document describes the new Admin and Manager dashboards with chart-driven visualizations, staff authentication, and role-based access control.

## What's New

### 1. Staff Authentication (`POST /api/auth/staff-login`)

**Backend**: `backend/src/routes/auth.js`

```bash
curl -X POST http://localhost:5000/api/auth/staff-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "chinmoy7776@gmail.com",
    "password": "<manager-password>"
  }'
```

Response includes `token`, `refreshToken`, and `adminUser` object with role.

### 2. Manager Account Setup

Create manager account before testing:

```bash
cd backend
node scripts/createManager.js
```

This creates account for `chinmoy7776@gmail.com` with a temporary password (printed to console).

### 3. Dashboards

#### Admin Dashboard (`/admin/dashboard`)
**Access**: `super_admin` role only

Features:
- 5 KPI Cards: Monthly Revenue, Total Orders, Avg Order Value, Conversion Rate, Yearly Revenue
- Revenue Trend Chart (daily/monthly toggle)
- Order Status Distribution (donut chart)
- Top Products by Revenue (horizontal bar chart)
- Category Performance (multi-series bar chart)
- Order Status Summary (6-column grid)
- Quick Actions links

#### Manager Dashboard (`/admin/manager-dashboard`)
**Access**: `manager` and `super_admin` roles

Features:
- 4 KPI Cards: Pending, Confirmed, Shipped, Delivered
- Order Status Distribution (donut chart)
- Daily Revenue Trend
- Recent Orders Table with Quick Actions (Confirm/Cancel buttons)
- Low Stock Alerts Table
- Quick Actions links

### 4. Chart Components

Located in `frontend/src/components/charts/`:

- **StatCard.jsx** - KPI tiles with optional change indicators
- **RevenueTrendChart.jsx** - Area chart with daily/monthly toggle, responsive
- **OrderStatusChart.jsx** - Pie/donut chart of order statuses
- **TopProductsChart.jsx** - Horizontal bar chart (top 8 products)
- **CategoryPerformanceChart.jsx** - Multi-series bar chart

All components:
- Use Recharts for visualization
- Tailwind CSS styling
- Responsive design (mobile/tablet/desktop)
- Interactive tooltips with currency formatting
- No data fallback states

### 5. Analytics Service Enhancements

**File**: `backend/src/services/analyticsService.js`

Updates:
- `getSalesMetrics()` now tracks all 6 order statuses:
  - pending, confirmed, shipped, delivered, completed, cancelled
- `getDashboardMetrics()` now includes:
  - `monthlyTrend` - monthly sales trend
  - `customers` - customer growth metrics
- New `getOrderStatusBreakdown()` function for status distribution

**New Route**: `GET /api/analytics/orders/status-breakdown`
- Returns array of `{_id: status, count, revenue}`
- Used for donut chart visualization

### 6. Role-Based Access Control

#### Super Admin (`super_admin`)
- Full access to all dashboards
- View: analytics, products, customers, coupons, reviews, inventory
- Manage: orders, inventory
- See: financial data, customer data, product performance

#### Manager (`manager`)
- Access: manager dashboard, orders, inventory, reviews
- Limited nav: no products, customers, coupons, analytics
- No financial/revenue data displayed
- Quick actions: confirm/cancel orders, manage inventory, view alerts

### 7. Fixed Bugs

1. **Role Check Bug**: Changed AdminLayout.jsx and Analytics.jsx
   - OLD: `user?.role === 'admin'` (nonexistent role)
   - NEW: `user?.role === 'manager'` (correct role)

2. **Dashboard Data Bug**: `getDashboardMetrics()` was missing:
   - monthlyTrend data that frontend expected
   - customer growth metrics
   - Fixed order status bucketing

### 8. UI Updates

**AdminLayout.jsx**:
- Dynamic title: "👑 Admin Panel" vs "📊 Manager Panel"
- Role-based nav filtering
- Uses `user?.fullName` instead of just `user?.name`
- Nav items now have emoji icons

**Router**:
- New route: `/staff-login` → StaffLogin.jsx
- New route: `/admin/manager-dashboard` → ManagerDashboard.jsx
- Preserved all existing routes

## Testing Checklist

### 1. Staff Login
```bash
# Navigate to http://localhost:3000/staff-login
# Log in with:
# Email: chinmoy7776@gmail.com
# Password: <from createManager.js script output>
```

Expected: Redirect to `/admin/manager-dashboard` with manager role

### 2. Manager Dashboard
- View 4 order status cards (Pending, Confirmed, Shipped, Delivered)
- View donut chart with order status distribution
- View revenue trend chart (daily/monthly toggle)
- View recent orders table
- Test "Confirm" button on pending order (if any)
- View low stock alerts
- Click quick action links (should navigate correctly)

### 3. Admin Dashboard (Super Admin)
```bash
# Log in as existing super_admin account (if created)
# Or use customer login then manually test endpoints
```

Expected features:
- All 5 KPI cards (including Yearly Revenue, financial data)
- All charts rendered
- Top products chart
- Category performance chart
- All quick actions visible

### 4. Chart Responsiveness
- Open dashboards on mobile (375px)
- Open on tablet (768px)
- Open on desktop (1024px+)
- Charts should resize and remain readable

### 5. Console Checks
```bash
# Open browser dev tools (F12)
# Check console for errors
# Verify no 404 errors on API calls to:
# - GET /api/analytics/dashboard
# - GET /api/analytics/orders/status-breakdown
```

### 6. Role-Based Nav
**Manager Dashboard**:
- Should NOT see: Products, Customers, Coupons, Analytics links
- Should see: Orders, Inventory, Reviews

**Admin Dashboard**:
- Should see: Products, Customers, Coupons, Analytics links
- All nav items should be accessible

## Key Files Modified

**Backend**:
- `src/routes/auth.js` - Added staff login endpoint
- `src/routes/analytics.js` - Added status breakdown route
- `src/services/analyticsService.js` - Enhanced metrics, added order breakdown
- `scripts/createManager.js` - New manager account creation script
- `package.json` - No new backend dependencies

**Frontend**:
- `package.json` - Added recharts dependency
- `api/auth.js` - Added loginStaff function
- `router.jsx` - Added staff login and manager dashboard routes
- `layouts/AdminLayout.jsx` - Fixed role checks, added role-based nav
- `pages/StaffLogin.jsx` - New staff login page (81 lines)
- `pages/admin/Dashboard.jsx` - Rebuilt with charts (229 lines)
- `pages/admin/ManagerDashboard.jsx` - New manager dashboard (347 lines)
- `pages/admin/Analytics.jsx` - Fixed role check
- `components/charts/*.jsx` - 5 new chart components (439 lines total)

## Next Steps

1. Run `npm install` in frontend/ to get recharts
2. Run `node backend/scripts/createManager.js` to create manager account
3. Start backend and frontend servers
4. Test staff login flow
5. Verify both dashboards render correctly
6. Check responsive design on mobile/tablet
7. Validate all chart data displays correctly

## Troubleshooting

**"Access denied" on manager dashboard**:
- Verify user role is `'manager'` (not `'admin'`)
- Check token is stored in localStorage
- Clear localStorage and re-login

**Charts not rendering**:
- Check browser console for errors
- Verify `/analytics/dashboard` endpoint returns data
- Check network tab for failed API calls

**Low Stock Alerts not showing**:
- Verify products with stock < 10 exist in database
- Check `/inventory` endpoint is working

**Recent Orders empty**:
- May be expected if no orders exist
- Test by creating an order as customer first

## Architecture Notes

- Super Admin and Manager share the same `/admin` layout and API endpoints
- Role filtering happens on frontend (nav items, dashboard content)
- No separate "manager API" — both roles use same endpoints via `verifyAdmin` middleware
- Dashboard state is component-local (useState) with axios fetches
- Charts are stateless (re-render on data prop changes)
- No caching layer (each refresh fetches fresh data)
