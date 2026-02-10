# Exercise 2: Ticket Booking Contract

Create a contract for the booking endpoint - the next step in the user journey.

## Team Exercise (20 minutes)

Work together as a team to complete this exercise:

1. **Quick recap** (1 min): What did you learn from Exercise 1? New driver takes over
2. **Discuss the difference**: This endpoint has an Authorization header - discuss why
3. **One driver**: Designate one person to type while others navigate
4. **Rotate**: Switch drivers after each TODO is completed
5. **Call instructor**: If stuck for more than 5 minutes, raise your hand

**Success = everyone on the team can explain the code when done!**

---

## Learning Goals

- Handle authentication headers in contracts
- Create business entities via API
- Use nested objects in response matching

## The Endpoint

| Aspect | Value |
|--------|-------|
| **Method** | POST |
| **Path** | `/api/v1/bookings/reservations` |
| **Auth** | Bearer token required |

## Request Body

```json
{
  "trainId": "660e8400-e29b-41d4-a716-446655440001",
  "journeyDate": "2026-02-15",
  "originStation": "AMS",
  "destinationStation": "RTD",
  "coachClass": "ECONOMY",
  "passengers": [
    {
      "firstName": "Marco",
      "lastName": "Rossi",
      "age": 30,
      "gender": "MALE",
      "seatPreference": "WINDOW"
    }
  ]
}
```

## Expected Response

```json
{
  "reservationId": "RES-12345678",
  "userId": "USR-87654321",
  "trainId": "660e8400-e29b-41d4-a716-446655440001",
  "originStation": "AMS",
  "destinationStation": "RTD",
  "status": "ACTIVE",
  "passengers": [
    {
      "firstName": "Marco",
      "lastName": "Rossi",
      "seatNumber": "12A"
    }
  ],
  "totalAmount": 15.50
}
```

## New Concept: Authorization Header

This endpoint requires authentication. Use `like()` for the Authorization header to match the pattern without requiring exact values.

## Instructions

1. Open `booking.pact.test.js`
2. Complete **TODO 1**: Define the provider state (user is authenticated, train exists)
3. Complete **TODO 2**: Define the request with Authorization header
4. Complete **TODO 3**: Define the response with nested objects
5. Run `npm test` to verify

## Verify Your Solution

```bash
npm test
```

## Next Exercise

Proceed to **Exercise 3: Breaking Change & Versioning** - experience why contracts matter!
