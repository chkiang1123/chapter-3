# Security Specification · Balance Quest S.2 Chapter 3

## 1. Data Invariants
1. **Default Deny**: All unspecified Firestore paths are denied (`allow read, write: if false;`).
2. **Verified Identity Only**: All reads and writes require `request.auth != null && request.auth.token.email_verified == true`.
3. **Teacher Allowlist Enforcement**: Only `chkiang@skhbbss.edu.hk` (primary teacher) or emails present in `/teacherAllowlist/{email}` (case-insensitive lowercase match on verified Google token email) can list all `/students`, read another student's attempts, or manage `/teacherAllowlist`.
4. **PII Isolation**: Student email and wrong-input logs live inside `/students/{studentUid}` and `/students/{studentUid}/attempts/{attemptId}`. `/leaderboard/{studentUid}` stores zero PII (no `email` or attempt inputs).
5. **Master Gate & Immutability**: `/students/{studentUid}/attempts/{attemptId}` requires parent `/students/{studentUid}` to exist, enforces `uid == request.auth.uid == studentUid`, and prohibits client updates.
6. **Temporal Integrity & Bounded Payloads**: All `createdAt` and `updatedAt` timestamps must equal `request.time`. All strings and arrays have strict max sizes.

## 2. "Dirty Dozen" Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Student Read**: Anonymous `get(/students/stu1)` without `request.auth` -> DENIED.
2. **Email Spoofing (`email_verified: false`)**: `request.auth.token.email = "chkiang@skhbbss.edu.hk"` with `email_verified: false` reading `/students` -> DENIED.
3. **Non-Teacher Student Scraping**: Student `a@skhbbss.edu.hk` calling `list(/students)` -> DENIED.
4. **Cross-Student Attempt Read**: Student A calling `get(/students/studentB/attempts/att1)` -> DENIED.
5. **Self-Escalation to Teacher**: Student writing `/teacherAllowlist/student@skhbbss.edu.hk` -> DENIED.
6. **Primary Teacher Deletion Attempt**: Any user deleting `/teacherAllowlist/chkiang@skhbbss.edu.hk` -> DENIED.
7. **Identity Spoofing on Student Summary**: Student A creating `/students/studentB` or setting `uid: "studentB"` -> DENIED.
8. **Shadow Field Injection ("Ghost Field")**: Student creating `/students/studentA` with extra `{ isTeacher: true }` -> DENIED (`hasOnly` rejects).
9. **Client Timestamp Forgery**: Student creating `/students/studentA/attempts/att1` with fake `createdAt` != `request.time` -> DENIED.
10. **Array Exhaustion ("Denial of Wallet")**: Student writing `completedIdsSec1` with 200 items (> 120) or `wrongInputs` with 50 items (> 30) -> DENIED.
11. **Path Variable Poisoning**: Student creating `/students/../../evil` or 500-char doc ID -> DENIED (`isValidId`).
12. **PII Leak in Leaderboard**: Student writing `{ email: "leak@school.edu.hk" }` into `/leaderboard/studentA` -> DENIED (`hasOnly` rejects).
