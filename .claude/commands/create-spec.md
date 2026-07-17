# Task Specification Workflow

Every implementation task must have its own specification document.

## Location

```
.claude/specs/
```

## Naming Convention

Use sequential numbering with a descriptive feature name.

```
001-user-authentication.md
002-product-management.md
003-shopping-cart.md
004-checkout.md
...
```

## Before Creating a Spec

1. Read all project documentation.
2. Search `.claude/specs/` for an existing specification.
3. If one exists, update it if necessary.
4. If none exists, create a new specification using the next available serial number.
5. Never overwrite or rename existing specification files.

## Every Specification Must Include

- Feature overview
- Objectives
- Functional requirements
- Non-functional requirements
- UI/UX requirements (if applicable)
- API requirements
- Database changes
- Validation rules
- Edge cases
- Acceptance criteria
- Dependencies
- Implementation checklist
- Testing checklist
- Future improvements (optional)

## Rules

- One specification file per feature/task.
- All implementation must follow its specification.
- Update the specification whenever requirements change.
- Mark completed checklist items as work progresses.
- The specification is the source of truth for that task.