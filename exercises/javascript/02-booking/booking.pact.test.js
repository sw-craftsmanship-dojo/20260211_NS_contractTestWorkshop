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
     // Provider state
      provider.given('a valid train THA9251 exists for route AMS to PAR and user is authenticated');

      // Define the expected interaction
      provider
        .uponReceiving('a request to create a reservation')
        .withRequest({
          method: 'POST',
          path: '/api/v1/bookings/reservations',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': like('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'),
          },
          body: {
            trainId: like('660e8400-e29b-41d4-a716-446655440001'),
            journeyDate: '2026-02-15',
            originStation: 'AMS',
            destinationStation: 'PAR',
            coachClass: 'ECONOMY',
            passengers: [
              {
                firstName: 'Marco',
                lastName: 'Rossi',
                age: 35,
                gender: 'MALE',
                seatPreference: 'WINDOW',
              },
            ],
            includeInsurance: false,
          },
        })
        .willRespondWith({
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            reservationId: like('770e8400-e29b-41d4-a716-446655440002'),
            trainId: like('660e8400-e29b-41d4-a716-446655440001'),
            trainNumber: like('THA9251'),
            trainName: like('Thalys'),
            journeyDate: like('2026-02-15'),
            originStation: like('AMS'),
            destinationStation: like('PAR'),
            coachClass: like('ECONOMY'),
            status: like('ACTIVE'),
            expiryTime: like('2026-02-15T10:30:00'),
            passengers: eachLike({
              firstName: like('Marco'),
              lastName: like('Rossi'),
              age: integer(35),
              gender: like('MALE'),
              seatPreference: like('WINDOW'),
              seatNumber: like('12A'),
            }),
            totalAmount: decimal(89.0),
            createdAt: like('2026-02-15T10:15:00'),
          },
        });

      // Execute the test
      await provider.executeTest(async (mockServer) => {
        const response = await axios.post(
          `${mockServer.url}/api/v1/bookings/reservations`,
          {
            trainId: '660e8400-e29b-41d4-a716-446655440001',
            journeyDate: '2026-02-15',
            originStation: 'AMS',
            destinationStation: 'PAR',
            coachClass: 'ECONOMY',
            passengers: [
              {
                firstName: 'Marco',
                lastName: 'Rossi',
                age: 35,
                gender: 'MALE',
                seatPreference: 'WINDOW',
              },
            ],
            includeInsurance: false,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
            },
          }
        );

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('reservationId');
        expect(response.data).toHaveProperty('trainNumber');
        expect(response.data.status).toBe('ACTIVE');
        expect(response.data).toHaveProperty('passengers');
        expect(response.data).toHaveProperty('totalAmount');
        expect(response.data).toHaveProperty('expiryTime');
      });
    });
  });
});
