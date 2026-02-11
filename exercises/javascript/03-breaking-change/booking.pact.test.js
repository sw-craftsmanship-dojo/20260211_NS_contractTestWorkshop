/**
 * CDC Workshop - Exercise 2: Ticket Reservation Contract
 *
 * YOUR TASK: Create a contract for the reservation endpoint.
 *
 * Endpoint: POST /api/v1/bookings/reservations
 *
 * Request body:
 * {
 *   "trainId": "uuid-of-selected-train",
 *   "journeyDate": "2026-02-15",
 *   "originStation": "AMS",
 *   "destinationStation": "PAR",
 *   "coachClass": "ECONOMY",
 *   "passengers": [
 *     {
 *       "firstName": "Marco",
 *       "lastName": "Rossi",
 *       "age": 35,
 *       "gender": "MALE",
 *       "seatPreference": "WINDOW"
 *     }
 *   ],
 *   "includeInsurance": false
 * }
 *
 * Expected response:
 * {
 *   "reservationId": "uuid",
 *   "trainNumber": "THA9251",
 *   "trainName": "Thalys",
 *   "status": "ACTIVE",
 *   "expiryTime": "2026-02-15T10:30:00",
 *   "passengers": [...],
 *   "totalAmount": 89.00
 * }
 *
 * NEW CONCEPT: This endpoint requires an Authorization header!
 */

const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like, eachLike, decimal, integer } = MatchersV3;
const axios = require('axios');
const path = require('path');

const provider = new PactV3({
  consumer: 'ticket-frontend-web',
  provider: 'ticket-api',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('Booking API Contract', () => {
  describe('POST /api/v1/bookings/reservations', () => {
    it('creates a reservation for selected train', async () => {
      // ============================================================
      // TODO 1: Define the provider state
      // ============================================================
      // HINT: The state should indicate:
      // - A valid train exists for the route
      // - The user is authenticated

      provider
        .given('we can log in and reserve an available seat');

      


      // ============================================================
      // TODO 2: Define the expected interaction
      // ============================================================
      // REMEMBER:
      // - This endpoint requires Authorization header!
      // - Use like('Bearer token') for the auth header
      // - passengers is an array, use eachLike()

      // YOUR CODE HERE (uponReceiving)

      const responseBody = {
            "reservationId": "uuid",
            "trainNumber": 9251,
            "trainName": "Thalys",
            "status": "ACTIVE",
            "expiryTime": "2026-02-15T10:30:00",
            "passengers": eachLike({
              firstName: 'John',
              lastName: 'Doe',
              age: 30,
              gender: 'MALE',
              seatPreference: 'WINDOW'
            }),
            "totalAmount": like(89.00)
          } 

      provider
        .uponReceiving('a request to login with valid credentials')
        .withRequest({
          method: 'POST',
          path: `/api/v1/bookings/reservations`,
          headers: {
            'Content-Type': 'application/json',
            'bearerAuth': like('Bearer token')
          },
          body: {
              "trainId": "uuid-of-selected-train",
              "journeyDate": "2026-02-15",
              "originStation": "AMS",
              "destinationStation": "PAR",
              "coachClass": "ECONOMY",
              "passengers": [
                {
                  "firstName": "Marco",
                  "lastName": "Rossi",
                  "age": 35,
                  "gender": "MALE",
                  "seatPreference": "WINDOW"
                }
              ],
              "includeInsurance": false
          },
        })
        .willRespondWith({
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
          body: responseBody,
        });


      // YOUR CODE HERE (withRequest)
      // Headers should include:
      // - 'Content-Type': 'application/json'
      // - 'Authorization': like('Bearer eyJhbGci...')
      //
      // Body should include:
      // - trainId: like('uuid')
      // - journeyDate: '2026-02-15'
      // - originStation: 'AMS'
      // - destinationStation: 'PAR'
      // - coachClass: 'ECONOMY'
      // - passengers array with: firstName, lastName, age, gender, seatPreference
      // - includeInsurance: false


      // YOUR CODE HERE (willRespondWith)
      // Response should include:
      // - reservationId: like()
      // - trainNumber: like()
      // - trainName: like()
      // - status: like('ACTIVE')
      // - expiryTime: like()
      // - passengers: eachLike() with seatNumber assigned
      // - totalAmount: decimal()


      // ============================================================
      // TODO 3: Execute the test
      // ============================================================
      // Don't forget to include the Authorization header in your request!

      await provider.executeTest(async (mockServer) => {
        // YOUR CODE HERE


        // Make the actual HTTP call to the mock server
        const response = await axios.post(
          `${mockServer.url}/api/v1/bookings/reservations`,
          {
              "trainId": "uuid-of-selected-train",
              "journeyDate": "2026-02-15",
              "originStation": "AMS",
              "destinationStation": "PAR",
              "coachClass": "ECONOMY",
              "passengers": [
                {
                  "firstName": "Marco",
                  "lastName": "Rossi",
                  "age": 35,
                  "gender": "MALE",
                  "seatPreference": "WINDOW"
                }
              ],
              "includeInsurance": false
          },
          {
            headers: { 'Content-Type': 'application/json', bearerAuth: 'my-valid-jwt-token', },
          }
        );

        // Verify the response matches our expectations
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('expiryTime');
        expect(response.data).toHaveProperty('reservationId');
        expect(response.data).toHaveProperty('reservationId');
        expect(response.data).toHaveProperty('status');
        expect(response.data).toHaveProperty('totalAmount');
        expect(response.data).toHaveProperty('trainNumber');
        expect(response.data).toHaveProperty('trainName');

      });
    });
  });
});
