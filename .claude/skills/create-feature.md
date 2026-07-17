# create-feature Skill

## Description

End-to-end development of a complete feature following Specification-Driven Development (SDD) workflow.

## Usage

```
/create-feature <feature-name> <module>
```

**Examples**:
```
/create-feature "Product Search" products
/create-feature "Order Checkout" orders
/create-feature "Admin Dashboard" admin
```

## Workflow

### 1. Specification Review
- Read REQUIREMENTS.md for feature details
- Read DECISIONS.md for relevant decisions
- Identify dependencies on other features
- Check for conflicts or gaps

### 2. Ask for Confirmation
If specification is clear:
- **Proceed** with architecture design

If specification is ambiguous:
- **Stop** and ask for clarification
- Document issue in ISSUES.md
- Wait for approval

### 3. Architecture Design
- Sketch frontend components
- Sketch backend services/controllers
- Sketch database schema (if needed)
- Identify API endpoints
- Explain design rationale

### 4. Implementation (after approval)

#### Backend (if needed)
- Create Mongoose schemas
- Create models with validation
- Create API routes
- Create controllers
- Create services/business logic
- Add error handling
- Add request validation

#### Frontend (if needed)
- Create page/screen
- Create reusable components
- Setup Redux slice (if needed)
- Create API service/hook
- Setup forms with validation
- Handle loading/error states
- Style with Tailwind CSS
- Ensure responsive design
- Ensure accessibility

#### Database (if needed)
- Create migrations
- Seed test data
- Create indexes
- Document relationships

### 5. Integration
- Connect frontend to backend
- Test end-to-end flow
- Handle all error cases
- Test edge cases

### 6. Testing
- Write unit tests
- Write integration tests
- Write E2E tests (critical paths)
- Achieve 80%+ coverage

### 7. Code Review
- Self-review against standards
- Run linter and formatter
- Check Definition of Done
- Request code review

### 8. Commit
- Create descriptive commit message
- Reference related issues/decisions
- Prepare PR description

## Requirements

Before using this skill:
1. Feature must be in REQUIREMENTS.md
2. All decisions for feature must be confirmed in DECISIONS.md
3. Database schema documented in DATABASE_SCHEMA.md
4. API endpoints documented in API_SPECIFICATION.md

## Approval Gates

This skill will stop and ask for approval:
- When architecture requires clarification
- When specification is ambiguous
- When major design decision needed
- When estimation suggests scope creep

## Output

1. **Implementation Plan** (architecture diagram)
2. **Database Schema** (if applicable)
3. **API Endpoints** (if applicable)
4. **Implemented Code** (backend + frontend)
5. **Test Suite** (unit, integration, E2E)
6. **PR Description**
7. **Deployment Checklist**

## Definition of Done

Feature is complete when:
- ✓ All requirements implemented
- ✓ Feature works end-to-end
- ✓ No lint/formatting errors
- ✓ No console errors/warnings
- ✓ All API endpoints tested
- ✓ Validation & error handling complete
- ✓ Responsive (mobile to desktop)
- ✓ Accessible
- ✓ Performance acceptable
- ✓ Code follows standards
- ✓ Code is clean and commented
- ✓ No unrelated files modified
- ✓ Ready to merge

## Tips

1. **Start small**: Begin with core features (auth, products, cart)
2. **Test early**: Test end-to-end as soon as backend + frontend connect
3. **Ask questions**: When spec is unclear, ask before building
4. **Follow standards**: Adhere to CLAUDE.md rules strictly
5. **Document**: Keep README updated as you build

## Related

- Feature Builder Agent: `/create-feature` runs the feature builder agent
- Code Review: Run `/code-review` on completed features
- API Testing: Run `/api-test` on API endpoints

## Example

```
User: /create-feature "Customer Cart" cart

Skill:
1. Reads REQUIREMENTS.md → Cart section
2. Checks DECISIONS.md → No conflicts
3. Reads DATABASE_SCHEMA.md → Cart schema defined
4. Reads API_SPECIFICATION.md → Cart endpoints defined
5. Asks: "Ready to design and build cart feature?"
   → User: "Yes"
6. Designs architecture (shows diagram)
   → User: "Approve"
7. Implements backend (cart routes, controllers, services)
8. Implements frontend (cart page, components, Redux slice)
9. Integrates and tests end-to-end
10. Runs code review
11. Creates commit and PR
12. Reports: "Cart feature complete and ready to merge"
```

## Troubleshooting

**Q: "Feature is not in REQUIREMENTS.md"**
- A: Add feature to REQUIREMENTS.md first, then use this skill

**Q: "Specification is unclear"**
- A: The skill will stop and ask questions. Update REQUIREMENTS.md and run again.

**Q: "API endpoints not documented"**
- A: Add endpoints to API_SPECIFICATION.md first

**Q: "I need to change the architecture"**
- A: Ask the skill to stop, update DECISIONS.md, then restart

## Notes

- This skill is thorough and takes time (30+ minutes per feature)
- It's designed to prevent rework by getting things right first
- It enforces quality standards from the start
- It generates complete, production-ready code
- It's best used for major features, not tiny tweaks

---

For features that are too small for this workflow, just ask Claude Code directly to implement them.
