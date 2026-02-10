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


      // ============================================================
      // TODO 2: Define the expected interaction
      // ============================================================
      // HINT: Use provider.uponReceiving('description')
      //       .withRequest({ method, path, headers, body })
      //       .willRespondWith({ status, headers, body })

      // YOUR CODE HERE (uponReceiving)


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

        throw new Error('TODO: Implement this test');
      });
    });
  });
});
