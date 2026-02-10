/**
 * CDC Workshop - Login Contract Reference
 *
 * This is a COMPLETE, WORKING example of a Pact consumer contract test.
 * Study this code before writing your own contracts in the exercises.
 *
 * Key concepts demonstrated:
 * 1. Provider definition - identifies the API we're consuming
 * 2. Provider state - sets up test data on the provider side
 * 3. Request definition - what our frontend will send
 * 4. Response matching - what we expect back (using matchers)
 * 5. Test execution - runs the test and generates the contract
 */

const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like, integer } = MatchersV3;
const axios = require('axios');
const path = require('path');

// ============================================================
// STEP 1: Define the Consumer and Provider
// ============================================================
// The consumer is YOUR application (the frontend)
// The provider is the API you're consuming (ticket-api)

const provider = new PactV3({
  consumer: 'ticket-frontend-web',
  provider: 'ticket-api',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('Auth API Contract', () => {
  describe('POST /api/v1/auth/login', () => {
    it('returns tokens for valid credentials', async () => {
      // ============================================================
      // STEP 2: Define the Provider State
      // ============================================================
      // This tells the provider what test data to set up.
      // The provider will have a handler that matches this exact string.

      provider
        .given('an existing user with email test@example.com and password Password123!');

      // ============================================================
      // STEP 3: Define the Expected Interaction
      // ============================================================
      // This is the "contract" - what we send and what we expect back.

      provider
        .uponReceiving('a request to login with valid credentials')
        .withRequest({
          method: 'POST',
          path: '/api/v1/auth/login',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            email: 'test@example.com',
            password: 'Password123!',
          },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            // ============================================================
            // MATCHERS: These define the "shape" of the response
            // ============================================================
            // like() means "match by type, not exact value"
            // The value provided is just an example for documentation

            userId: like('550e8400-e29b-41d4-a716-446655440000'),
            accessToken: like('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'),
            refreshToken: like('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'),
            expiresIn: integer(3600),
          },
        });

      // ============================================================
      // STEP 4: Execute the Test
      // ============================================================
      // This starts a mock server, runs your API call against it,
      // and generates the contract file if successful.

      await provider.executeTest(async (mockServer) => {
        // Make the actual HTTP call to the mock server
        const response = await axios.post(
          `${mockServer.url}/api/v1/auth/login`,
          {
            email: 'test@example.com',
            password: 'Password123!',
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        // Verify the response matches our expectations
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('userId');
        expect(response.data).toHaveProperty('accessToken');
        expect(response.data).toHaveProperty('refreshToken');
        expect(response.data).toHaveProperty('expiresIn');
      });
    });
  });
});

/*
 * ============================================================
 * WHAT HAPPENS WHEN YOU RUN THIS TEST:
 * ============================================================
 *
 * 1. Pact starts a mock HTTP server
 * 2. The mock server is configured with our expected interaction
 * 3. Our test makes a real HTTP request to the mock server
 * 4. Pact verifies the request matches what we defined
 * 5. Pact returns the response we defined
 * 6. Our assertions verify the response
 * 7. If everything passes, Pact generates a contract JSON file
 *
 * The contract file will be at: pacts/ticket-frontend-web-ticket-api.json
 *
 * ============================================================
 * KEY INSIGHTS:
 * ============================================================
 *
 * Q: How is this different from mocking?
 * A: Regular mocks are thrown away. This mock GENERATES A CONTRACT
 *    that the provider must satisfy. It's a formal agreement.
 *
 * Q: What if the provider changes the response?
 * A: Their CI will pull this contract and verify against it.
 *    If they change something we depend on, their build fails.
 *
 * Q: Who defines the contract?
 * A: The CONSUMER (frontend) defines it. That's why it's called
 *    "Consumer-Driven" contract testing.
 */
