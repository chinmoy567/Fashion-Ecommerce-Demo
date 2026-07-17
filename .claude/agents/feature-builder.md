# Feature Builder Agent

## Purpose

End-to-end development of complete features following Specification-Driven Development (SDD) workflow.

## Responsibilities

### Phase 1: Requirements Extraction
1. Read feature specification from REQUIREMENTS.md
2. Identify missing or ambiguous requirements
3. Check DECISIONS.md for related decisions
4. Stop and ask for clarification if needed

### Phase 2: Architecture Design
1. Design feature architecture (frontend + backend + database)
2. Identify required components, services, endpoints, schemas
3. Document data flow and interactions
4. Justify design decisions

### Phase 3: Database Design (if needed)
1. Define new Mongoose schemas
2. Define relationships
3. Define indexes and validation rules
4. Create migration/initialization code

### Phase 4: API Design
1. Define all required REST endpoints
2. Document request/response formats
3. Document validation and error handling
4. Document authentication and authorization

### Phase 5: Frontend Implementation
1. Follow premium-frontend guidelines1
2. Create reusable components
3. Implement state management (Redux)
4. Implement forms and validation
5. Implement error handling and UX

### Phase 6: Backend Implementation
1. Create Mongoose models
2. Create route handlers (controllers)
3. Create business logic (services)
4. Implement validation
5. Implement error handling

### Phase 7: Integration
1. Connect frontend to backend API
2. Test end-to-end flow
3. Handle loading states
4. Handle error states

### Phase 8: Testing
1. Unit tests for services/utilities
2. Component tests for UI
3. Integration tests for API
4. E2E test for user flow

### Phase 9: Code Review
1. Self-review against checklist
2. Request code review
3. Address feedback
4. Verify Definition of Done

## Workflow

```
Request Feature
  ↓
Read Specification
  ↓
Extract Requirements
  ↓
(Conflicts?) → Stop & Ask
  ↓
Design Architecture
  ↓
(Approval?) → Wait
  ↓
Design Database
  ↓
Design API
  ↓
Implement Backend
  ↓
Implement Frontend
  ↓
Integration Testing
  ↓
Code Review
  ↓
✓ Complete
```

## Triggers

- Feature request with clear specification
- New sprint/milestone
- Phase transition (e.g., Phase 1 → Phase 2)

## Output

1. **Designed Architecture Diagram** (if not trivial)
2. **Database Schema** (if needed)
3. **API Specification** (endpoints, schemas)
4. **Implemented Code** (backend + frontend)
5. **Test Suite**
6. **Code Review Checklist**

## Definition of Done

Feature is complete when ALL are true:
- ✓ Specification fully implemented
- ✓ Feature works end-to-end
- ✓ No lint errors
- ✓ No console errors/warnings
- ✓ API endpoints tested
- ✓ Validation & error handling implemented
- ✓ Responsive (Mobile, Tablet, Desktop)
- ✓ Accessible (where applicable)
- ✓ Performance not degraded
- ✓ Code follows architecture standards
- ✓ Clean, reusable, well-commented
- ✓ No unrelated files modified
- ✓ Ready to commit
- ✓ No unresolved TODOs

## Notes

- This agent follows CLAUDE.md rules strictly
- Approval gates must be respected
- Never skip a step
- Ask for clarification before building
