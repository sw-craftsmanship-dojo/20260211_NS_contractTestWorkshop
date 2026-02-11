# Consumer-Driven Contract Testing Workshop

A hands-on workshop teaching Consumer-Driven Contract (CDC) testing principles through practical exercises using a Train Booking API.

## Workshop Overview

This workshop simulates a **real-world production workflow** where frontend and backend teams work independently using contract testing to prevent integration issues. You'll learn how to write, verify, and maintain consumer contracts that ensure your frontend expectations match the backend API implementation.

**📖 [Read the complete workflow guide](WORKFLOW.md)** to understand how contract testing works from local development through CI/CD to production.

### What You'll Learn

- Write consumer contract tests using Pact
- Define API expectations from the frontend perspective
- Use provider states to set up test scenarios
- Handle complex data structures and arrays
- Work with authenticated endpoints
- Detect and handle breaking changes
- Apply API versioning strategies

## The Train Booking API

You're building a train ticket booking application with these core features:

- **Authentication**: User login and registration
- **Search**: Find available trains between stations
- **Booking**: Reserve tickets for passengers

The backend team provides a REST API at `https://workshop--ticket-api--7jydqjwn7yp5.code.run/` with endpoints for each feature. Your contracts will define exactly what your frontend expects from these endpoints.

## Exercise Structure

### 00-login-reference (Working Example)

**Location**: `exercises/javascript/00-login-reference/`

This is a **complete, working example** of a contract test for the login endpoint. Study this code before starting the exercises - it shows you the pattern you'll follow for the other endpoints.

**What it demonstrates**:

- How to set up a Pact test
- Using provider states (`given`)
- Defining request/response expectations
- Running tests and generating contracts

### 01-search (First Exercise)

**Location**: `exercises/javascript/01-search/`

Write your first contract for the train search endpoint. Learn to handle array responses and complex data structures.

### 02-booking (Second Exercise)

**Location**: `exercises/javascript/02-booking/`

Create contracts for the booking endpoint. Work with authenticated requests and business entity creation.

### 03-breaking-change (Third Exercise)

**Location**: `exercises/javascript/03-breaking-change/`

Experience how contracts catch breaking changes and learn to handle API versioning.

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/conso/frontend-workshop.git
cd frontend-workshop
```

### 2. Verify Your Setup

Run the reference example to ensure everything works:

```bash
cd exercises/javascript/00-login-reference
npm install
npm test
```

**Expected output**:

```text
PASS  ./auth.pact.test.js
  Auth API Contract Tests
    POST /api/v1/auth/login
      ✓ should return tokens for valid credentials (XXXms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

### 3. Check the Generated Contract

After the test passes, a contract file is generated:

```bash
cat pacts/ticket-frontend-web-ticket-api.json
```

This JSON file defines the contract between your frontend and the backend API.

## How Contract Testing Works

```text
┌─────────────────────────────────────────────────────────────┐
│                    CONTRACT WORKFLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend Team                    Backend Team              │
│       │                                 │                   │
│       │ 1. Write contract tests         │                   │
│       │    (this workshop)              │                   │
│       ▼                                 │                   │
│   Generate contract                     │                   │
│       │                                 │                   │
│       │ 2. Publish contract             │                   │
│       ├────────────────────────────────>│                   │
│       │                                 │                   │
│       │                                 ▼                   │
│       │                        3. Verify against API        │
│       │                           (provider tests)          │
│       │                                 │                   │
│       │                        ✅ Pass: Deploy              │
│       │                        ❌ Fail: Fix API             │
│       │                                                     │
└─────────────────────────────────────────────────────────────┘
```

## Workshop Flow

1. **Study the Reference** (15 min)
   - Examine `00-login-reference/auth.pact.test.js`
   - Understand the contract structure
   - Run the test locally

2. **Exercise 1: Search** (30 min)
   - Navigate to `01-search/`
   - Read the README for instructions
   - Write the search contract test
   - Verify it passes locally

3. **Exercise 2: Booking** (30 min)
   - Navigate to `02-booking/`
   - Create the booking contract
   - Handle authentication headers
   - Test business entity creation

4. **Exercise 3: Breaking Change** (35 min)
   - Navigate to `03-breaking-change/`
   - Experience a contract failure
   - Learn API versioning
   - Migrate to v2 endpoint

## Troubleshooting

### Tests fail with "Cannot find module"

```bash
# Make sure you're in the exercise directory
cd exercises/javascript/00-login-reference
npm install
```

### Port already in use

The Pact mock server uses port 1234 by default. Make sure no other process is using it.

### Contract file not generated

Check that the test passed. Contract files are only created when tests pass.

## Next Steps

After completing the exercises:

- Review your generated contracts in `pacts/` folders
- Compare your solutions with the reference implementation
- Explore how contracts are verified on the backend (see `ticket-api` repository)

## Resources

- [Pact Documentation](https://docs.pact.io/)
- [Contract Testing Fundamentals](https://martinfowler.com/articles/consumerDrivenContracts.html)
- [API Reference](api-reference/endpoints-cheatsheet.md)

## Workshop Support

If you encounter issues during the workshop:

1. Check the exercise README for hints
2. Review the reference implementation in `00-login-reference`
3. Ask your instructor for assistance

Happy contracting! 🎫
