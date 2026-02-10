# Login Contract Reference

This is a **pre-implemented example** - not an exercise. Study this code to understand how Pact contract tests work before writing your own.

## What This Code Does

This contract test defines what our frontend expects when calling the login endpoint:

| Aspect | Value |
|--------|-------|
| **Endpoint** | `POST /api/v1/auth/login` |
| **Request** | Email and password |
| **Response** | userId, accessToken, refreshToken, expiresIn |

## Run It

```bash
npm install
npm test
```

## Examine the Generated Contract

After running the test, look at the generated contract:

```bash
cat pacts/ticket-frontend-web-ticket-api.json
```

## Code Walkthrough

### 1. Provider Definition

```javascript
const provider = new PactV3({
  consumer: 'ticket-frontend-web',  // Our app name
  provider: 'ticket-api',            // The API we consume
});
```

### 2. Provider State

```javascript
provider.given('an existing user with email test@example.com and password Password123!');
```

This tells the provider what test data to set up. The provider has a handler that matches this exact string.

### 3. Request Definition

```javascript
.withRequest({
  method: 'POST',
  path: '/api/v1/auth/login',
  headers: { 'Content-Type': 'application/json' },
  body: { email: '...', password: '...' }
})
```

This defines exactly what our frontend will send.

### 4. Response Matching

```javascript
.willRespondWith({
  status: 200,
  body: {
    userId: like('uuid-here'),      // Match by TYPE, not value
    accessToken: like('jwt-here'),
    expiresIn: integer(3600)        // Must be an integer
  }
})
```

**Key concept**: `like()` means "match any value of this type". The value provided is just an example.

### 5. Test Execution

```javascript
await provider.executeTest(async (mockServer) => {
  const response = await axios.post(`${mockServer.url}/api/v1/auth/login`, ...);
  expect(response.status).toBe(200);
});
```

This runs our API call against a mock server and generates the contract.

## Key Takeaways

1. **Consumer defines the contract** - We specify what we need
2. **Matchers define shape, not exact values** - `like()` matches type
3. **Provider state sets up test data** - Exact string matching
4. **Contract is generated automatically** - JSON file in `pacts/`

## Next Step

Now that you understand how it works, proceed to **Exercise 1: Search** to write your own contract!
