# Exercise 3: Breaking Change & Versioning

It's Monday morning. You run the tests and... they fail. The backend team deployed over the weekend. What happened?

## Team Exercise (20 minutes)

Work together as a team to diagnose and fix this issue:

1. **Run the test** (2 min): See it pass locally, then read the comments
2. **Understand the scenario** (3 min): What would happen during provider verification?
3. **Discuss** (5 min): How would contracts catch this before production?
4. **Fix it** (10 min): Migrate the contract to use `/api/v2/`

**Success = your tests pass AND you can explain why versioning matters!**

---

## Learning Goals

- Experience a breaking change scenario
- Understand breaking vs non-breaking changes
- Migrate contracts to new API versions

## The Scenario

The backend team decided to "improve" the search API by making the price format more structured:

**OLD (v1) - What your contract expects:**
```json
{
  "price": "89.00 EUR"
}
```

**NEW (v2) - What the backend now returns:**
```json
{
  "price": {
    "amount": 89.00,
    "currency": "EUR"
  }
}
```

Your frontend code does: `<span>{train.price}</span>`

But now `train.price` is an OBJECT, so it displays `[object Object]`!

## Step 1: Run the Test

```bash
npm install
npm test
```

The test passes locally (Pact generates what you expect). But imagine what happens when the **provider runs verification** against this contract with their new response format...

## Step 2: Understand the Problem

Read the comments in `search-v1.pact.test.js`. The contract expects a string, but the provider now returns an object.

**Discussion question**: What would happen if you didn't have contract tests?

## Step 3: The Solution - API Versioning

The backend team kept the old format available and created a new version:

- `/api/v1/search/trains` - OLD format: `"price": "89.00 EUR"` (for backwards compatibility)
- `/api/v2/search/trains` - NEW format: `"price": { "amount": 89.00, "currency": "EUR" }`

## Step 4: Fix the Contract

Open `search-v1.pact.test.js` and migrate to v2:

1. Update the endpoint path
2. Update the price expectation to match the new object format
3. Update your test assertions accordingly
4. Make sure to import the `decimal` matcher

## Step 5: Verify the Fix

```bash
npm test
```

Your tests should now pass with the v2 contract!

## Debrief Discussion

- "What if we didn't have contracts?"
- "How does versioning help both teams?"
- "Why is the new format better?"

## Key Takeaway

**Contracts catch breaking changes BEFORE production.**
