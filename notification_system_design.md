Stage 1
### API Design for Notification System

#### Core Actions:
- Fetch notifications
- Create notifications
- Mark as read

---

### 1. GET /notifications

Headers:
Authorization: Bearer <token>

Response:
[
  {
    "ID": "uuid",
    "Type": "Placement",
    "Message": "Company hiring",
    "Timestamp": "2026-04-22 17:51:18"
  }
]

---

### 2. POST /notifications

Request:
{
  "userId": "123",
  "type": "Result",
  "message": "Exam result declared"
}

---

### 3. PUT /notifications/:id/read

Purpose:
- Mark notification as read

---

### Real-Time Mechanism

- Use WebSockets for real-time updates
- Alternative: Server-Sent Events (SSE)

Reason:
- Instant delivery without polling

Stage 2

### Database Choice: MongoDB

Reason:
- Handles large-scale data
- Flexible schema
- High write throughput

---

### Schema

Notification {
  _id,
  userId,
  type,
  message,
  isRead,
  createdAt
}

---

### Problems with scale:
- Slow queries
- Large data scanning

---

### Solution:
- Indexing
- Partitioning (sharding)

Stage 3

### Given Query

SELECT * FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt DESC;

---

### Is it accurate?

Yes, but inefficient.

---

### Why slow?

- Full table scan
- No index usage
- Sorting large dataset

---

### Fix

Create composite index:

(studentId, isRead, createdAt DESC)

---

### Cost

- Slightly slower writes
- Faster reads (huge improvement)

---

### About indexing every column

Not effective:
- Slows insert/update
- Wastes storage

Stage 4
### Problem

Notifications fetched on every page load → DB overload

---

### Solutions

1. Pagination
- Fetch limited records

2. Caching (Redis)
- Cache unread notifications

3. Lazy Loading
- Load more on scroll

4. Background Jobs
- Move heavy tasks out of request cycle

---

### Tradeoffs

- Caching → memory usage
- Pagination → extra API calls
- Background jobs → complexity

Stage 5

### Problem in given code

- Sequential execution (very slow)
- Email API takes ~200ms per user
- Not scalable for 50,000 users

---

### Should DB + Email happen together?

No.

Reason:
- Email can fail
- DB should not depend on external service

---

### Solution: Asynchronous Queue

Flow:

API → Queue → Worker

Worker:
- Send email
- Save to DB
- Push notification

---

### Benefits

- Faster response
- Retry support
- Scalable
