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
       // Provider state
      provider.given('trains exist for route AMS to PAR on 2026-02-15');

      // Define the expected interaction
      provider
        .uponReceiving('a v2 search request for trains from AMS to PAR')
        .withRequest({
          method: 'POST',
          path: '/api/v2/search/trains',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            origin: 'AMS',
            destination: 'PAR',
            departureDate: '2026-02-15',
            passengers: 2,
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
            availableTrains: eachLike({
              trainId: like('660e8400-e29b-41d4-a716-446655440001'),
              trainNumber: like('THA9251'),
              departureTime: like('08:15'),
              arrivalTime: like('11:47'),
              // V2 FORMAT: Price as object!
              price: {
                amount: decimal(89.0),
                currency: like('EUR'),
              },
            }),
          },
        });

      // Execute the test
      await provider.executeTest(async (mockServer) => {
        const response = await axios.post(
          `${mockServer.url}/api/v2/search/trains`,
          {
            origin: 'AMS',
            destination: 'PAR',
            departureDate: '2026-02-15',
            passengers: 2,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('searchId');
        expect(response.data).toHaveProperty('availableTrains');
        expect(Array.isArray(response.data.availableTrains)).toBe(true);

        // V2: Price should be an OBJECT with amount and currency
        const firstTrain = response.data.availableTrains[0];
        expect(firstTrain.price).toHaveProperty('amount');
        expect(firstTrain.price).toHaveProperty('currency');
        expect(typeof firstTrain.price.amount).toBe('number');
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
