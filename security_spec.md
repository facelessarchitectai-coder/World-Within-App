# Security Specification: World Within Engine

## Data Invariants
1. A `system` document MUST have a `userId` that strictly matches the document ID (`systemId`) and `request.auth.uid`.
2. The authenticated user must be a verified Google user (`request.auth.token.email_verified == true || provider == 'google.com'`).
3. Cross-user reading is prohibited: User A cannot read, list, update, or delete User B's document.
4. List queries across `/systems` are disabled (`allow list: if false;`), eliminating enumeration and data leakage.
5. Invariant fields: During updates, `incoming().userId == existing().userId` ensures the owner UID cannot be modified or hijacked.
6. Server timestamps: `updatedAt` is validated as a timestamp.

## The "Dirty Dozen" Payloads (Target: /systems/{uid})
1. **Identity Spoofing**: Create a system with `userId: "attacker"` under `/systems/victim`. Blocked by `incoming().userId == request.auth.uid` and `incoming().userId == systemId`.
2. **Phase Injection**: Create a system with negative phase `currentPhase: -5` or invalid type. Blocked by `data.currentPhase >= 0 && data.currentPhase <= 13`.
3. **Cross-Tenant Read**: User A executes `getDoc(doc(db, 'systems', userB_uid))`. Blocked by `isOwner(systemId)`.
4. **ID Poisoning Attack**: Passing a 1MB junk document ID. Blocked by `isValidId(systemId)` with `.size() <= 128` and regex check.
5. **Collection Scraping**: User runs `getDocs(collection(db, 'systems'))`. Blocked by `allow list: if false;`.
6. **Owner Hijacking**: User updates an existing record trying to change `userId` to another user. Blocked by `incoming().userId == existing().userId`.
7. **Unverified Account Write**: Attempting write without email verification. Blocked by `isVerifiedUser()`.
8. **Malicious Delete**: User A attempts `deleteDoc(doc(db, 'systems', userB_uid))`. Blocked by `isOwner(systemId)`.
9. **Unauthenticated Access**: Guest client calls Firestore before login. Blocked by default deny and `isSignedIn()` check.
10. **Global Safety Net Bypass**: Accessing undefined collections like `/admin`, `/secrets`. Blocked by catch-all `match /{document=**} { allow read, write: if false; }`.
11. **Type Tampering**: Sending boolean or array for integer `currentPhase`. Blocked by `data.currentPhase is int`.
12. **Zombie Write After Sign-Out**: In-flight update sent after auth token invalidation. Rejected by rules as `request.auth` is null.
