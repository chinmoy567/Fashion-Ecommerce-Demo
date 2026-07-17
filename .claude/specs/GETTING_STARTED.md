# Getting Started — E-Commerce Platform for Bangladesh

Welcome! This guide will help you understand the project structure and get started with development.

---

## Project Overview

**Project**: Clothing E-Commerce Platform for Bangladesh Market  
**Stack**: MERN (MongoDB, Express, React, Node.js) + Cloudinary  
**Status**: Ready for Development (after decisions confirmed)

**Key Features**:
- Customer storefront (browse, cart, wishlist, checkout)
- Manual bKash payment (no gateway integration)
- Order tracking with Parcel ID
- Admin/Manager dashboard
- Role-based access control
- Analytics and CMS

---

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+
- Git
- MongoDB Atlas account
- Cloudinary account
- GitHub account

### 2. Clone and Setup
```bash
git clone <repo-url>
cd clothing-ecommerce

# Run complete setup (takes ~30 minutes)
/setup-project
```

### 3. Verify Both Servers
```bash
# Terminal 1: Frontend
cd frontend && npm run dev
# Should see: http://localhost:5173

# Terminal 2: Backend
cd backend && npm run dev
# Should see: Server running on port 5000
```

### 4. Start Building
```bash
# Build a feature
/create-feature "Customer Authentication" auth

# or fix a bug
/fix-bug "Cart total incorrect when coupon applied"

# or review code
/code-review
```

---

## Project Structure

```
.claude/
  ├── specs/              # All specifications (read these first!)
  │   ├── REQUIREMENTS.md # What to build
  │   ├── DECISIONS.md    # Critical decisions (must confirm)
  │   ├── API_SPECIFICATION.md  # API design
  │   ├── DATABASE_SCHEMA.md    # Database design
  │   └── PROJECT_STRUCTURE.md  # Directory layout
  ├── agents/             # Custom AI agents
  │   ├── documentation-reviewer.md
  │   ├── feature-builder.md
  │   ├── code-reviewer.md
  │   └── api-tester.md
  ├── skills/             # Custom skills (/command names)
  │   ├── create-feature.md
  │   ├── fix-bug.md
  │   └── setup-project.md
  └── CLAUDE.md          # Main project rules

frontend/               # React + Vite SPA
backend/               # Express.js REST API
docs/                 # Additional documentation
README.md             # Project overview
```

---

## Critical: Read the Specifications

**Before any coding**, read these in order:

1. **REQUIREMENTS.md** (15 min)
   - What features need to be built
   - User roles and permissions
   - Data model
   - API structure

2. **DECISIONS.md** (10 min)
   - Critical decisions that need confirmation
   - Conflicts in the spec
   - Gaps that need clarification
   - **⚠️ These must be approved before coding!**

3. **API_SPECIFICATION.md** (20 min)
   - All API endpoints
   - Request/response formats
   - Error handling
   - Authentication

4. **DATABASE_SCHEMA.md** (15 min)
   - All collections and fields
   - Relationships
   - Validation rules
   - Indexes

5. **PROJECT_STRUCTURE.md** (10 min)
   - Directory layout
   - Naming conventions
   - Development workflow

**Total Reading Time**: ~70 minutes  
**This is non-negotiable — your code depends on this understanding!**

---

## Decision Workflow

### Critical Decisions (Must Confirm)

These decisions are **blocking** development:

1. **A. Thesis Framing** — Is this a build project or research study?
2. **B. Build Scope** — All modules or core-only + future work?
3. **C. Tech Stack** — Confirm MERN + Render + MongoDB Atlas
4. **D. Order Lifecycle** — Which states? (Pending, Confirmed, Shipped, Delivered, Completed, Cancelled)
5. **E. OTP Placement** — Registration? Checkout? Both?
6. **K. Payment Proof** — Optional or require at least one proof?

**Action**: Review DECISIONS.md and confirm all critical decisions (marked A–K) before starting.

---

## Development Workflow

### Phase 1: Core Features (4-6 weeks)
Build these first (defensible for thesis):
- Authentication (register, login, email OTP)
- Products (browse, search, filters)
- Cart & Wishlist
- Checkout (address, shipping method)
- Manual bKash Payment
- Order Lifecycle (Pending → Confirmed → Shipped → Delivered)
- Order Tracking
- Admin Dashboard
- Admin Order Management
- RBAC (Customer, Manager, Super Admin)

### Phase 2: Extended Features (2-3 weeks)
Build if time allows:
- Coupons & Discounts
- Inventory Management
- Reviews & Moderation
- Notifications
- Activity Logs
- Website Management (CMS)

### Phase 3: Polish & Deployment (1-2 weeks)
- Performance optimization
- Security hardening
- Documentation
- Deployment to production

---

## Using Custom Skills

### 1. Setup Project (First)
```bash
/setup-project
```
Initialize environment, install dependencies, configure Git/CI-CD.

### 2. Create Features (Iteratively)
```bash
/create-feature "Customer Authentication" auth
/create-feature "Product Catalog" products
/create-feature "Shopping Cart" cart
```

Each feature goes through:
1. Specification review
2. Architecture design (approval gate)
3. Database design
4. API design
5. Backend implementation
6. Frontend implementation
7. Integration testing
8. Code review
9. Ready to merge

**Time per feature**: 2-4 hours (depending on complexity)

### 3. Fix Bugs (As Needed)
```bash
/fix-bug "Cart total shows wrong amount when coupon applied"
```

Root cause → Fix → Test → Commit

**Time per bug**: 15-45 minutes

### 4. Review Code (Before Merging)
```bash
/code-review
/code-review --high  (more thorough)
/code-review --ultra (multi-agent deep review)
```

Checks correctness, security, performance, quality.

### 5. Test API (After Implementation)
```bash
/api-test
```

Tests all endpoints, authorization, validation, performance, security.

---

## Coding Standards

### Naming Conventions
- **Folders**: lowercase-kebab-case
- **Components**: PascalCase (.jsx files)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Database IDs**: ObjectId or prefixed strings (ord_123, pay_456)

### File Organization
```
components/
  └── ProductCard.jsx          # One component per file
  └── ProductCard.test.jsx     # Test file
  └── index.js                 # Export barrel

services/
  └── productService.js        # Business logic

hooks/
  └── useProduct.js            # Custom hook
```

### Code Quality
- **No eslint errors**: `npm run lint`
- **Formatted**: `npm run format`
- **Tests passing**: `npm run test`
- **No console.log left behind**
- **No TODO/FIXME in production code**
- **Comments for complex logic only**

### Commits
```
<type>(<scope>): <subject>

<body>

Fixes #123
Related-To: DECISIONS.md#E
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

---

## Definition of Done

Every task is complete when:
- ✓ Specification fully implemented
- ✓ Feature works end-to-end
- ✓ No lint errors
- ✓ No console errors/warnings
- ✓ API endpoints tested
- ✓ Validation & error handling complete
- ✓ Responsive: Mobile, Tablet, Desktop
- ✓ Accessible
- ✓ Performance acceptable
- ✓ Code follows standards
- ✓ Code is clean and reusable
- ✓ No unrelated files modified
- ✓ Ready to commit
- ✓ No unresolved TODOs

---

## Common Questions

### Q: Where do I find what to build?
A: REQUIREMENTS.md describes all features. Pick one and use `/create-feature` to build it end-to-end.

### Q: What if the spec is unclear?
A: DECISIONS.md lists all conflicts. Confirm those decisions first. If something else is unclear, ask — don't guess!

### Q: How do I know if my code is good?
A: Run `/code-review` before merging. It checks correctness, security, performance, quality.

### Q: I'm stuck on a bug. Help?
A: Use `/fix-bug` with the description. It will debug systematically.

### Q: Do I need to write tests?
A: Yes! Target 80%+ coverage. Unit tests for logic, integration tests for API, E2E for critical flows.

### Q: How do I deploy?
A: Frontend → Render, Backend → Render, Database → MongoDB Atlas, Storage → Cloudinary. See PROJECT_STRUCTURE.md for details.

### Q: What's the deadline?
A: Check with project manager. Plan phases accordingly (Phase 1 ~4-6 weeks for core features).

---

## Key Files to Review

**Must Read** (in order):
1. `.claude/specs/REQUIREMENTS.md` — What to build
2. `.claude/specs/DECISIONS.md` — Critical decisions
3. `.claude/CLAUDE.md` — Project rules
4. `.claude/specs/API_SPECIFICATION.md` — API design
5. `.claude/specs/DATABASE_SCHEMA.md` — Database design

**Reference During Dev**:
- `.claude/specs/PROJECT_STRUCTURE.md` — Directory layout
- `frontend/README.md` — Frontend setup
- `backend/README.md` — Backend setup

**For Issues/Conflicts**:
- `.claude/issues/ISSUES.md` — Known issues and resolutions

---

## Development Checklist

### Before Starting
- [ ] Read REQUIREMENTS.md
- [ ] Read DECISIONS.md and confirm critical decisions
- [ ] Read CLAUDE.md
- [ ] Run `/setup-project`
- [ ] Both servers running

### For Each Feature
- [ ] Create feature spec in REQUIREMENTS.md
- [ ] Confirm no conflicts in DECISIONS.md
- [ ] Run `/create-feature "Name" module`
- [ ] Follow approval gates
- [ ] Test end-to-end
- [ ] Run `/code-review`
- [ ] Commit with clear message
- [ ] Create PR with description

### Before Deployment
- [ ] Run `/api-test` — all endpoints pass
- [ ] Run `/code-review --high` — no issues
- [ ] Manual testing of critical flows
- [ ] Performance check (Lighthouse, bundle size)
- [ ] Security check (OWASP top 10)
- [ ] Database backup
- [ ] Deploy to staging first

---

## Getting Help

### Code Questions
Ask Claude Code directly. It has context from your specifications and project structure.

### Spec Questions
Check REQUIREMENTS.md and DECISIONS.md. If still unclear, add to ISSUES.md and ask the team.

### Technical Issues
Describe the issue with error messages. Use `/fix-bug` for systematic debugging.

### Performance Issues
Run profiling tools, check database queries, analyze bundle size. Use `/code-review --high` for optimization suggestions.

---

## Success Criteria

By end of Phase 1, you should have:
- ✓ Core features complete and tested
- ✓ API endpoints documented and tested
- ✓ Clean, maintainable codebase
- ✓ Comprehensive specifications
- ✓ No technical debt blockers
- ✓ Ready to deploy to staging

---

## Next Steps

1. **Right Now**: Read the specifications (~70 minutes)
2. **Then**: Confirm critical decisions in DECISIONS.md
3. **Next**: Run `/setup-project` to initialize environment
4. **Start Building**: Run `/create-feature "Authentication" auth` for first feature
5. **Iterate**: Build features using `/create-feature`, fix issues with `/fix-bug`, review with `/code-review`

---

## Project Resources

- **Specifications**: `.claude/specs/` (all design documentation)
- **Agents**: `.claude/agents/` (specialized workers)
- **Skills**: `.claude/skills/` (CLI commands)
- **Issues**: `.claude/issues/ISSUES.md` (known conflicts/gaps)
- **Rules**: `.claude/CLAUDE.md` (project governance)

---

## Remember

✅ **This project is built right the first time**
- Read specs before coding
- Confirm decisions before building
- Test end-to-end before committing
- Review code before merging
- Follow standards throughout

❌ **Avoid the trap of "move fast and break things"**
- Thesis projects need quality
- Code rework is expensive
- Technical debt compounds
- Security issues are hard to fix later

**Build it once, build it right.**

---

**Ready to start? Begin with REQUIREMENTS.md, then run `/setup-project`. Good luck! 🚀**
