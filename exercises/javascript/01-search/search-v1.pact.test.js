/**
 * CDC Workshop - Exercise 1: Search Trains Contract
 *
 * YOUR TASK: Complete the TODOs to create a contract for the search endpoint.
 *
 * Endpoint: POST /api/v1/search/trains
 *
 * Request body:
 * {
 *   "origin": "AMS",
 *   "destination": "PAR",
 *   "departureDate": "2026-02-15",
 *   "passengers": 2
 * }
 *
 * Expected response:
 * {
 *   "searchId": "uuid",
 *   "totalResults": 3,
 *   "availableTrains": [
 *     {
 *       "trainId": "uuid",
 *       "trainNumber": "THA9251",
 *       "departureTime": "08:15",
 *       "arrivalTime": "11:47",
 *       "price": { "amount": 89.00, "currency": "EUR" }
 *     }
 *   ]
 * }
 *
 * HINT: Look at 00-login-reference for the pattern to follow!
 */

const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like, eachLike, integer, decimal } = MatchersV3;
const axios = require('axios');
const path = require('path');

const provider = new PactV3({
  consumer: 'ticket-frontend-web',
  provider: 'ticket-api',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('Search API Contract', () => {
  describe('POST /api/v1/search/trains', () => {
    it('returns available trains for a valid search', async () => {
     // Provider state
      provider.given('trains exist for route AMS to PAR on 2026-02-15');

      // Define the expected interaction
      provider
        .uponReceiving('a v1 search request for trains from AMS to PAR')
        .withRequest({
          method: 'POST',
          path: '/api/v1/search/trains',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            originStation: 'AMS',
            destinationStation: 'PAR',
            departureDate: '2026-02-15',
            passengerCount: 2,
            classType: 'ECONOMY',
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            searchId: like('550e8400-e29b-41d4-a716-446655440000'),
            totalResults: integer(3),
            message: like('3 train(s) found'),
            availableTrains: eachLike({
              trainId: like('660e8400-e29b-41d4-a716-446655440001'),
              trainNumber: like('THA9251'),
              trainName: like('Thalys'),
              originStationCode: like('AMS'),
              originStationName: like('Amsterdam'),
              destinationStationCode: like('PAR'),
              destinationStationName: like('Paris'),
              departureTime: like('08:15'),
              arrivalTime: like('11:47'),
              durationMinutes: integer(212),
              // V1 FORMAT: Price as string!
              price: like('89.00 EUR'),
            }),
          },
        });

      // Execute the test
      await provider.executeTest(async (mockServer) => {
        const response = await axios.post(
          `${mockServer.url}/api/v1/search/trains`,
          {
            originStation: 'AMS',
            destinationStation: 'PAR',
            departureDate: '2026-02-15',
            passengerCount: 2,
            classType: 'ECONOMY',
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('searchId');
        expect(response.data).toHaveProperty('availableTrains');
        expect(Array.isArray(response.data.availableTrains)).toBe(true);

        // V1: Price should be a STRING
        const firstTrain = response.data.availableTrains[0];
        expect(typeof firstTrain.price).toBe('string');
      });
    });
  });
});
