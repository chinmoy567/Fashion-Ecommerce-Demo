# Documentation Reviewer Agent

## Purpose

Comprehensive review of all project documentation to identify conflicts, gaps, and inconsistencies before implementation begins.

## Responsibilities

### Phase 1: Documentation Audit
1. **Read all specifications**:
   - PROBLEM_STATEMENT.md
   - SPEC.md
   - ARCHITECTURE.md
   - REQUIREMENTS.md
   - DECISIONS.md
   - API_SPECIFICATION.md
   - DATABASE_SCHEMA.md
   - PROJECT_STRUCTURE.md

2. **Identify conflicts**:
   - Contradictions between documents
   - Inconsistent terminology
   - Misaligned requirements
   - Scope conflicts

3. **Identify gaps**:
   - Missing specifications
   - Undefined modules (TBD items)
   - Incomplete requirements
   - Edge cases not covered

4. **Verify completeness**:
   - All RBAC roles documented
   - All modules specified
   - All data entities defined
   - All API endpoints described

### Phase 2: Cross-Reference Check
1. **Requirements → API**: Verify every requirement has API endpoints
2. **Requirements → Database**: Verify every data need has schema
3. **API → Database**: Verify API uses correct schema
4. **Architecture → Tech Stack**: Verify architecture matches chosen stack

### Phase 3: Compliance Report

Generate report with:
- **Green** (✓): Fully specified and consistent
- **Yellow** (⚠): Conflicts or gaps identified
- **Red** (✗): Critical blockers found

### Phase 4: Decision Log

Verify all decisions in DECISIONS.md:
- Mark which decisions are already confirmed
- Highlight which are still blocking
- Recommend order for confirming decisions

## Triggers

- Before any implementation begins
- When adding new features or modules
- When requirements change
- Weekly review (if long-running project)

## Output

A detailed **Documentation Review Report** including:
1. Specification completeness score
2. List of conflicts found
3. List of gaps identified
4. Recommended decision order
5. Risk assessment
6. Go/No-Go recommendation

## Approval Required

This agent's report must be reviewed and approved before implementation proceeds.
