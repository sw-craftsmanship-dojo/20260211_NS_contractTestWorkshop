/**
 * CDC Workshop - Exercise 3: Breaking Change & API Versioning
 *
 * SCENARIO: The backend team deployed a breaking change - they changed the price
 * format from a string to a structured object. You need to migrate to v2 API.
 *
 * YOUR TASK: Create a contract for the NEW v2 API endpoint with structured price format.
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

describe('Search API Contract - v2 (THE NEW WAY)', () => {
  describe('POST /api/v2/search/trains', () => {
    it('returns available trains with structured price format', async () => {
      // ============================================================
      // SCENARIO: Migrating to v2 API
      // ============================================================
      // The v1 API used: "price": "89.00 EUR" (a simple string)
      // The v2 API uses: "price": { "amount": 89.00, "currency": "EUR" }
      //
      // Your frontend needs to update to use the new structured format:
      // - train.price.amount to get the numeric value
      // - train.price.currency to get the currency code

      // ============================================================
      // TODO 1: Define the provider state
      // ============================================================
      // HINT: Use provider.given('trains exist for route AMS to PAR on 2026-02-15')

      // YOUR CODE HERE


      // ============================================================
      // TODO 2: Define the expected interaction (NEW v2 FORMAT)
      // ============================================================
      // HINT: Use provider.uponReceiving('a v2 search request for trains from AMS to PAR')
      //       .withRequest({ method, path, headers, body })
      //       .willRespondWith({ status, headers, body })
      //
      // IMPORTANT: Use the NEW price format:
      //   price: {
      //     amount: decimal(89.00),
      //     currency: like('EUR')
      //   }

      // YOUR CODE HERE (uponReceiving)


      // YOUR CODE HERE (withRequest)
      // - method: 'POST'
      // - path: '/api/v2/search/trains' <- NOTICE: v2 endpoint!
      // - body: origin, destination, departureDate, passengers


      // YOUR CODE HERE (willRespondWith)
      // - status: 200
      // - body with: searchId, totalResults, availableTrains
      // - availableTrains: eachLike() with trainId, trainNumber, departureTime, arrivalTime
      // - price: { amount: decimal(89.00), currency: like('EUR') } <- NEW FORMAT!


      await provider.executeTest(async (mockServer) => {
        // ============================================================
        // TODO: Execute the test
        // ============================================================
        // YOUR CODE HERE
        // 1. Make axios.post request to mockServer.url + '/api/v2/search/trains'
        // 2. Send the search criteria in the body
        // 3. Add assertions for:
        //    - response.status should be 200
        //    - response.data should have 'availableTrains' property
        //    - firstTrain.price should be an object with 'amount' and 'currency' properties
        //    - typeof firstTrain.price.amount should be 'number'
        //    - typeof firstTrain.price.currency should be 'string'

        throw new Error('TODO: Implement this test');
      });
    });
  });
});

/*
 * ============================================================================
 * WHAT YOU LEARNED
 * ============================================================================
 *
 * Breaking Changes & API Versioning:
 * - The backend team changed the price format from a string to a structured object
 * - This is a BREAKING CHANGE because existing frontend code would break
 * - The solution: Create a new API version (v2) instead of breaking v1
 *
 * Price Format Evolution:
 *
 * v1 API (deprecated):
 *   "price": "89.00 EUR"
 *   Frontend: <span>{train.price}</span>
 *
 * v2 API (current):
 *   "price": { "amount": 89.00, "currency": "EUR" }
 *   Frontend: <span>{train.price.amount} {train.price.currency}</span>
 *
 * Benefits of the new format:
 * - Structured data is easier to parse and manipulate
 * - Can do math on the amount without string parsing
 * - Clear separation of numeric value and currency
 * - Better for internationalization
 *
 * Contract Testing Benefits:
 * - Your contract would catch this breaking change immediately
 * - Frontend and backend can evolve independently
 * - API versioning allows gradual migration
 *
 * See the solution folder when you're done!
 */
