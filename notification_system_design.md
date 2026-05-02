Stage 1
### Core Actions
- Fetch notifications
- Create notifications
- Mark as read

---

### 1. GET /notifications

Headers:
Authorization: Bearer <token>

Query params (optional):
- page
- limit
- isRead

Response:
[
  {
    "ID": "uuid",
    "Type": "Placement",
    "Message": "Company hiring",
    "Timestamp": "2026-04-22 17:51:18",
    "isRead": false
  }
]

---

### 2. POST /notifications

Request:
{
  "studentId": "1042",
  "Type": "Result",
  "Message": "Exam result declared"
}

---

### 3. PUT /notifications/:id/read

Purpose:
- Mark notification as read

---

### Real-Time Mechanism
- WebSockets (preferred) for push updates
- SSE as simpler alternative

Reason:
- Avoid polling, instant delivery


Stage 2

### Choice: MongoDB

Reasons:
- High write throughput (notifications are write-heavy)
- Flexible schema
- Easy horizontal scaling (sharding)

---

### Schema

Notification {
  _id: ObjectId,
  studentId: String,
  Type: String,        // Placement, Result, Event
  Message: String,
  isRead: Boolean,
  Timestamp: Date
}

---

### Scale Issues
- Large dataset → slow scans
- Hot users (many notifications)

---

### Solutions
- Indexing
- Sharding by studentId
- TTL index for old notifications (optional)

Stage 3

### Given Query

SELECT * FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt DESC;

---

### Issues
- Full table scan without index
- Sorting large result set

---

### Fix: Composite Index

(studentId, isRead, Timestamp DESC)

---

### Impact
- Reads become fast (index scan)
- Slight overhead on writes

---

### Why not index everything?
- Increases write latency
- Higher storage usage

Stage 4

### Problem
Fetching all notifications on every load → DB overload

---

### Solutions

1. Pagination
- limit + page/cursor

2. Caching (Redis)
- Cache unread counts / latest page

3. Lazy Loading
- Infinite scroll

4. Background Jobs
- Heavy processing off the request path

---

### Trade-offs
- Cache invalidation complexity
- Extra API calls for pagination
- Added infra (Redis/queues)

Stage 5

### Problem
Sequential email sending (~200ms/user) → not scalable

---

### Decision
DB write and Email sending should be decoupled

---

### Solution: Queue-based async processing

Flow:
API → Queue (Kafka/RabbitMQ) → Workers

Workers:
- Send Email
- Persist to DB
- Push real-time notification

---

### Benefits
- Fast API response
- Retry on failure
- Horizontal scalability


Stage 6 

### Goal
Return top N (e.g., 10) most important notifications based on:
1) Priority: Placement > Result > Event
2) Recency: latest first


- First sort by business priority (Placement > Result > Event)
- Then by Timestamp (descending)
- Time complexity: O(n log n)

For streaming/high-volume:
- Maintain a Min-Heap of size k (10)
- Complexity: O(n log k)