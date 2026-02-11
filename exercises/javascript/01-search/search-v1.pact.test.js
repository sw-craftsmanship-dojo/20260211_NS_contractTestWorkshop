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
      // ============================================================
      // TODO 1: Define the provider state
      // ============================================================
      // HINT: Use provider.given('state description')
      // The state should describe what data exists on the provider.
      // Example: 'trains exist for route AMS to PAR on 2026-02-15'

      // YOUR CODE HERE
      provider.given('trains exist for route AMS to RTD on 2026-12-25');

      // ============================================================
      // TODO 2: Define the expected interaction
      // ============================================================
      // HINT: Use provider.uponReceiving('description')
      //       .withRequest({ method, path, headers, body })
      //       .willRespondWith({ status, headers, body })

      // YOUR CODE HERE (uponReceiving)
      provider
        .uponReceiving('a search request for trains from AMS to RTD on 2026-12-25 for 2 passengers')
        .withRequest({
          method: 'POST',
          path: '/api/v1/search/trains',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            originStation: "AMS",
            destinationStation: "RTD",
            departureDate: "2026-12-25T00:00:00.000Z",
            passengerCount: 2,
            classType: "ECONOMY"
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            searchId: like('550e8400-e29b-41d4-a716-446655440000'),
            totalResults: like(3),
            availableTrains: eachLike([
              {
                trainId: like("83e82aba-cfe0-41de-a43e-5dd2cbb3c121"),
                trainNumber: like("THA9251"),
                departureTime: like("08:15"),
                arrivalTime: like("11:47"),
                price: { amount: like(89.00), currency: like("EUR") }
              }
            ])
          }
        });

      // YOUR CODE HERE (withRequest)
      // Remember:
      // - method: 'POST'
      // - path: '/api/v1/search/trains'
      // - headers: Content-Type application/json
      // - body: origin, destination, departureDate, passengers


      // YOUR CODE HERE (willRespondWith)
      // Remember:
      // - status: 200
      // - body should include:
      //   - searchId: use like() for UUID
      //   - totalResults: use integer()
      //   - availableTrains: use eachLike() for the array!
      //
      // NEW CONCEPT: eachLike() matches an array where each element
      // matches the provided example. This is crucial for arrays!
      //
      // Example:
      // availableTrains: eachLike({
      //   trainId: like('uuid'),
      //   trainNumber: like('THA9251'),
      //   ...
      // })


      // ============================================================
      // TODO 3: Execute the test
      // ============================================================
      // HINT: Use provider.executeTest(async (mockServer) => { ... })
      // Make the axios POST request and verify the response.

      await provider.executeTest(async (mockServer) => {
        // YOUR CODE HERE
        // 1. Make axios.post request to mockServer.url + '/api/v1/search/trains'
        // 2. Send the search criteria in the body
        // 3. Add assertions for response.status and response.data
        const response = await axios.post(
          `${mockServer.url}/api/v1/search/trains`, 
          {
            originStation: "AMS",
            destinationStation: "RTD",
            departureDate: "2026-12-25T00:00:00.000Z",
            passengerCount: 2,
            classType: "ECONOMY"
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )

        console.log(response.data)

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('searchId');
        expect(response.data).toHaveProperty('totalResults');
        expect(response.data).toHaveProperty('availableTrains');
      });
    });
  });
});
