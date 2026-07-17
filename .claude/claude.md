# CLAUDE.md

# Clothing E-Commerce Platform

## Project Goal

Build a production-quality clothing e-commerce platform using Specification-Driven Development (SDD).

This project must be developed feature-by-feature according to the project specifications.

Never invent requirements.

If the specification is unclear, stop and ask.

---

# Development Workflow

For every feature, follow this workflow in order:

1. Requirements
   - Understand the specification.
   - Identify missing, ambiguous, or conflicting requirements.
   - Stop and ask for clarification if necessary.

2. Architecture
   - Design the feature before implementation.
   - Explain the chosen architecture and justify major decisions.

3. Database
   - Design or update the database schema.
   - Define entities, relationships, indexes, and migrations.

4. API
   - Design endpoints.
   - Define request/response schemas, validation, authentication, and error handling.

5. Frontend
- Read and follow the Premium Frontend guidelines from `.claude/skills/premium-frontend/`.
- Design the UI and user flow.
- Implement reusable, accessible, responsive, and production-quality components.
- Follow the project's design system, component architecture, and state management patterns.

6. Backend
   - Implement business logic.
   - Connect APIs, database, authentication, and services.

7. Testing
   - Verify functionality.
   - Include unit, integration, and end-to-end testing where appropriate.

## Rules

- Never skip a step.
- Never implement code before completing Requirements and Architecture.
- Never invent requirements or business rules.
- If the specification is incomplete or contradictory, stop and ask for clarification.
- Complete the current step before moving to the next.
- Ensure every implementation matches the approved specification.

---

## Documentation Review Workflow

Before starting any implementation, the **Main Agent** must delegate documentation review to a **Documentation Sub-Agent**.

### Documentation Sub-Agent Responsibilities

Read and analyze every project document:

```
docs/
├── API.md
├── ARCHITECTURE.md
├── BACKEND.md
├── DATABASE.md
├── FRONTEND.md
├── PROBLEM_STATEMENT.md
├── SPEC.md
├── issues/
│   └── ISSUES.md
├── skills/
└── specs/
```

### Sub-Agent Report

- Always read `PROBLEM_STATEMENT.md` first to understand the project objective.
- Project overview
- Features & requirements
- Architecture (Frontend, Backend, Database, API)
- Business rules & validation
- Dependencies
- Coding standards
- Issues & constraints
- Missing or conflicting documentation

---

### Main Agent Rules

- Never begin coding until the Documentation Report has been received.
- Use the Documentation Report as the source of truth.
- Never assume undocumented behavior.
- If documentation conflicts or is incomplete, stop and ask for clarification before implementation.
- Keep the Documentation Report in context for the remainder of the task.

---

# Technology Stack

**Frontend:** React, Vite, Tailwind CSS, shadcn/ui, Redux Toolkit, React Router, React Hook Form, Axios, Framer Motion, GSAP, React Three Fiber.

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, Nodemailer, Cloudinary, Multer.

# Deployment

Frontend
- Render
Backend
- Render
Database
- MongoDB Atlas
Storage
- Cloudinary
---

# Architecture

Use a Component-Based Architecture for the frontend.
Use an MVC architecture with a service layer for the backend.

## Frontend

```text
frontend/
└── src/
    ├── api/
    ├── assets/
    ├── components/
    ├── context/
    ├── hooks/
    ├── layouts/
    ├── pages/
    ├── routes/
    ├── services/
    ├── store/
    ├── styles/
    ├── utils/
    ├── App.jsx
    └── main.jsx
```

## Backend

```text
backend/
└── src/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── services/
    ├── middlewares/
    ├── validations/
    ├── config/
    ├── utils/
    ├── app.js
    └── server.js
```

---

# Coding Principles

- Write clean, readable, and maintainable code.
- Prefer readability over cleverness.
- Follow the DRY (Don't Repeat Yourself) principle.
- Keep functions and components small and focused.
- Prefer composition over inheritance.
- Use reusable components, hooks, and services.
- Follow the Single Responsibility Principle (SRP).
- Keep business logic out of UI components.
- Use meaningful names for files, variables, functions, and components.
- Validate all user input.
- Handle errors gracefully.
- Keep code consistent throughout the project.
- Remove unused code, imports, and dependencies.
- Never hardcode configuration values or secrets.
- Write production-ready code, not temporary fixes.

---

# Code Comments

- Add a short descriptive comment above every controller function, service function, middleware, utility function, and important code block.
- Keep comments short (one line whenever possible).
- Update comments whenever the code changes.
- Do not write unnecessary comments.

---

# Component Rules

- Each component should have a single responsibility.
- Keep components small and reusable.
- Split large components when needed.
- Prefer composition over duplication.
- Extract reusable logic into custom hooks.
- Keep business logic out of UI components.

---

# State Management

- Redux Toolkit for global state.
- RTK Query for server state.
- React Hooks for local UI state.
- Never duplicate state.
- Keep state close to where it is used.

---

# API Rules

- Use RESTful API design.
- Use proper HTTP methods:
  - GET
  - POST
  - PUT
  - PATCH
  - DELETE
- Use meaningful endpoint names.
- Validate all request data.
- Return appropriate HTTP status codes.
- Keep response formats consistent.

### Success Response

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Something went wrong.",
  "errors": []
}
```

---

# Authentication

- JWT Authentication
- Refresh Tokens

### Roles

---

# Error Handling

- Never swallow errors.
- Return meaningful error messages.
- Log server errors.
- Show user-friendly messages.
- Use consistent error responses.

---

# Environment Variables

- Store all secrets in `.env`.
- Never hardcode secrets, API keys, or credentials.
- Never commit `.env` to Git.
- Keep `.env.example` updated with all required variables.
- Validate required environment variables on application startup.

---

# Security

- Validate and sanitize all user input.
- Hash passwords using **bcrypt**.
- Protect private routes with **JWT Authentication**.
- Never expose sensitive data in API responses.
- Never log passwords, tokens, or secrets.
- Protect against unauthorized access.
- Use secure HTTP headers where applicable.
- Store uploaded files securely using **Cloudinary**.

---

# Styling

- Use **Tailwind CSS** only.
- Do not use inline CSS.
- Do not use Bootstrap or other CSS frameworks.
- Follow a mobile-first approach.
- Ensure responsive design for:
  - Mobile
  - Tablet
  - Desktop
  - Large Desktop
- Use consistent spacing, typography, and color tokens.
- Keep styling reusable and maintainable.

---

# Animations

- Use **Framer Motion** for UI animations.
- Use **GSAP** only when necessary for complex animations.
- Use **React Three Fiber** for all 3D experiences.
- Keep animations smooth and purposeful.
- Do not add unnecessary animations.
- Never sacrifice performance for visual effects.

---

# Performance

- Use lazy loading where appropriate.
- Use code splitting for routes and large components.
- Optimize all images before rendering.
- Memoize components and calculations only when beneficial.
- Avoid unnecessary re-renders.
- Minimize bundle size.
- Optimize API requests and prevent duplicate requests.
- Keep initial page load as fast as possible.

---

# Working Rules

Before writing code:

1. Read all relevant documentation.
2. Understand the requirements.
3. Identify any missing or conflicting requirements.
4. Create an implementation plan.
5. Explain the plan.
6. Follow the Approval Rules before implementing.

After approval:

- Implement only the requested feature.
- Do not modify unrelated files.
- Follow the project architecture and coding standards.
- Stop after completing the requested task.
---

# Requirement Conflicts

If requirements are missing, ambiguous, or conflicting:

- Never guess or make assumptions.
- Create or update `.claude/issues/ISSUES.md`.
- Record each issue with:
  - Issue
  - Affected Files
  - Conflict
  - Possible Solutions
  - Recommended Solution
- Explain the issue to the user.
- Wait for approval before proceeding.

Do not implement features until the conflict is resolved.

---

# Approval Rules

Wait for approval only if:

- Requirements are missing or ambiguous.
- Requirements conflict with existing specifications.
- A major architectural change is required.
- A breaking change is required.
- A new dependency or technology is introduced.


Otherwise, continue implementing the requested feature according to the specification.

---
# Definition of Done


A task is complete only if all of the following are true:

- ✓ Requirements are fully implemented.
- ✓ Feature works as expected.
- ✓ No lint errors.
- ✓ No console errors or warnings.
- ✓ API endpoints work correctly.
- ✓ Validation and error handling are implemented.
- ✓ Responsive on Mobile, Tablet, Desktop, and Large Desktop.
- ✓ Accessible where applicable.
- ✓ Performance has not been negatively impacted.
- ✓ Code follows the project architecture and coding standards.
- ✓ Code is clean, reusable, and well-commented.
- ✓ No unrelated files were modified.
- ✓ Ready to commit to Git.
- ✓ No unresolved TODOs or placeholder code.
