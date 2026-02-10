# Cypress + Mocked API

Use contracts to drive frontend testing with Cypress.

## The Concept

Your Pact contracts define what the API returns. Why not use those same expectations to mock the API in frontend tests?

```
                    Pact Contract
                         |
          +--------------+--------------+
          |                             |
          v                             v
   Provider Verification         Frontend Mocking
   (Backend CI)                  (Cypress tests)
```

**Single source of truth** - the contract drives both backend verification AND frontend testing.

## Learning Goals

- Use `cy.intercept()` to mock API responses
- Base mock responses on contract expectations
- See how contracts enable reliable frontend testing

## How It Works

### 1. Contract Defines Expected Response

From your search contract, you know the expected response structure.

### 2. Cypress Uses Same Structure for Mocking

Use `cy.intercept()` to mock the API endpoint with a response that matches your contract.

### 3. Test the UI

Write assertions to verify the UI displays the mocked data correctly.

## Your Task

Complete the Cypress test in `cypress/e2e/search.cy.js`:

1. Set up the `cy.intercept()` mock based on your contract
2. Visit the search page
3. Fill in search criteria
4. Verify the UI displays the mocked response

## Files

```
04-cypress-mock/
├── starter/
│   ├── package.json
│   ├── README.md
│   ├── cypress.config.js
│   └── cypress/
│       └── e2e/
│           └── search.cy.js    # Complete this!
└── solution/
    └── ...
```

## Why This Matters

| Without Contracts | With Contracts |
|-------------------|----------------|
| Mock responses invented by frontend devs | Mock responses match real API |
| Mocks drift from reality | Mocks stay aligned |
| Tests pass but production fails | Tests reflect actual behavior |
| Separate "test API" documentation | Contract IS the documentation |

## Advanced: Pact Mock Server

For even tighter integration, you can use Pact's mock server directly. This ensures your frontend tests use the EXACT same responses that the backend must provide.
