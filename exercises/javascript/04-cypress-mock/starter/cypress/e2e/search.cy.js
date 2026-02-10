/**
 * CDC Workshop - Cypress Test with Mocked API
 *
 * YOUR TASK: Use cy.intercept() to mock the search API,
 * then write a test that verifies the UI displays the results.
 *
 * The mock response should match the Pact contract structure!
 */

describe('Train Search Page', () => {
  beforeEach(() => {
    // ============================================================
    // TODO 1: Set up the API mock using cy.intercept()
    // ============================================================
    // HINT: Mock the POST /api/v1/search/trains endpoint
    // Use the same response structure from your Pact contract!
    //
    // cy.intercept('POST', '**/api/v1/search/trains', {
    //   statusCode: 200,
    //   body: {
    //     searchId: '...',
    //     totalResults: ...,
    //     availableTrains: [...]
    //   }
    // }).as('searchTrains');

    // YOUR CODE HERE

  });

  it('displays search results from the API', () => {
    // ============================================================
    // TODO 2: Visit the search page
    // ============================================================
    // HINT: cy.visit('/search');

    // YOUR CODE HERE


    // ============================================================
    // TODO 3: Fill in the search form
    // ============================================================
    // HINT:
    // cy.get('[data-testid="origin"]').type('AMS');
    // cy.get('[data-testid="destination"]').type('PAR');
    // cy.get('[data-testid="date"]').type('2026-02-15');
    // cy.get('[data-testid="passengers"]').type('2');

    // YOUR CODE HERE


    // ============================================================
    // TODO 4: Submit the search
    // ============================================================
    // HINT: cy.get('[data-testid="search-btn"]').click();

    // YOUR CODE HERE


    // ============================================================
    // TODO 5: Wait for the mocked API call
    // ============================================================
    // HINT: cy.wait('@searchTrains');

    // YOUR CODE HERE


    // ============================================================
    // TODO 6: Verify the UI displays the results
    // ============================================================
    // HINT:
    // cy.get('[data-testid="train-result"]').should('have.length.at.least', 1);
    // cy.get('[data-testid="train-number"]').should('contain', 'THA9251');
    // cy.get('[data-testid="train-price"]').should('contain', '89.00');

    // YOUR CODE HERE

  });

  it('handles empty search results', () => {
    // ============================================================
    // BONUS: Mock an empty response and verify the "no results" UI
    // ============================================================

    // cy.intercept('POST', '**/api/v1/search/trains', {
    //   statusCode: 200,
    //   body: {
    //     searchId: '...',
    //     totalResults: 0,
    //     availableTrains: []
    //   }
    // }).as('emptySearch');

    // ... test the "no results" scenario

  });
});
