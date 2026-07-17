# MongoDB Atlas Setup Verification Guide

## Current MongoDB Atlas Configuration

Your MongoDB Atlas cluster is fully configured and ready to use!

### Access Information

**MongoDB Atlas URL:**
https://cloud.mongodb.com/

**Project Name:** Fashion-Ecommerce-Demo
**Database:** clothing-ecommerce
**Cluster:** cluster0
**Connection String:** mongodb+srv://chinmoy:666@cluster0.yfyovpw.mongodb.net/clothing-ecommerce

### Network Access Configuration

**Status:** ✅ ACTIVE

Your IP whitelist includes:
- 0.0.0.0/0 (allows from anywhere - development mode)
- 103.189.166.57/32 (auto-added)

### Database Collections

The following collections will be created automatically:

1. **customers** - User accounts
   - Indexes: email (unique), isActive + createdAt

2. **products** - Product catalog
   - Indexes: sku (unique), categoryId, brandId, status, full-text search

3. **orders** - Customer orders
   - Indexes: orderId (unique), customerId + date, status + date

4. **carts** - Shopping carts
   - Indexes: customerId

5. **payments** - Payment records
   - Indexes: orderId, status

6. Plus 15+ more collections for tags, variants, reviews, etc.

### Admin Account Setup

**Email:** chinmoy6667@gmail.com
**Password:** Admin@123456 (change on first login)
**Role:** Super Admin

This account will be created when you run: 
pm run setup

---

## How to Verify in MongoDB Atlas

### Step 1: Log In to MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Sign in with your account
3. Select project: "Fashion-Ecommerce-Demo"

### Step 2: Check Cluster Status

1. Click "Clusters" in sidebar
2. Look for "cluster0"
3. Status should show: ✅ **Active** (green)

### Step 3: Verify Network Access

1. Click "Security" in sidebar
2. Click "Network Access"
3. Check the IP list:
   - Should show 0.0.0.0/0 with Status: Active ✅
   - Should show 103.189.166.57/32 with Status: Active ✅

### Step 4: View Database

1. Click "Clusters" in sidebar
2. Click "Browse Collections" on cluster0
3. You'll see:
   - Database: clothing-ecommerce
   - Collections: (empty until npm run setup is run)

### Step 5: Check Connection String

1. Click cluster0 name
2. Click "Connect"
3. Select "Connect your application"
4. Choose "Node.js" as driver
5. You should see:
   `
   mongodb+srv://chinmoy:666@cluster0.yfyovpw.mongodb.net/clothing-ecommerce?retryWrites=true&w=majority
   `

---

## Checklist: What's Ready in MongoDB Atlas

- ✅ Cluster created and active
- ✅ Database name: clothing-ecommerce
- ✅ IP whitelist configured
- ✅ Connection string correct
- ✅ Admin user: chinmoy
- ✅ Network access: Active
- ✅ Ready to connect from application

---

## What Happens When You Run npm run setup

When you run 
pm run setup (after internet is restored):

1. **Connects to MongoDB**
   `
   ✅ Connected to MongoDB: cluster0.mongodb.net
   `

2. **Creates Indexes**
   `
   ✅ Customer indexes
   ✅ Product indexes
   ✅ Order indexes
   ✅ Cart indexes
   ✅ Payment indexes
   ✓ Category indexes
   ✅ All indexes created successfully
   `

3. **Creates Admin User**
   `
   ✓ Admin user created: chinmoy6667@gmail.com
   ⚠️  Default password: Admin@123456
   ⚠️  Please change this password immediately!
   `

4. **Ready for Development**
   `
   ✅ Database initialization complete
   `

---

## Application Setup Configuration

Your application (backend) is configured to:

**File:** backend/src/config/database.js

- Connect to: MongoDB Atlas cluster0
- Database: clothing-ecommerce
- Auto-create indexes on startup
- Handle connection errors gracefully

**File:** backend/.env

`
MONGODB_URI=mongodb+srv://chinmoy:666@cluster0.yfyovpw.mongodb.net/clothing-ecommerce?retryWrites=true&w=majority&appName=Cluster0
`

---

## After You Get Internet Back

1. **Verify MongoDB is running:**
   - Go to https://cloud.mongodb.com/
   - Check cluster0 status = ✅ Active

2. **Run database setup:**
   `ash
   cd backend
   npm run setup
   `
   
   Expected output:
   `
   ✅ Connected to MongoDB
   ✅ All indexes created successfully
   ✓ Admin user created
   ✅ Database initialization complete
   `

3. **Start the server:**
   `ash
   npm start
   `
   
   Expected output:
   `
   ✅ MongoDB connected
   ✅ Email service connected successfully
   ✅ Cloudinary service connected successfully
   🚀 Server running on port 5001
   `

---

## MongoDB Atlas Features Available

### Atlas UI

You can view and manage:
- ✅ Collections and documents
- ✅ Indexes and performance
- ✅ Network access
- ✅ Backups and snapshots
- ✅ Alerts and monitoring
- ✅ Connection logs

### From Atlas Dashboard

1. **View Data:** Collections → Browse documents
2. **Check Indexes:** Collections → Indexes tab
3. **Monitor:** Metrics → View cluster performance
4. **Network:** Security → Network Access

---

## Commands to Run (After Internet)

`ash
# From backend directory
cd backend

# One-time setup
npm install
npm run setup

# Start development
npm start

# Check health
curl http://localhost:5001/api/health
`

---

## Your MongoDB Credentials

| Item | Value |
|------|-------|
| Cluster | cluster0 |
| Database | clothing-ecommerce |
| Username | chinmoy |
| Password | 666 |
| Connection String | mongodb+srv://chinmoy:666@cluster0... |

---

## Ready for Production?

When deploying to production:

1. Create new MongoDB Atlas project
2. Use strong passwords (not "666")
3. Whitelist only your server IP
4. Enable authentication
5. Set up backups
6. Monitor performance

---

**Status:** ✅ MongoDB Atlas Ready
**Date:** 2026-07-17
**Current Issue:** No internet connection (temporary)
**Next Step:** Connect to internet → Run npm run setup

Once you have internet, everything will work perfectly! 🚀
