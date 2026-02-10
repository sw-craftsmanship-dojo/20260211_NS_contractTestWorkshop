# Train Booking API - Endpoints Cheat Sheet

Quick reference for the API endpoints used in this workshop.

---

## Authentication Endpoints

### Register User
```
POST /api/v1/auth/register
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+31612345678"
}
```

**Response (201 Created):**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+31612345678",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

---

### Login
```
POST /api/v1/auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

---

### Refresh Token
```
POST /api/v1/auth/refresh
```

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

---

## Search Endpoints

### Search Trains
```
POST /api/v1/search/trains
```

**Request:**
```json
{
  "originStation": "AMS",
  "destinationStation": "RTD",
  "departureDate": "2026-12-25",
  "passengerCount": 2,
  "classType": "ECONOMY"
}
```

**Response (200 OK):**
```json
{
  "searchId": "660e8400-e29b-41d4-a716-446655440001",
  "totalResults": 2,
  "message": "2 train(s) found",
  "availableTrains": [
    {
      "trainId": "770e8400-e29b-41d4-a716-446655440002",
      "trainNumber": "9251",
      "trainName": "Intercity Direct",
      "originStationCode": "AMS",
      "originStationName": "Amsterdam Centraal",
      "destinationStationCode": "RTD",
      "destinationStationName": "Rotterdam Centraal",
      "departureTime": "08:15",
      "arrivalTime": "08:55",
      "durationMinutes": 40,
      "availableClasses": [
        {
          "classType": "ECONOMY",
          "coachType": "IC2",
          "availableSeats": 50,
          "fare": 15.50
        },
        {
          "classType": "FIRST_CLASS",
          "coachType": "IC1",
          "availableSeats": 20,
          "fare": 25.00
        }
      ]
    }
  ]
}
```

---

## Common Station Codes

| Code | City |
|------|------|
| AMS | Amsterdam Centraal |
| RTD | Rotterdam Centraal |
| UT | Utrecht Centraal |
| EHV | Eindhoven |
| AH | Arnhem |
| DH | Den Haag |

---

## Class Types

| Type | Description |
|------|-------------|
| ECONOMY | Standard seating |
| FIRST_CLASS | Premium seating with more space |
| BUSINESS | Business class with amenities |

---

## Pact Matchers Quick Reference

| Matcher | Use Case | Example |
|---------|----------|---------|
| `like(value)` | Match by type | `like('hello')` - any string |
| `integer(value)` | Match integers | `integer(42)` - any integer |
| `decimal(value)` | Match decimals | `decimal(15.50)` - any decimal |
| `uuid()` | Match UUID pattern | Matches `550e8400-e29b-41d4-a716-446655440000` |
| `eachLike(obj)` | Match array elements | `eachLike({id: like(1)})` - array of objects |
| `regex(pattern, example)` | Match regex | `regex(/^\d{4}$/, '1234')` |

---

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, POST |
| 201 | Created | Successful resource creation |
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Invalid credentials / Missing token |
| 403 | Forbidden | Valid token but no permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected server failure |

---

## cURL Examples

### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

### Search Trains
```bash
curl -X POST http://localhost:8080/api/v1/search/trains \
  -H "Content-Type: application/json" \
  -d '{
    "originStation": "AMS",
    "destinationStation": "RTD",
    "departureDate": "2026-12-25",
    "passengerCount": 2,
    "classType": "ECONOMY"
  }'
```

---

**End of Cheat Sheet**
