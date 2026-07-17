# setup-project Skill

## Description

Initial project setup: environment, dependencies, git, CI/CD, and ready for development.

## Usage

```
/setup-project
```

or

```
/setup-project [--frontend-only] [--backend-only] [--skip-git] [--skip-ci]
```

## Prerequisites

- Node.js 18+ installed
- Git installed
- MongoDB Atlas account (for backend)
- Cloudinary account (for storage)
- GitHub account (for repository)

## Setup Steps

### 1. Git Repository

**If fresh start**:
- Initialize git repo
- Create .gitignore
- Create initial commit

**If existing repo**:
- Verify branch structure
- Verify remote is correct
- Verify no uncommitted changes

### 2. Project Structure

Create directory structure:
```
frontend/
backend/
.claude/
  └── specs/
  └── agents/
  └── skills/
README.md
CONTRIBUTING.md
.gitignore
```

### 3. Frontend Setup

**Install dependencies**:
```bash
cd frontend
npm install
```

**Create .env.local**:
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ClothingStore
```

**Verify setup**:
```bash
npm run dev
```
Expected: Dev server running on `http://localhost:5173`

**Install dev tools**:
- ESLint
- Prettier
- Jest + React Testing Library
- Pre-commit hooks

**Update package.json scripts**:
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext .jsx,.js",
  "format": "prettier --write src",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### 4. Backend Setup

**Install dependencies**:
```bash
cd backend
npm install
```

**Create .env**:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=dev_secret_key_change_in_production
JWT_REFRESH_SECRET=dev_refresh_secret_key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
BKASH_NUMBER=01912345678
```

**Create database connection test**:
- Test MongoDB connection
- Create indexes
- Seed initial data (categories, shipping methods)

**Verify setup**:
```bash
npm run dev
```
Expected: Server running on `http://localhost:5000`

**Install dev tools**:
- ESLint
- Prettier
- Jest + Supertest
- Nodemon
- Pre-commit hooks

**Update package.json scripts**:
```json
{
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "lint": "eslint src --ext .js",
  "format": "prettier --write src",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### 5. Database Setup

**Connect to MongoDB Atlas**:
- Create cluster
- Create database user
- Add IP whitelist
- Get connection string

**Create initial schema**:
- Run migrations to create collections
- Create indexes
- Seed initial data:
  - Categories (Men, Women, Kids, Shoes, etc.)
  - Shipping Methods (Standard, Express)
  - Default Settings

### 6. Storage Setup

**Setup Cloudinary**:
- Create account
- Get Cloud Name, API Key, API Secret
- Create upload presets
- Add to .env

### 7. Email Setup

**Configure SMTP**:
- Use Gmail, Mailgun, or SendGrid
- Get SMTP credentials
- Add to .env
- Test email sending

### 8. Git Workflow

**Create branches**:
```bash
git branch main
git branch develop
git branch feature/auth
git branch feature/products
```

**Setup branch protection** (GitHub):
- main: require PR review, pass CI/CD
- develop: require PR review
- feature branches: free to push

**Setup pre-commit hooks**:
- Run linter on staged files
- Run prettier on staged files
- Prevent commits with lint errors

### 9. CI/CD Pipeline

**GitHub Actions** (if using GitHub):

Create `.github/workflows/ci.yml`:
- Run linter
- Run tests
- Run build
- Report coverage

Create `.github/workflows/deploy.yml`:
- Deploy to Render on main branch push
- Run smoke tests
- Notify on success/failure

### 10. Documentation

**Create README.md**:
- Project overview
- Tech stack
- Setup instructions
- Development workflow
- API documentation link
- Deployment info

**Create CONTRIBUTING.md**:
- Code standards
- PR process
- Development workflow
- Commit message format

**Create .claude/CLAUDE.md**:
- Project rules
- Architecture decisions
- Development workflow

### 11. Verification

**Checklist**:
- [ ] Frontend dev server running
- [ ] Backend dev server running
- [ ] Database connected
- [ ] Can create/read test data
- [ ] API endpoints responding
- [ ] Frontend can call API
- [ ] Git repo initialized
- [ ] .env files created (with examples in .env.example)
- [ ] Linter works
- [ ] Tests run
- [ ] Pre-commit hooks working
- [ ] README complete

### 12. Team Communication

**Create project documentation**:
- Share setup instructions
- Share .env.example (never share actual .env)
- Share development workflow
- Share deployment process
- Share contact info for questions

## Output

1. **Setup Report** (checklist of what was done)
2. **Environment Configuration** (with instructions)
3. **Development Server Status** (frontend + backend running)
4. **Git Repository Ready** (with branches and hooks)
5. **Quick Start Guide** (for new developers)
6. **Deployment Checklist** (for later)

## Success Criteria

- ✓ Both servers running without errors
- ✓ Database connected and seeded
- ✓ Frontend can call backend API
- ✓ Linter and formatter working
- ✓ Tests can run
- ✓ Git repo initialized with proper structure
- ✓ .env files created with examples
- ✓ Documentation complete
- ✓ Team can start development immediately

## Troubleshooting

**Frontend server won't start**:
- Clear node_modules and npm cache
- Reinstall: `npm install --force`
- Check Node.js version: `node --version` (should be 18+)

**Backend server won't connect to MongoDB**:
- Verify connection string in .env
- Verify IP whitelist in MongoDB Atlas
- Test with MongoDB Compass

**API calls failing**:
- Check CORS configuration
- Verify VITE_API_URL in frontend .env
- Check backend PORT in .env

**Git hooks not working**:
- Reinstall: `npm install --force`
- Configure manually: `git config core.hooksPath .git/hooks`

## Related

- Feature Builder: `/create-feature` to start first feature
- API Testing: `/api-test` to test API endpoints
- Code Review: `/code-review` for code quality

## Notes

- This skill is idempotent: can be run multiple times safely
- It's designed for new projects, not existing ones
- It takes 30+ minutes to complete
- After setup, team can begin feature development
- Configuration should be customized for your deployment environment

## Next Steps After Setup

1. Run `/api-test` to verify all endpoints
2. Use `/create-feature` to build features
3. Use `/fix-bug` to handle issues
4. Use `/code-review` before merging
5. Deploy to staging first, then production
