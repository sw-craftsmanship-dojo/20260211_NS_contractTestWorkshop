# Contract Verification Failure Example

This is what the backend team sees when they try to deploy a breaking change:

```
================================================================================
                         PACT VERIFICATION FAILED
================================================================================

Verifying a pact between ticket-frontend-web and ticket-api

  Given trains exist for route AMS to PAR on 2026-02-15
    a search request for trains from AMS to PAR

      returns a response which
        has status code 200
        has a matching body (FAILED)

      Diff:

      {
        "searchId": "550e8400-e29b-41d4-a716-446655440000",
        "totalResults": 3,
        "availableTrains": [
          {
            "trainId": "660e8400-e29b-41d4-a716-446655440001",
            "trainNumber": "THA9251",
            "departureTime": "08:15",
            "arrivalTime": "11:47",
      -     "price": {
      -       "amount": 89.00,
      -       "currency": "EUR"
      -     }
      +     "price": "89.00 EUR"
          }
        ]
      }

================================================================================
                              FAILURE DETAILS
================================================================================

1) Verifying a pact between ticket-frontend-web and ticket-api
   Given trains exist for route AMS to PAR on 2026-02-15
   a search request for trains from AMS to PAR
     returns a response which
       has a matching body

   Failure/Error:
     Expected body to have nested object at "$.availableTrains[0].price"
     but got String "89.00 EUR"

     Expected: {"amount": Decimal, "currency": String}
     Got: "89.00 EUR"

================================================================================
                           WHAT DOES THIS MEAN?
================================================================================

The consumer (ticket-frontend-web) expects:

    response.data.availableTrains[0].price.amount  // 89.00
    response.data.availableTrains[0].price.currency // "EUR"

But the provider (ticket-api) now returns:

    response.data.availableTrains[0].price  // "89.00 EUR"

This would break the frontend code that does:

    const price = train.price.amount;  // TypeError: Cannot read property 'amount' of string

================================================================================
                              RESOLUTION OPTIONS
================================================================================

Option 1: REVERT THE CHANGE
   - Keep the original price object format
   - No consumer changes needed

Option 2: VERSION THE API
   - Keep /api/v1/search/trains with original format
   - Create /api/v2/search/trains with new format
   - Consumers migrate when ready
   - Update contracts for v2 endpoint

Option 3: NEGOTIATE WITH CONSUMER
   - Discuss if the new format is actually better
   - Agree on migration timeline
   - Consumer updates their contract first
   - Then provider deploys the change

================================================================================
                              CI/CD STATUS
================================================================================

Pipeline: BLOCKED
Commit: a1b2c3d4
Author: backend-dev@company.com
Branch: feature/simplify-price-format

This commit CANNOT be merged until contract verification passes.

Contact the ticket-frontend-web team to coordinate the change.

================================================================================
```

## Why This Matters

Without contract testing, this change would have:

1. Passed all backend unit tests ✅
2. Passed all backend integration tests ✅
3. Been merged to main ✅
4. Deployed to production ✅
5. **BROKEN THE FRONTEND** ❌
6. Caused a production incident 🔥
7. Required a hotfix deployment 🚒

With contract testing:

1. Backend unit tests pass ✅
2. Backend integration tests pass ✅
3. **Contract verification FAILS** ❌
4. Change is BLOCKED from merging 🛑
5. Teams discuss and plan migration 💬
6. Change is deployed safely ✅

## The Conversation This Triggers

```
Backend Dev: "Hey frontend team, I want to simplify the price format."

Frontend Dev: "We're using price.amount in 15 places. Can you version the API?"

Backend Dev: "Sure, I'll add it to /api/v2/. When can you migrate?"

Frontend Dev: "Next sprint. We'll update our contract then."

Backend Dev: "Perfect. I'll deploy v2 now, you migrate when ready."
```

**This is the value of Consumer-Driven Contracts.**
