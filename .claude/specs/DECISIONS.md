# E-Commerce Platform — Decisions Needed

**Status**: ⚠ **BLOCKING** — These decisions must be confirmed before implementation begins.

---

## Decision A: Thesis Framing

### Question
Is this a **software-engineering build project** (system is the deliverable) or a **research study** (question + evaluation)?

### Impact
Determines whether the report/poster needs Abstract / Research Question / Methodology / Evaluation sections.

### Options
1. **Build Project**: Focus on system quality, architecture, implementation
2. **Research Study**: Focus on research question, methodology, findings, evaluation

### Current Status
✅ **CONFIRMED** (2026-07-17)

### Decision
**Build Project** — Focus on system quality, architecture, and implementation as a software engineering deliverable.

### Rationale
As a thesis project, the system itself (e-commerce platform) is the primary deliverable. Quality of architecture, code, and features matters more than research methodology. This allows focus on production-ready implementation without requiring research framing (abstract, RQ, evaluation).

---

## Decision B: Build Scope

### Question
Build **all modules**, or commit to a defensible **core** and label the rest **future work**?

### Impact
A thesis rarely builds 16 admin modules + 16 storefront sections well. Scope directly affects:
- Timeline and effort
- Quality per module
- Thesis defense narrative

### Core Modules (Recommended)
**Definite**:
- Authentication (login, register, email OTP)
- Catalogue (browse, search, product details)
- Cart & Wishlist
- Checkout
- Manual bKash Payment
- Order Lifecycle (Pending → Confirmed → Shipped → Delivered)
- Order Tracking
- Customer Profile
- Admin Dashboard
- Admin Order Management
- RBAC (Customer, Manager, Super Admin)
- Analytics (basic)

**Phase 2 (Future Work)**:
- Coupons & Discounts (complex rules engine)
- Inventory Management (stock-in/out, alerts)
- Reviews & Moderation
- Notifications (multi-channel)
- Activity Logs
- Reports Export
- Website Management (CMS)
- Advanced Analytics

### Options
1. **Full Build**: All specified modules
2. **Core + Future**: Core modules now, rest as "future work"
3. **Core Only**: Core modules, remove others from spec

### Current Status
✅ **CONFIRMED** (2026-07-17)

### Decision
**Core + Future** — Build all core modules in Phase 1 (4-6 weeks). Defer extended features to Phase 2 (labeled as "future work" in spec).

### Phase 1 (Core - Defensible for Thesis)
- Authentication (register, login, email OTP)
- Product Catalogue (browse, search, filters, details)
- Cart & Wishlist
- Checkout flow (addresses, shipping method selection)
- Manual bKash Payment submission
- Order Management & Tracking
- Customer Profile
- Admin Dashboard (analytics)
- Admin Order Management (confirm, cancel, tracking)
- Role-Based Access Control (Customer, Manager, Super Admin)
- Basic Analytics

### Phase 2 (Future Work - If Time Allows)
- Coupons & Discounts
- Inventory Management
- Product Reviews & Moderation
- Notifications (multi-channel)
- Activity Logs
- Reports Export
- Website CMS
- Advanced Analytics

### Rationale
Focuses effort on core e-commerce flow (auth → browse → cart → checkout → payment → order tracking). Phase 2 features are complex and can be deferred without breaking the main narrative. This ensures a defensible, working system in the thesis timeline.

---

## Decision C: Tech Stack

### Question
**Name it explicitly**: MERN? Laravel + MySQL? Django + Postgres? Next.js + Postgres?

### Impact
Finalizes architecture diagram and non-functional requirements. Affects:
- Database schema language
- ORM/query language
- Deployment architecture
- Developer experience
- Scalability characteristics

### Current Specification
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Redux Toolkit, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Render (frontend + backend), MongoDB Atlas, Cloudinary

**Stack Name**: **MERN + Cloudinary**

### Options
1. **Proceed with MERN** (MongoDB, Express, React, Node.js)
2. **Switch to**: Laravel + MySQL / Django + Postgres / Next.js + Postgres

### Current Status
✅ **CONFIRMED** (2026-07-17)

### Decision
**MERN + Cloudinary**

**Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui, Redux Toolkit, React Router, React Hook Form  
**Backend**: Node.js, Express.js, Mongoose  
**Database**: MongoDB (Atlas for production)  
**Storage**: Cloudinary  
**Deployment**: Render (frontend + backend)  
**Auth**: JWT + bcrypt

### Rationale
- Proven MERN stack specified in CLAUDE.md and all implementation guides
- Single language (JavaScript) across full stack reduces context switching
- MongoDB suits document-based product/order data model
- Render provides free tier suitable for thesis project
- Cloudinary handles image storage without managing S3/file system

---

## Decision D: Order Lifecycle States

### Question
The spec lists **only 3 states** (Pending, Confirmed, Cancelled), but dashboard/tracking imply **6+**. Which is correct?

### Explicit States (Specified)
- Pending
- Confirmed
- Cancelled

### Implied States (Inferred from other modules)
- Shipped (tracking shows this)
- Delivered (tracking shows this)
- Completed (My Orders implies this)

### Impact
- Affects order status display
- Affects order tracking timeline
- Affects dashboard card counts
- Affects state machine implementation

### Options
1. **Explicit Only**: Use only 3 states; imply nothing
2. **Explicit + Implied**: Use 6 states as shown in REQUIREMENTS.md
3. **Clarify with stakeholder**: Ask which states are actually needed

### Current Status
✅ **CONFIRMED** (2026-07-17)

### Decision
**6 States**: Pending → Confirmed → Shipped → Delivered → Completed → Cancelled

### Order State Machine
| State | Triggered By | User View | Admin Capability |
|-------|--------------|-----------|------------------|
| **Pending** | Customer places order | "Awaiting confirmation" | View order, request proof |
| **Confirmed** | Admin confirms payment | "Order confirmed" | Confirm, cancel |
| **Shipped** | Admin ships order | "On the way" + tracking ID | Update tracking |
| **Delivered** | Admin marks delivered | "Delivered" | Confirm delivery |
| **Completed** | System auto-complete (14+ days) or admin | "Completed" | View history |
| **Cancelled** | Admin or system | "Cancelled" | View reason |

### Rationale
- **Pending & Confirmed**: Manual bKash verification workflow
- **Shipped & Delivered**: Supports order tracking with Parcel ID timeline
- **Completed**: Allows customer reviews after delivery
- **Cancelled**: Can be triggered by admin for fraud/issues
- Matches implied states in tracking + dashboard modules

---

## Decision E: OTP Placement

### Question
When is email OTP verification required: **registration**, **checkout**, or **both**?

### Spec Contradiction
- Authentication module lists "Verify Email (OTP)" at **registration**
- Orders module says email "must be verified with OTP" at **order time**

### Impact
- Registration flow complexity
- Checkout flow complexity
- User friction vs. security
- Whether unverified customers can browse

### Options
1. **Registration-Only**: Verify at signup, allow checkout without re-verify
2. **Checkout-Only**: Allow signup without verify, require OTP at payment
3. **Both**: Verify at registration AND re-verify at checkout
4. **Conditional**: Verify once per session/period

### Current Status
✅ **CONFIRMED** (2026-07-17)

### Decision
**Registration-Only** — Email OTP verified at registration. No re-verification at checkout.

### OTP Flow
1. Customer registers → system sends OTP to email
2. Customer enters OTP within 10 minutes (validity: 10 min)
3. Email marked verified, account unlocked
4. Verified customer can browse and checkout without OTP at payment

### Rationale
- Reduces friction at checkout (manual bKash already requires screenshot/TxnID)
- One verification per signup sufficient for billing address legitimacy
- If re-verification needed for each order, bKash screenshot serves as secondary proof
- Aligns with typical e-commerce practice: verify once, trust after

---

## Decision F: Category Lists Mismatch

### Question
Admin has 8 categories; Storefront has 8 **different** categories. Pick one source of truth.

### Admin Categories (Specified)
- Men, Women, Kids, Accessories (with sub: Cap → Mask), Shoes, Winter, Summer

### Storefront Categories (Specified)
- Men, Women, Kids, Shoes, Accessories, Winter Collection, Summer Collection, **Sale**

### Conflicts
- "Sale" is a **discount filter**, not a category
- "Winter" vs "Winter Collection" (terminology)
- "Summer" vs "Summer Collection" (terminology)
- Subcategories (Cap → Mask) not shown in storefront

### Impact
- Admin must maintain both lists or unify
- Storefront category navigation depends on this
- Product assignment workflow depends on this

### Options
1. **Unify to Admin List**: Use admin categories, hide "Sale" from storefront
2. **Unify to Storefront List**: Add "Sale" as special filter, simplify admin
3. **Separate Admin/Storefront**: Admin manages back-office categories, storefront shows filtered view
4. **Clarify Hierarchy**: Define whether "Winter Collection" = "Winter" category

### Current Status
✅ **CONFIRMED** (2026-07-17)

### Decision
**Unify to Admin List with "Sale" as Filter** — Use admin categories as canonical. "Sale" is a discount filter, not a category.

### Canonical Categories (Database)
- Men
- Women
- Kids
- Shoes
- Accessories (with optional sub-tags: Cap, Mask, etc.)
- Winter
- Summer

### Storefront Presentation
- Browse by main categories above
- Add **Filter: Sale** (shows only discounted products)
- Terminology: Use "Winter Collection" / "Summer Collection" for storefront display (cosmetic labels)
- Admin stores as "Winter" / "Summer" internally

### Admin Categories
- Admin CRUD manages these 7 categories
- Subcategories (Cap → Mask under Accessories) stored as product tags, not separate entities

### Rationale
- Single source of truth (admin list) prevents sync issues
- "Sale" as filter (not category) matches e-commerce UX patterns
- Subcategories as tags simplifies schema (no nested arrays)
- Storefront can display collection names cosmetically

---

## Decision G: Featured Products Location

### Question
Featured products can be edited in **both** Products module **and** Website Management. Pick one source of truth.

### Impact
- Where admins go to mark products as featured
- Whether Website Management is independent CMS or just a view
- How featured list updates propagate

### Options
1. **Products Module Only**: Feature flag set in product CRUD, Website Management just displays
2. **Website Management Only**: Featured list curated separately from products
3. **Both Sync**: Both locations available, data syncs bi-directionally (complex)

### Current Status
✅ **CONFIRMED** (2026-07-17)

### Decision
**Products Module is Source of Truth** — Featured status is set in Product CRUD. Website Management displays only.

### Featured Product Workflow
1. **Admin** goes to **Products** → Edit Product → toggle "Featured" checkbox
2. System marks product as featured, adds to featured collection
3. **Website Management** → **Featured Products** displays the current featured list (read-only view)
4. Storefront homepage shows featured products (auto-populated from toggle)

### Rationale
- Single responsibility: Products module is authoritative
- Website Management becomes a display/analytics dashboard, not a data entry point
- Prevents "which source is correct?" confusion
- Simpler permission model (manager can view, admin sets)

---

## Decision H: Manager CMS Access

### Question
Spec says manager can edit **only Featured Products** in Website Management. Does manager get **any other** CMS access?

### Options
1. **Featured Products Only**: Manager can edit featured list, nothing else
2. **Limited CMS**: Manager can edit Featured Products + Latest Collection
3. **Full CMS**: Manager has all Website Management access (contradicts spec)

### Current Status
✅ **CONFIRMED** (2026-07-21)

### Decision
**Full CMS Access** — Manager has the same Website Management access as super-admin, including blog CMS (create/edit/delete posts) and Featured Products.

### Rationale
Blog CMS was added after original spec; manager role is trusted staff-level, so no need to further restrict CMS scope beyond RBAC already separating Customer/Manager/Super Admin.

---

## Decision I: Billing Address Optional?

### Question
Storefront marks billing address as optional. Admin checkout lists it plainly. Clarify intent.

### Options
1. **Optional**: Billing defaults to shipping; customer can override
2. **Required**: Billing address always required
3. **Conditional**: Required for certain payment methods

### Current Status
✅ **CONFIRMED** (2026-07-21)

### Decision
**Optional, Defaults to Shipping** — Billing address defaults to the shipping address; customer can override at checkout if paying with a different billing address.

### Rationale
Lowest friction for the common case (billing = shipping); manual bKash payment doesn't require billing address verification anyway, so making it mandatory adds no fraud protection.

---

## Decision J: Address Granularity

### Question
Admin profile requires: Line1 / City / **Upazila** / **Division** / **Postal Code**  
Storefront address fields are "looser". Unify.

### Impact
- Database schema
- Address storage and retrieval
- Checkout form complexity
- Admin order view display

### Options
1. **Use Admin Model**: Enforce full Bangladesh model everywhere
2. **Use Storefront Model**: Simplified address model
3. **Hybrid**: Admin CRUD uses full model, storefront accepts simplified, store full internally

### Current Status
✅ **CONFIRMED** (2026-07-17)

### Decision
**Hybrid Model** — Admin & Database use full Bangladesh model. Storefront accepts simplified input, store full internally.

### Canonical Address Model (Database)
```
{
  line1: string (required),          // Street address
  line2: string (optional),          // Building, apartment
  city: string (required),
  upazila: string (required),        // Bangladesh administrative division
  division: string (required),       // Bangladesh state-level division
  postalCode: string (required),
  country: "Bangladesh"              // Fixed
}
```

### Storefront Checkout Form
- Display: Line1, Line2, City, (Upazila auto-filled based on City)
- Required: Line1, City, Upazila, Division, PostalCode
- Store full model in database

### Admin Order View
- Display all fields (line1, line2, city, upazila, division, postalCode)

### Rationale
- Bangladesh-specific fields (upazila, division) support proper address verification
- Storefront can auto-fill upazila based on city (reduces friction)
- Admin sees complete address for shipping accuracy
- Validation rules: upazila must belong to selected division

---

## Decision K: Payment Proof Requirement

### Question
Transaction ID and screenshot are **optional**. Pending orders may have **no verifiable proof of payment**. Tighten or justify?

### Impact
- Fraud risk
- Admin verification workflow
- Customer experience (friction)
- Thesis defense talking points

### Options
1. **Require Both**: txn ID AND screenshot mandatory
2. **Require One**: txn ID OR screenshot (at least one proof)
3. **Optional (Current)**: Accept zero proof, document trade-off in thesis

### Current Status
✅ **CONFIRMED** (2026-07-17)

### Decision
**Require One**: Either Transaction ID OR screenshot (at least one proof mandatory).

### Payment Proof Model
- **Transaction ID**: Optional but strongly encouraged (user filled field)
- **Screenshot**: Optional but strongly encouraged (user uploaded image)
- **Validation**: Reject order if BOTH missing (at least one required)

### Admin Verification
- Admin views pending order with TxnID (if provided) + screenshot (if provided)
- Admin can **Confirm** order if satisfied with proof level
- Admin can **Request** better proof (reply to customer)
- Admin can **Cancel** order if proof is fraudulent

### Rationale
- **Fraud mitigation**: Requires at least minimal proof, not zero
- **Customer friction**: Lower than requiring both, but still deters fraud
- **Admin workflow**: Clear verification criteria in dashboard
- **Thesis talking point**: "Balanced fraud vs. UX" design decision

---

## Decision L: Stock Management

### Question
Is stock tracked per **product** (all variants share one pool) or per **size/color variant** (each combo has own stock)?

### Impact
- Database schema
- Inventory management complexity
- Product variant architecture
- Cart/checkout logic

### Options
1. **Per Product**: One stock number, all variants reduce same pool
2. **Per Variant**: Each size+color combination has independent stock
3. **Both**: Track at both levels

### Current Status
✅ **CONFIRMED** (2026-07-17)

### Decision
**Per Product** (Phase 1) — One stock number per product. Phase 2 can refactor to per-variant.

### Phase 1 Stock Model
```
Product {
  name: string,
  price: number,
  stock: number,          // Global stock for all variants
  variants: [
    { size, color }       // No individual stock tracking
  ]
}
```

### Stock Management
- When customer adds item to cart, reserved from global stock
- Cart displays: "4 in stock" (global, not per-variant)
- Checkout: Reserve stock, prevent oversell
- Admin: Can adjust global stock in Products module

### Phase 2 Enhancement (Future)
- Per-size/color stock tracking
- Low-stock alerts per variant
- Individual variant availability status

### Rationale
- Simpler for Phase 1: single number per product
- Prevents overcomplication of cart/checkout logic
- E-commerce pattern: can refactor to variants in Phase 2 without breaking orders
- Reduces schema complexity (no nested stock objects)

---

## Decision M: Coupon System

### Question
Cart has **Coupon Code** field, but coupon rules are **completely undefined**. Define or remove?

### Undefined**:
- Coupon types (% discount, flat discount, free shipping, buy-one-get-one)
- Validation rules (min purchase, usage limits, expiry)
- Admin coupon management UI
- Customer redemption flow

### Options
1. **Define Full Coupon System**: Implement coupons in Phase 1
2. **Defer to Phase 2**: Accept "Coupon Code" field, don't implement (show error "Coming Soon")
3. **Remove**: Strip coupon from Phase 1 spec, add in future

### Current Status
⏳ **AWAITING DECISION**

### To Decide
- [ ] Confirm coupon scope
- [ ] Define coupon types
- [ ] Define validation rules (if Phase 1)

---

## Decision N: Reviews & Moderation

### Question
Product reviews exist in storefront, but admin moderation flow is **undefined**. Define or remove?

### Undefined**:
- Can customers write reviews immediately, or pending moderation?
- Does admin moderate each review?
- Can manager approve reviews, or super-admin only?
- Display unmoderated reviews?

### Options
1. **Define Moderation**: Implement review system with moderation in Phase 1
2. **Defer to Phase 2**: Allow customers to write, don't show moderation UI yet
3. **Remove**: No reviews in Phase 1

### Current Status
⏳ **AWAITING DECISION**

### To Decide
- [ ] Confirm review scope
- [ ] Define moderation workflow
- [ ] Define moderation roles

---

## Summary: Critical Path

### Must Decide BEFORE Implementation
1. **A. Thesis Framing** — determines project structure
2. **B. Build Scope** — determines timeline and effort
3. **C. Tech Stack** — determines architecture
4. **D. Order States** — affects order logic
5. **E. OTP Placement** — affects auth flow
6. **K. Payment Proof** — affects payment validation

### Should Decide BEFORE Implementation
7. **F. Categories** — affects product structure
8. **G. Featured Products** — affects admin UX
9. **J. Address Model** — affects database schema
10. **L. Stock Model** — affects inventory logic

### Can Defer to Phase 2
11. **H. Manager CMS** — affects CMS access only
12. **I. Billing Address** — affects checkout UX
13. **M. Coupons** — feature can be stubbed
14. **N. Reviews** — feature can be stubbed

---

## Approval Checklist

- [ ] **A**: Thesis framing confirmed
- [ ] **B**: Build scope confirmed
- [ ] **C**: Tech stack confirmed
- [ ] **D**: Order lifecycle states confirmed
- [ ] **E**: OTP placement confirmed
- [ ] **F**: Category list unified
- [ ] **G**: Featured products source confirmed
- [ ] **J**: Address model unified
- [ ] **K**: Payment proof requirement confirmed
- [ ] **L**: Stock tracking model confirmed

**Once all critical decisions are approved, implementation can begin.**
