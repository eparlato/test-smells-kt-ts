# Test Smells Kata

This project contains a set of TypeScript/Vitest exercises focused on identifying and refactoring common test smells.

The goal is to improve test readability, isolation, maintainability, and clarity by applying well-known refactoring techniques.

## Topics Covered

The test examples demonstrate smells such as:

- Hidden setup
- Unclear setup details
- Excessive setup
- Irrelevant setup
- Shared mutable fixtures
- Test interdependence
- Eager tests
- Mystery guest
- Inappropriate sharing

Each kata includes intentionally problematic test code and comments describing the smell to fix.

## Requirements

- Node.js 20+
- Vitest
- A code editor capable of running Vitest tests

## Project Structure

The project uses the following structure:
Main domain classes include examples such as:

- `BankAccount`
- `User`
- `Cart`
- `OrderService`
- `UserRepository`
- `DiscountService`

Test classes contain nested kata sections that demonstrate different test design problems.

## How to Use This Kata

1. Open a test file.
2. Read the smell description in each kata section.
3. Refactor the test to make the intention clearer.
4. Keep tests independent and deterministic.
5. Run the test suite after each refactoring.

## Recommended Refactorings

Useful refactorings for these exercises include:

- Extract method
- Introduce variable
- Introduce constant
- Inline unnecessary setup
- Rename variables and test methods
- Replace shared mutable fixtures with fresh test data
- Split eager tests into focused tests
- Remove dependencies on external files or environment variables

## Testing Guidelines

Good tests should be:

- Independent
- Deterministic
- Easy to read
- Focused on one behavior
- Free from irrelevant setup
- Explicit about important test data
