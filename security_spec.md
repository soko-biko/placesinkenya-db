# Security Specification - PlacesInKenya

## 1. Data Invariants
- A `Place` must have a valid `ownerId` matching the creator's UID.
- `Places` are publicly readable but only writable by their `ownerId` or an `ADMIN`.
- `Reviews` must be tied to a valid `placeId` and `userId`.
- `User Profiles` are private to the owner and admins.

## 2. Denormalization Strategy
To optimize the main list view and avoid expensive joins or subcollection queries:
1. **Average Rating (`rating`)**: The `Place` document contains a `rating` field (average) and `numRatings`. When a new review is added to `/places/{placeId}/reviews`, the `rating` and `numRatings` in the parent `Place` document are updated.
2. **Starting Price (`price`)**: The `Place` document stores the `price` field directly. If there are multiple pricing tiers in a subcollection, the "starting" price is mirrored here.

## 3. The "Dirty Dozen" Payloads (Test Cases)
1. **Identity Spoofing**: Attempt to create a Place with `ownerId` as "other_user_id". -> `PERMISSION_DENIED`
2. **Unauthorized Update**: Authenticated user "B" attempts to update a Place owned by user "A". -> `PERMISSION_DENIED`
3. **Admin Escalation**: User attempts to set `role: 'ADMIN'` in their own user profile. -> `PERMISSION_DENIED`
4. **Invalid Type**: Attempt to set `price` as a string "cheap". -> `PERMISSION_DENIED`
5. **ID Poisoning**: Attempt to use a 2MB string as a `placeId`. -> `PERMISSION_DENIED`
6. **Shadow Field Injection**: Attempt to create a Place with extra unmapped field `isAdminVerified: true`. -> `PERMISSION_DENIED`
7. **Temporal Fraud**: Attempt to set `submittedAt` to a future date instead of `request.time`. -> `PERMISSION_DENIED`
8. **PII Leak**: Non-admin user attempts to read `/users/other_user_id`. -> `PERMISSION_DENIED`
9. **State Shortcut**: Attempt to update `status` from `PENDING` to `APPROVED` as a non-admin. -> `PERMISSION_DENIED`
10. **Resource Exhaustion**: Attempt to send a 1MB `description` string. -> `PERMISSION_DENIED`
11. **Relational Sync Failure**: Creating a review for a non-existent `placeId`. -> `PERMISSION_DENIED`
12. **Blanket Query**: Attempting to list all `users` without a filter. -> `PERMISSION_DENIED`
