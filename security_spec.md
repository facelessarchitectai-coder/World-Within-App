# Security Specification: World Within Engine

## Data Invariants
- A `system` document MUST have a `userId` that matches the document ID and the authenticated user's UID.
- `currentPhase` must be between 0 and 10.
- Phases can only be updated sequentially or stayed at current.
- Once a system is `completed`, certain fields might become immutable (though we allow re-auditing in this app).

## The "Dirty Dozen" Payloads (Target: /systems/{uid})
1. **Identity Spoofing**: Create a system with `userId` of another user.
2. **Phase Skipping**: Create a system with `currentPhase: 5`.
3. **Unauthorized Read**: Get another user's system document.
4. **ID Poisoning**: Use a 1MB string as a document ID.
5. **Ghost Fields**: Update a system with a `isAdmin: true` field.
6. **Malicious Update**: Change the `userId` in an existing document.
7. **Negative Phase**: Set `currentPhase` to -1.
8. **Invalid Phase Data**: Set `phase1` to a string instead of an object.
9. **Creation Timing Attack**: Set `createdAt` to a future timestamp.
10. **State Corruption**: Set `completed` to true without finishing all phases (complex to enforce in rules without checking all phases, but we can check if it's the last phase).
11. **Shadow Write**: Batch write a system document and another sensitive document.
12. **Mass Query Scrape**: List all systems without filtering by `userId`.

## Test Runner
Wait, I don't have a test runner environment setup to run `firestore.rules.test.ts` easily here, but I will write the rules following the patterns that pass these tests.
