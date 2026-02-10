# Contract Testing Workflow: From Local to Production

> **Stop Breaking My API**: A practical guide to preventing integration failures with Consumer-Driven Contract Testing

## Table of Contents

- [The Problem](#the-problem)
- [The Solution: Contract Testing](#the-solution-contract-testing)
- [How It Works](#how-it-works)
- [Local Development](#local-development)
- [CI/CD Integration](#cicd-integration)
- [The Complete Cycle](#the-complete-cycle)
- [Example Scenario](#example-scenario)

---

## The Problem

### The Friday Deploy Disaster

It's Friday afternoon. You're ready to deploy your new search feature to production:

```javascript
// Your frontend code
const searchTrains = async (origin, destination) => {
  const response = await fetch('/api/v1/search/trains', {
    method: 'POST',
    body: JSON.stringify({ origin, destination })
  });

  const data = await response.json();
  return data.trains; // ❌ Expecting "trains" property
};
```

✅ **Your tests pass**
✅ **Backend tests pass**
✅ **Deploy to production**

💥 **Monday morning**: Production is broken!

The backend team changed the response format over the weekend:

```json
{
  "availableTrains": [...],  // Changed from "trains" to "availableTrains"
  "totalResults": 5
}
```

**Why did this happen?**
- Both teams tested their code independently
- No one verified they agreed on the API contract
- Integration only happened in production
- No early warning system

---

## The Solution: Contract Testing

### What is a Contract?

A **contract** is a formal agreement between a consumer (frontend) and provider (backend) that defines:

- **Request format**: What the frontend sends
- **Response format**: What the frontend expects back
- **Provider states**: Preconditions needed for the interaction

Think of it as a legal contract, but for APIs.

### Consumer-Driven Contracts (CDC)

In CDC, the **consumer defines the contract**:

```
Frontend (Consumer)           Backend (Provider)
      │                             │
      │  "I need this format"       │
      ├────────────────────────────>│
      │                             │
      │      Contract File          │
      │                             │
      │   "I'll verify I can        │
      │    provide this"            │
      │<────────────────────────────┤
      │                             │
```

**Key principle**: Consumers define what they need, providers verify they can deliver it.

---

## How It Works

### The Contract Testing Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

  LOCAL DEVELOPMENT                CI/CD PIPELINE              PRODUCTION

┌──────────────────┐            ┌──────────────────┐         ┌──────────┐
│   Frontend Dev   │            │  GitHub Actions  │         │          │
│                  │            │                  │         │  Deploy  │
│ 1. Write test    │            │ 4. Run provider  │         │          │
│ 2. Generate      │──────────> │    verification  │────────>│    ✅    │
│    contract      │   Push     │                  │  Pass   │          │
│ 3. Commit & push │            │ 5. Tests run     │         │          │
└──────────────────┘            └──────────────────┘         └──────────┘
                                        │
                                        │ Fail
                                        ▼
                                ┌──────────────────┐
                                │  Backend Dev     │
                                │                  │
                                │ 6. Pull repo     │
                                │ 7. Implement API │
                                │ 8. Tests pass ✅ │
                                └──────────────────┘
```

---

## Local Development

### Step 1: Frontend Creates Contract Test

**Location**: Your local machine, `frontend-workshop/` directory

```javascript
// exercises/javascript/01-search/starter/search.pact.test.js

import { PactV3 } from '@pact-foundation/pact';

const provider = new PactV3({
  consumer: 'ticket-frontend-web',
  provider: 'ticket-api'
});

describe('Search API Contract', () => {
  test('search for trains between stations', async () => {
    // 1. Define the contract
    await provider
      .given('trains exist for route AMS to PAR')  // Provider state
      .uponReceiving('a search request')            // Interaction name
      .withRequest({
        method: 'POST',
        path: '/api/v1/search/trains',
        body: {
          origin: 'AMS',
          destination: 'PAR',
          departureDate: '2026-02-15',
          passengers: 2
        }
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          availableTrains: eachLike({
            trainId: like('uuid-1234'),
            trainNumber: like('THA9251'),
            departureTime: like('08:15'),
            arrivalTime: like('11:47'),
            price: { amount: 89.00, currency: 'EUR' }
          }),
          totalResults: like(5)
        }
      })
      .executeTest(async (mockServer) => {
        // 2. Test your actual code against the mock
        const api = new TrainSearchAPI(mockServer.url);
        const result = await api.searchTrains('AMS', 'PAR');

        // 3. Verify your code works
        expect(result.availableTrains).toBeDefined();
        expect(result.availableTrains[0].trainId).toBeDefined();
      });
  });
});
```

### Step 2: Run Test Locally

```bash
cd exercises/javascript/01-search/starter
npm install
npm test
```

**Output**:
```
✓ Search API Contract
    ✓ search for trains between stations (342ms)

Contract file written to:
  pacts/ticket-frontend-web-ticket-api.json
```

### Step 3: Check Generated Contract

The test generates a JSON contract file:

```json
{
  "consumer": { "name": "ticket-frontend-web" },
  "provider": { "name": "ticket-api" },
  "interactions": [
    {
      "description": "a search request",
      "providerStates": [
        { "name": "trains exist for route AMS to PAR" }
      ],
      "request": {
        "method": "POST",
        "path": "/api/v1/search/trains",
        "body": {
          "origin": "AMS",
          "destination": "PAR",
          "departureDate": "2026-02-15",
          "passengers": 2
        }
      },
      "response": {
        "status": 200,
        "body": {
          "availableTrains": [
            {
              "trainId": "uuid-1234",
              "trainNumber": "THA9251",
              "departureTime": "08:15",
              "arrivalTime": "11:47",
              "price": { "amount": 89.00, "currency": "EUR" }
            }
          ],
          "totalResults": 5
        }
      }
    }
  ]
}
```

This contract says: *"I expect the API to return availableTrains with these properties"*

### Step 4: Commit and Push

```bash
git add .
git commit -m "feat: Add search trains contract"
git push origin master
```

---

## CI/CD Integration

### What Happens When You Push

```
┌────────────────────────────────────────────────────────────────┐
│             GITHUB ACTIONS PIPELINE                            │
└────────────────────────────────────────────────────────────────┘

1. FRONTEND REPOSITORY (frontend-workshop)
   ├─> GitHub Actions triggered
   ├─> Runs pact tests
   ├─> Generates contract file
   └─> Pushes to ticket-contracts repository

2. CONTRACTS REPOSITORY (ticket-contracts)
   ├─> Contract file updated
   └─> Triggers webhook to backend repository

3. BACKEND REPOSITORY (ticket-api)
   ├─> GitHub Actions triggered
   ├─> Pulls contract from ticket-contracts
   ├─> Runs provider verification tests
   └─> ✅ PASS or ❌ FAIL
```

### Pipeline Configuration

#### Frontend Workflow

**File**: `.github/workflows/contract-publish.yml`

```yaml
name: Publish Workshop Contracts

on:
  workflow_dispatch:  # Manual trigger

jobs:
  publish-contracts:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Frontend
        uses: actions/checkout@v4

      - name: Run Pact Tests
        run: |
          cd exercises/javascript/01-search/starter
          npm install
          npm test

      - name: Checkout Contracts Repository
        uses: actions/checkout@v4
        with:
          repository: conso/ticket-contracts
          path: contracts

      - name: Copy Generated Contract
        run: |
          cp pacts/ticket-frontend-web-ticket-api.json \
             contracts/pacts/web/ticket-api-frontend-workshop-contracts.json

      - name: Push to Contracts Repo
        run: |
          cd contracts
          git add pacts/web/
          git commit -m "chore: Update contract from frontend"
          git push

      - name: Trigger Backend Verification
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.GITHUB_TOKEN }}" \
            https://api.github.com/repos/conso/ticket-api/dispatches \
            -d '{"event_type": "contract-updated", "client_payload": {"workshop": "true"}}'
```

#### Backend Workflow

**File**: `.github/workflows/contract-verify.yml`

```yaml
name: Contract Verification

on:
  repository_dispatch:
    types: [contract-updated]

jobs:
  verify-contracts:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Backend
        uses: actions/checkout@v4

      - name: Checkout Contracts
        uses: actions/checkout@v4
        with:
          repository: conso/ticket-contracts
          path: contracts

      - name: Copy Workshop Contract
        run: |
          mkdir -p src/test/resources/pacts
          cp contracts/pacts/web/ticket-api-frontend-workshop-contracts.json \
             src/test/resources/pacts/

      - name: Run Provider Verification
        run: mvn test -Dtest=PactProviderVerificationTest

      - name: Run Full Test Suite
        run: mvn test
```

---

## The Complete Cycle

### Scenario 1: Happy Path ✅

```
┌─────────────────────────────────────────────────────────────┐
│  1. Frontend dev writes contract test locally               │
│     └─> Expects: { availableTrains: [...] }                │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ git push
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. CI/CD runs frontend tests                               │
│     └─> ✅ Tests pass, contract generated                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ push to ticket-contracts
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Contract published to central repository                │
│     └─> ticket-api-frontend-workshop-contracts.json        │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ triggers backend
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Backend CI/CD runs provider verification                │
│     └─> ✅ API matches contract expectations                │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ all green
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Both teams can deploy safely                            │
│     └─> 🚀 Production deployment approved                   │
└─────────────────────────────────────────────────────────────┘
```

### Scenario 2: Contract Failure ❌ → Fix → Success ✅

```
┌─────────────────────────────────────────────────────────────┐
│  1. Frontend pushes contract expecting "availableTrains"   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Backend verification FAILS                              │
│     ❌ Error: Provider response has "trains" not            │
│        "availableTrains"                                    │
│                                                             │
│     Expected: { availableTrains: [...] }                   │
│     Actual:   { trains: [...] }          ← Mismatch!       │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ notification sent
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Backend dev receives notification                       │
│     └─> Pulls latest code                                  │
│     └─> Checks contract file                               │
│     └─> Sees frontend expects "availableTrains"            │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ implements change
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Backend dev updates API                                 │
│                                                             │
│     @GetMapping("/search/trains")                          │
│     public SearchResponse searchTrains() {                 │
│         return SearchResponse.builder()                    │
│             .availableTrains(trains)  // Fixed!            │
│             .totalResults(count)                           │
│             .build();                                      │
│     }                                                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ git push
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Backend CI/CD re-runs verification                      │
│     └─> ✅ Tests now pass!                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ success
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Both teams deploy                                       │
│     └─> 🚀 No production failures!                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Example Scenario

### The Breaking Change Exercise

Let's walk through a real example from the workshop:

#### Initial State

**Frontend Contract** (Exercise 01):
```javascript
.willRespondWith({
  body: {
    availableTrains: eachLike({
      price: like('89.00 EUR')  // String format
    })
  }
})
```

**Backend API** (currently returns):
```json
{
  "availableTrains": [
    { "price": "89.00 EUR" }  // ✅ Matches contract
  ]
}
```

**Result**: ✅ Contract verification passes

---

#### Backend Team Improves API

Backend team decides to improve the price format for better international support:

```java
// New improved structure
public class Price {
    private BigDecimal amount;
    private String currency;
}
```

```json
{
  "availableTrains": [
    {
      "price": {
        "amount": 89.00,    // Now an object!
        "currency": "EUR"
      }
    }
  ]
}
```

They push to `master` branch. Tests run...

**Result**: ❌ **Contract verification FAILS!**

```
Contract Verification Failed:

Expected:
  price: "89.00 EUR"

Actual:
  price: { amount: 89.00, currency: "EUR" }

Type mismatch: Expected String, got Object
```

---

#### Frontend Team Gets Notified

Frontend team sees the failure in CI/CD. They have two options:

**Option 1: Backend Reverts** (if change was unintentional)
```bash
# Backend reverts to old format
git revert HEAD
git push
# ✅ Contracts pass again
```

**Option 2: Frontend Adapts** (if change is beneficial)

Frontend updates contract and code:

```javascript
// Updated contract
.willRespondWith({
  body: {
    availableTrains: eachLike({
      price: {
        amount: like(89.00),
        currency: like('EUR')
      }
    })
  }
})

// Updated frontend code
const formatPrice = (price) => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: price.currency
  }).format(price.amount);
};
```

**Both teams coordinate the change:**
1. Frontend pushes updated contract (to feature branch)
2. Backend verifies against new contract
3. Both teams merge to master simultaneously
4. Deploy together

**Result**: ✅ Coordinated breaking change, no production issues!

---

## Key Benefits

### 1. **Early Detection**
Catch integration issues in CI/CD, not production.

### 2. **Independent Development**
Teams work in parallel without constant integration meetings.

### 3. **Living Documentation**
Contracts serve as up-to-date API documentation.

### 4. **Confidence in Deployment**
Know before you deploy if integration will work.

### 5. **Faster Feedback**
Contract tests run in seconds, not hours like E2E tests.

---

## Common Questions

### Q: When should I write contract tests?

**Write contract tests when:**
- ✅ Different teams own frontend and backend
- ✅ You want fast feedback on API changes
- ✅ You need to work independently
- ✅ API changes frequently

**Don't write contract tests when:**
- ❌ Same team owns both frontend and backend
- ❌ API is external/third-party (you can't verify it)
- ❌ API is very stable and never changes

### Q: Do contract tests replace integration tests?

**No!** They complement each other:

```
Contract Tests          Integration Tests
     │                         │
     │ ✅ Fast                  │ ✅ Complete
     │ ✅ Independent           │ ✅ Real environment
     │ ✅ API agreement         │ ✅ Business logic
     │ ❌ Not full e2e          │ ❌ Slow
     │ ❌ Mocked data           │ ❌ Flaky
     └─────────────────────────┘
           Both needed!
```

### Q: How often should contracts be verified?

**Frontend**: Every push (tests run locally and in CI/CD)
**Backend**: Every push + whenever contracts are updated

---

## Next Steps

1. **Complete the exercises** in this workshop
2. **Try the breaking change exercise** (Exercise 03)
3. **Set up contract testing** in your real projects
4. **Share with your team** the benefits you've learned

Remember: **Contracts prevent production fires** 🔥

---

## Resources

- [Pact Documentation](https://docs.pact.io/)
- [Martin Fowler on CDC](https://martinfowler.com/articles/consumerDrivenContracts.html)
- [Workshop Exercises](exercises/javascript/)
- [API Reference](api-reference/endpoints-cheatsheet.md)

---

**Happy contracting!** 🎫
