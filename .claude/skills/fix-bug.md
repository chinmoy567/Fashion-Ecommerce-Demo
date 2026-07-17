# fix-bug Skill

## Description

Systematic debugging and fixing of reported issues.

## Usage

```
/fix-bug <bug-description>
```

**Examples**:
```
/fix-bug "Cart total calculates incorrectly when coupon applied"
/fix-bug "Admin cannot update product images"
/fix-bug "Order tracking page not loading courier info"
```

## Workflow

### 1. Problem Understanding
- Read bug description
- Understand expected behavior
- Understand actual behavior
- Ask for clarification if needed

### 2. Root Cause Analysis
- Reproduce the bug locally
- Check error logs
- Trace through the code
- Identify root cause

### 3. Risk Assessment
- Check what other code depends on this
- Identify potential side effects
- Plan for regression testing

### 4. Fix Strategy
- Design minimal fix (not workaround)
- Consider edge cases
- Prepare test cases

### 5. Implementation
- Apply fix to code
- No refactoring beyond bug fix
- Keep changes minimal and focused

### 6. Testing
- Verify bug is fixed
- Test related functionality
- Test edge cases
- Run regression tests

### 7. Code Review
- Self-review for quality
- Check for new issues introduced
- Verify fix is correct

### 8. Commit
- Commit with clear message referencing bug
- Link to issue tracker

## Approved Fixes

This skill will fix:
- Logic errors
- API response issues
- UI rendering issues
- Database query problems
- Validation issues
- Error handling
- Performance issues

This skill will **NOT**:
- Implement new features
- Refactor unrelated code
- Update dependencies
- Change architecture

If the "bug" is really a feature request or refactoring need, the skill will stop and clarify.

## Output

1. **Root Cause Analysis** (what was wrong)
2. **Fix Explanation** (what was changed)
3. **Test Results** (before and after)
4. **Related Risks** (if any)
5. **Regression Tests** (to prevent recurrence)

## Example

```
User: /fix-bug "Cart total shows wrong amount when coupon applied"

Skill:
1. Reproduces bug: 
   - Add products to cart (total: $100)
   - Apply 10% coupon (should be $90)
   - Actual total: $100 (coupon not applied)

2. Traces code:
   - frontend: cart.js line 45 not recalculating on coupon apply
   - backend: payment calculation correct

3. Root cause: 
   - Frontend not triggering recalculation when coupon changes
   - Redux state not updating

4. Fix:
   - Add effect hook to recalculate when coupon changes
   - Add action to update cart total in Redux

5. Tests:
   - Verify 10% coupon gives $90 ✓
   - Verify 20% coupon gives $80 ✓
   - Verify removing coupon reverts to $100 ✓
   - Edge case: coupon exceeding total ✓

6. Commit message:
   "fix(cart): recalculate total when coupon applied"
```

## Quality Standards

Fixes must:
- ✓ Actually solve the problem
- ✓ Not introduce new bugs
- ✓ Be minimal and focused
- ✓ Have clear explanation
- ✓ Include regression tests
- ✓ Pass code review

## Related

- Code Review: Run `/code-review` on the fix
- API Testing: Run `/api-test` if API affected
- Documentation: Update README if behavior changed

## Tips

1. **Reproduce first**: Always reproduce the bug before fixing
2. **Understand the cause**: Don't just patch the symptom
3. **Test edge cases**: Fix edge cases too, not just the reported case
4. **Check for duplication**: See if this bug exists elsewhere
5. **Document**: Explain why the bug happened in commit message

## Notes

- This skill is conservative: it fixes the bug, not more
- It documents what was wrong so it doesn't happen again
- It ensures the fix doesn't break other things
- It's faster than `/create-feature` because scope is narrow
