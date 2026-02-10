# Exercise 1: Search Trains Contract

Your first hands-on exercise! Create a contract for the train search endpoint.

## Team Exercise (20 minutes)

Work together as a team to complete this exercise:

1. **Discuss first** (2 min): Before coding, discuss with your team what the contract should look like
2. **One driver**: Designate one person to type while others navigate
3. **Rotate**: Switch drivers after each TODO is completed
4. **Call instructor**: If stuck for more than 5 minutes, raise your hand

**Success = everyone on the team can explain the code when done!**

---

## Learning Goals

- Write your first contract from scratch
- Use `eachLike()` for array responses
- Handle complex nested objects

## The Endpoint

| Aspect | Value |
|--------|-------|
| **Method** | POST |
| **Path** | `/api/v1/search/trains` |
| **Content-Type** | application/json |

## Request Body

```json
{
  "originStation": "AMS",
  "destinationStation": "RTD",
  "departureDate": "2026-02-15",
  "passengerCount": 2,
  "classType": "ECONOMY"
}
```

## Expected Response

```json
{
  "searchId": "550e8400-e29b-41d4-a716-446655440000",
  "totalResults": 3,
  "availableTrains": [
    {
      "trainId": "660e8400-e29b-41d4-a716-446655440001",
      "trainNumber": "9251",
      "trainName": "Intercity Direct",
      "departureTime": "08:15",
      "arrivalTime": "08:55",
      "price": "15.50 EUR"
    }
  ]
}
```

## Instructions

1. Open `search.pact.test.js`
2. Complete **TODO 1**: Define the provider state
3. Complete **TODO 2**: Define the request and response
4. Complete **TODO 3**: Execute the test
5. Run `npm test` to verify

## New Concept: `eachLike()`

For arrays, use `eachLike()` instead of `like()`. This matches an array where EACH element matches the example structure.

## Verify Your Solution

```bash
npm test
```

Then check the generated contract:

```bash
cat pacts/ticket-frontend-web-ticket-api.json
```

You should see a new interaction for the search endpoint!

## Next Exercise

Once your test passes, proceed to **Exercise 2: Ticket Booking**.
