/**
 * CDC Workshop - Exercise 3: Breaking Change (STARTER)
 *
 * SCENARIO: It's Monday morning. The backend team deployed over the weekend.
 * Run this test and see what happens...
 *
 * This contract was working on Friday. What changed?
 */

const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like, eachLike, integer } = MatchersV3;
const axios = require('axios');
const path = require('path');

const provider = new PactV3({
  consumer: 'ticket-frontend-web',
  provider: 'ticket-api',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('Search API Contract - v1 (THE OLD WAY)', () => {
  describe('POST /api/v1/search/trains', () => {
    it('returns available trains for a valid search', async () => {
      // This contract expects the OLD price format: "89.00 EUR" (a simple string)
      // But the backend team "improved" it to: { amount: 89.00, currency: "EUR" }
      // Your frontend code does: train.price (expecting a string to display)
      // But now train.price is an OBJECT!

      provider.given('trains exist for route AMS to PAR on 2026-02-15');

      provider
        .uponReceiving('a search request for trains from AMS to PAR')
        .withRequest({
          method: 'POST',
          path: '/api/v1/search/trains',
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
              // OLD FORMAT - Price as a simple string
              price: like('89.00 EUR'),
            }),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await axios.post(
          `${mockServer.url}/api/v1/search/trains`,
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
        expect(response.data).toHaveProperty('availableTrains');

        // This assertion would FAIL if the backend returns the new format
        // because response.data.availableTrains[0].price would be an object
        const firstTrain = response.data.availableTrains[0];
        expect(typeof firstTrain.price).toBe('string');
      });
    });
  });
});

/*
 * ============================================================================
 * WHAT HAPPENED?
 * ============================================================================
 *
 * The backend team "improved" the price format from a string to an object:
 *
 * BEFORE (v1):
 *   "price": "89.00 EUR"
 *
 * AFTER (breaking change):
 *   "price": { "amount": 89.00, "currency": "EUR" }
 *
 * Your frontend code does: <span>{train.price}</span>
 * But now train.price is an OBJECT, so it displays "[object Object]"!
 *
 * ============================================================================
 * YOUR TASK
 * ============================================================================
 *
 * The backend team created /api/v2/ with the new structured format.
 * The old /api/v1/ endpoint will be deprecated but still works for now.
 *
 * To fix this:
 * 1. Change the path to '/api/v2/search/trains'
 * 2. Update the price expectation to match the new format:
 *    price: { amount: decimal(89.00), currency: like('EUR') }
 * 3. Update the test assertion for the new format
 *
 * See the solution folder when you're done!
 */
