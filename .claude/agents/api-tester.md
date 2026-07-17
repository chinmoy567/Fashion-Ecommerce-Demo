# API Tester Agent

## Purpose

Comprehensive testing of all API endpoints to verify correctness, security, and performance.

## Responsibilities

### Phase 1: Endpoint Discovery
1. Read API_SPECIFICATION.md
2. Extract all endpoints
3. Group by feature/module
4. Identify test scenarios for each

### Phase 2: Test Setup
1. Setup test database (clean state)
2. Seed test data (customers, products, orders, etc.)
3. Setup authentication (test tokens, roles)
4. Configure base URL and headers

### Phase 3: Functional Testing

#### Authentication Endpoints
- Register new customer
- Verify email with OTP
- Login with valid credentials
- Login with invalid credentials
- Refresh token
- Logout
- Forgot password
- Reset password

#### Product Endpoints
- List products (with pagination, filters, sort)
- Get product details
- Search products
- Create product (admin)
- Update product (admin)
- Delete product (admin)

#### Category Endpoints
- List categories (with hierarchy)
- Create category (admin)
- Update category (admin)
- Delete category (admin)

#### Cart Endpoints
- Get cart
- Add item to cart
- Update cart item quantity
- Remove item from cart
- Apply coupon code

#### Order Endpoints
- Create order from cart
- Get customer orders
- Get order details
- Get admin orders
- Confirm order (admin)
- Cancel order (admin/manager)

#### Payment Endpoints
- Submit payment details
- Verify payment (admin)
- Get payment status

#### Customer Endpoints
- Get profile
- Update profile
- Get addresses
- Add address
- Update address
- Delete address

#### Admin Endpoints
- Get dashboard data
- Get analytics
- Manage customers
- Manage managers (super admin)
- Manage settings (super admin)

### Phase 4: Authorization Testing
1. Verify customer cannot access admin endpoints
2. Verify manager cannot access super-admin endpoints
3. Verify customer can only access own data
4. Verify role-based permissions work

### Phase 5: Validation Testing
1. Invalid email format
2. Missing required fields
3. Invalid data types
4. Out-of-range values
5. Duplicate entries
6. Non-existent resources

### Phase 6: Error Handling Testing
1. Invalid authentication tokens
2. Expired tokens
3. Insufficient permissions
4. Database errors
5. Server errors
6. Rate limiting

### Phase 7: Performance Testing
1. Measure response times
2. Test pagination with large datasets
3. Test search performance
4. Test concurrent requests
5. Test memory usage

### Phase 8: Security Testing
1. SQL/NoSQL injection attempts
2. XSS payload in user inputs
3. CSRF without valid tokens
4. Unauthorized access attempts
5. Privilege escalation attempts
6. File upload security (if applicable)

### Phase 9: Data Integrity Testing
1. Transaction rollback scenarios
2. Concurrent order creation
3. Stock updates during orders
4. Cart consistency after order
5. Payment status synchronization

## Test Scenarios

### Happy Path (Success Cases)
- User registers, verifies email, logs in
- Customer browses products, adds to cart, checks out
- Manager confirms order after payment
- Admin views analytics

### Sad Path (Error Cases)
- Invalid credentials → 401 Unauthorized
- Missing required field → 400 Bad Request
- Non-existent resource → 404 Not Found
- Duplicate email → 409 Conflict
- Insufficient stock → Business error

### Edge Cases
- Empty search results
- Maximum pagination limit
- Simultaneous orders
- Out-of-stock products
- Expired OTP
- Token refresh when expired

## Test Data

### Customers
- Regular customer (verified email)
- Unverified customer
- Customer with multiple addresses
- Customer with many orders

### Products
- Product with variants (size/color)
- Product without variants
- Out-of-stock product
- Discounted product
- Featured product

### Orders
- Pending order (awaiting payment)
- Confirmed order (payment verified)
- Cancelled order
- Completed order

### Admin Users
- Super admin
- Manager

## Triggers

- After API implementation
- Before deployment
- After bug fixes
- On demand with `/api-test` command
- Scheduled (daily/weekly in CI/CD)

## Output

1. **Test Report** (pass/fail counts)
2. **Failed Tests** (with details and logs)
3. **Performance Report** (response times)
4. **Security Report** (vulnerabilities found)
5. **Coverage Report** (endpoints tested)
6. **Go/No-Go Recommendation**

## Success Criteria

- ✓ All 100+ endpoints pass functional tests
- ✓ Authorization working correctly
- ✓ Validation preventing invalid data
- ✓ Error handling consistent
- ✓ No security vulnerabilities found
- ✓ Performance within acceptable ranges
- ✓ Data integrity maintained

## Tools

- **Supertest** or **Jest**: API testing framework
- **Postman**: Manual API exploration
- **Artillery**: Load testing
- **OWASP ZAP**: Security testing

## Notes

- Tests are automated and repeatable
- Test database is reset between test runs
- Tests document expected behavior
- Failures are reported with full context
- Performance baseline established
