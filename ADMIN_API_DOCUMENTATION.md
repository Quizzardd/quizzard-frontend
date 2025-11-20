# Admin API Documentation

This document provides comprehensive documentation for all admin endpoints in the Quizard Backend API.

## Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://quizardbackend-production-c78c.up.railway.app`

## Authentication
All admin endpoints require:
1. **JWT Bearer Token** in the Authorization header
2. **Admin role** - User must have `role: "admin"`

### Header Format
```http
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents
1. [Groups Endpoints](#groups-endpoints)
2. [Users Endpoints](#users-endpoints)
3. [Plans Endpoints](#plans-endpoints)
4. [Analytics Endpoints](#analytics-endpoints)

---

## Groups Endpoints

### 1. Get All Groups (Admin Only)

Retrieve a list of all groups in the system.

**Endpoint**: `GET /api/v1/groups`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request**: No body required

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Advanced JavaScript Course",
      "coverUrl": "https://storage.googleapis.com/bucket/cover1.jpg",
      "owner": {
        "_id": "507f191e810c19729de860ea",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "inviteCode": "ABC123",
      "isArchived": false,
      "createdAt": "2025-11-15T10:30:00.000Z",
      "updatedAt": "2025-11-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Python for Beginners",
      "coverUrl": "https://storage.googleapis.com/bucket/cover2.jpg",
      "owner": {
        "_id": "507f191e810c19729de860eb",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com"
      },
      "inviteCode": "XYZ789",
      "isArchived": false,
      "createdAt": "2025-11-16T14:20:00.000Z",
      "updatedAt": "2025-11-16T14:20:00.000Z"
    }
  ]
}
```

**Error Responses**:

- **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Please login first"
}
```

- **403 Forbidden**:
```json
{
  "success": false,
  "message": "You are not authorized to access this route"
}
```

---

### 2. Delete Group (Permanently)

Permanently delete a group from the system. This is a hard delete that cannot be undone.

**Endpoint**: `DELETE /api/v1/groups/{id}/hard`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the group

**Request Example**:
```http
DELETE /api/v1/groups/507f1f77bcf86cd799439011/hard
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Group deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Advanced JavaScript Course",
    "isArchived": false
  }
}
```

**Error Responses**:

- **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Please login first"
}
```

- **403 Forbidden**:
```json
{
  "success": false,
  "message": "You are not authorized to access this route"
}
```

- **404 Not Found**:
```json
{
  "success": false,
  "message": "Group not found"
}
```

---

### 3. Archive Group (Soft Delete)

Soft delete a group by setting `isArchived: true`. The group can be restored later.

**Endpoint**: `DELETE /api/v1/groups/{id}`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the group

**Request Example**:
```http
DELETE /api/v1/groups/507f1f77bcf86cd799439011
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Group archived successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Advanced JavaScript Course",
    "isArchived": true
  }
}
```

**Error Responses**: Same as permanent delete

---

## Users Endpoints

### 1. Get All Users / Search Users (Admin Only)

Search for users in the system using a query parameter.

**Endpoint**: `GET /api/v1/users/search`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Query Parameters**:
- `q` (string, optional): Search query to filter users by name or email

**Request Example**:
```http
GET /api/v1/users/search?q=john
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f191e810c19729de860ea",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "user",
      "profilePicture": "https://storage.googleapis.com/bucket/profile1.jpg",
      "isEmailVerified": true,
      "subscriptions": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "plan": "Premium Plan",
          "status": "active"
        }
      ],
      "createdAt": "2025-10-01T08:00:00.000Z",
      "updatedAt": "2025-11-15T10:30:00.000Z"
    }
  ]
}
```

**Get All Users (without query)**:
```http
GET /api/v1/users/search
```

**Response**: Returns all users in the system

**Error Responses**:

- **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Please login first"
}
```

- **403 Forbidden**:
```json
{
  "success": false,
  "message": "You are not authorized to access this route"
}
```

---

### 2. Get User by ID (Admin Only)

Retrieve detailed information about a specific user.

**Endpoint**: `GET /api/v1/users/{id}`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the user

**Request Example**:
```http
GET /api/v1/users/507f191e810c19729de860ea
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "507f191e810c19729de860ea",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "role": "user",
    "profilePicture": "https://storage.googleapis.com/bucket/profile1.jpg",
    "isEmailVerified": true,
    "subscriptions": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "plan": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "Premium Plan",
          "price": 29.99,
          "credits": 100
        },
        "status": "active",
        "stripeSubscriptionId": "sub_1234567890",
        "credits": 85,
        "startDate": "2025-11-01T00:00:00.000Z",
        "endDate": "2025-12-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2025-10-01T08:00:00.000Z",
    "updatedAt": "2025-11-15T10:30:00.000Z"
  }
}
```

**Error Responses**:

- **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Please login first"
}
```

- **403 Forbidden**:
```json
{
  "success": false,
  "message": "You are not authorized to access this route"
}
```

- **404 Not Found**:
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 3. Delete User (Admin Only)

Permanently delete a user from the system. Admin users cannot be deleted.

**Endpoint**: `DELETE /api/v1/users/{id}`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the user

**Request Example**:
```http
DELETE /api/v1/users/507f191e810c19729de860ea
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "_id": "507f191e810c19729de860ea",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Error Responses**:

- **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Please login first"
}
```

- **403 Forbidden** (trying to delete admin user):
```json
{
  "success": false,
  "message": "Cannot delete admin users"
}
```

- **403 Forbidden** (not admin):
```json
{
  "success": false,
  "message": "You are not authorized to access this route"
}
```

- **404 Not Found**:
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Plans Endpoints

### 1. Get All Plans

Retrieve all subscription plans. This endpoint is public (no authentication required).

**Endpoint**: `GET /api/v1/plans`

**Headers**:
```http
Content-Type: application/json
```

**Request**: No body or authentication required

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Free Plan",
      "price": 0,
      "stripePriceId": "price_free",
      "credits": 10,
      "description": "Perfect for trying out the platform",
      "feature": [
        "5 quizzes per month",
        "Basic support"
      ],
      "isActive": true,
      "createdAt": "2025-09-01T00:00:00.000Z",
      "updatedAt": "2025-09-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Premium Plan",
      "price": 29.99,
      "stripePriceId": "price_1234567890",
      "credits": 100,
      "description": "Best for power users",
      "feature": [
        "Unlimited quizzes",
        "Priority support",
        "Advanced analytics"
      ],
      "isActive": true,
      "createdAt": "2025-09-01T00:00:00.000Z",
      "updatedAt": "2025-09-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Plan by ID

Retrieve a specific plan by its ID.

**Endpoint**: `GET /api/v1/plans/{id}`

**Headers**:
```http
Content-Type: application/json
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the plan

**Request Example**:
```http
GET /api/v1/plans/507f1f77bcf86cd799439014
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Premium Plan",
    "price": 29.99,
    "stripePriceId": "price_1234567890",
    "credits": 100,
    "description": "Best for power users",
    "feature": [
      "Unlimited quizzes",
      "Priority support",
      "Advanced analytics"
    ],
    "isActive": true,
    "createdAt": "2025-09-01T00:00:00.000Z",
    "updatedAt": "2025-09-01T00:00:00.000Z"
  }
}
```

**Error Responses**:

- **404 Not Found**:
```json
{
  "success": false,
  "message": "Plan not found"
}
```

---

### 3. Create Plan (Admin Only)

Create a new subscription plan.

**Endpoint**: `POST /api/v1/plans`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Business Plan",
  "price": 99.99,
  "stripePriceId": "price_business_123",
  "credits": 500,
  "description": "For teams and organizations",
  "feature": [
    "Unlimited everything",
    "24/7 priority support",
    "Custom integrations",
    "Dedicated account manager"
  ]
}
```

**Field Descriptions**:
- `name` (string, required): Name of the plan
- `price` (number, required): Price in USD
- `stripePriceId` (string, required): Stripe price ID for payment processing
- `credits` (number, required): Number of credits included in the plan
- `description` (string, optional): Description of the plan
- `feature` (array of strings, optional): List of features

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "name": "Business Plan",
    "price": 99.99,
    "stripePriceId": "price_business_123",
    "credits": 500,
    "description": "For teams and organizations",
    "feature": [
      "Unlimited everything",
      "24/7 priority support",
      "Custom integrations",
      "Dedicated account manager"
    ],
    "isActive": true,
    "createdAt": "2025-11-20T12:00:00.000Z",
    "updatedAt": "2025-11-20T12:00:00.000Z"
  }
}
```

**Error Responses**:

- **400 Validation Error**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

- **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Please login first"
}
```

---

### 4. Update Plan (Admin Only)

Update an existing subscription plan.

**Endpoint**: `PATCH /api/v1/plans/{id}`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the plan

**Request Body** (all fields optional):
```json
{
  "name": "Premium Plan (Updated)",
  "price": 34.99,
  "credits": 120,
  "description": "Updated description",
  "feature": [
    "Unlimited quizzes",
    "Priority support",
    "Advanced analytics",
    "New feature"
  ],
  "isActive": true
}
```

**Field Descriptions**:
- `name` (string, optional): Updated name
- `price` (number, optional): Updated price
- `credits` (number, optional): Updated credits
- `description` (string, optional): Updated description
- `feature` (array, optional): Updated feature list
- `isActive` (boolean, optional): Set to false to deactivate the plan

**Request Example**:
```http
PATCH /api/v1/plans/507f1f77bcf86cd799439014
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Plan updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Premium Plan (Updated)",
    "price": 34.99,
    "stripePriceId": "price_1234567890",
    "credits": 120,
    "description": "Updated description",
    "feature": [
      "Unlimited quizzes",
      "Priority support",
      "Advanced analytics",
      "New feature"
    ],
    "isActive": true,
    "createdAt": "2025-09-01T00:00:00.000Z",
    "updatedAt": "2025-11-20T12:30:00.000Z"
  }
}
```

**Error Responses**:

- **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Please login first"
}
```

- **404 Not Found**:
```json
{
  "success": false,
  "message": "Plan not found"
}
```

---

### 5. Delete Plan (Admin Only)

Delete a subscription plan from the system.

**Endpoint**: `DELETE /api/v1/plans/{id}`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId of the plan

**Request Example**:
```http
DELETE /api/v1/plans/507f1f77bcf86cd799439014
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Plan deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Premium Plan"
  }
}
```

**Error Responses**:

- **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Please login first"
}
```

- **404 Not Found**:
```json
{
  "success": false,
  "message": "Plan not found"
}
```

---

## Analytics Endpoints

### 1. Get Daily Login Statistics (Admin Only)

Retrieve daily login statistics showing unique users and total logins per day. Perfect for creating activity graphs in the admin dashboard.

**Endpoint**: `GET /api/v1/analytics/logins/daily`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Query Parameters**:
- `startDate` (string, optional): Start date in YYYY-MM-DD format (defaults to 30 days ago)
- `endDate` (string, optional): End date in YYYY-MM-DD format (defaults to today)
- `limit` (number, optional): Number of days to retrieve (default: 30)

**Request Examples**:

Get last 30 days (default):
```http
GET /api/v1/analytics/logins/daily
```

Get specific date range:
```http
GET /api/v1/analytics/logins/daily?startDate=2025-10-20&endDate=2025-11-20
```

Get last 7 days:
```http
GET /api/v1/analytics/logins/daily?limit=7
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "stats": [
      {
        "date": "2025-10-21",
        "uniqueUsers": 45,
        "totalLogins": 67
      },
      {
        "date": "2025-10-22",
        "uniqueUsers": 52,
        "totalLogins": 78
      },
      {
        "date": "2025-10-23",
        "uniqueUsers": 38,
        "totalLogins": 54
      },
      {
        "date": "2025-10-24",
        "uniqueUsers": 61,
        "totalLogins": 89
      },
      {
        "date": "2025-10-25",
        "uniqueUsers": 48,
        "totalLogins": 71
      },
      {
        "date": "2025-10-26",
        "uniqueUsers": 15,
        "totalLogins": 22
      },
      {
        "date": "2025-10-27",
        "uniqueUsers": 12,
        "totalLogins": 18
      },
      {
        "date": "2025-10-28",
        "uniqueUsers": 55,
        "totalLogins": 82
      }
    ],
    "summary": {
      "totalLogins": 1542,
      "totalUniqueUsers": 234,
      "dateRange": {
        "start": "2025-10-21",
        "end": "2025-11-20"
      }
    }
  }
}
```

**Field Descriptions**:
- `stats`: Array of daily statistics, includes days with zero activity
- `date`: Date in YYYY-MM-DD format
- `uniqueUsers`: Number of unique users who logged in that day
- `totalLogins`: Total number of login events (including multiple logins by same user)
- `summary.totalLogins`: Sum of all logins in the period
- `summary.totalUniqueUsers`: Count of unique users across the entire period
- `summary.dateRange`: The actual date range queried

**Error Responses**:

- **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Please login first"
}
```

- **403 Forbidden**:
```json
{
  "success": false,
  "message": "You are not authorized to access this route"
}
```

**Use Cases**:
- Display login activity graph on admin dashboard
- Track user engagement over time
- Identify peak usage days
- Monitor platform growth trends

---

### 2. Get Overall Platform Statistics (Admin Only)

Get comprehensive overview of platform statistics including total users, active users, and login metrics.

**Endpoint**: `GET /api/v1/analytics/overview`

**Headers**:
```http
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request**: No parameters required

**Request Example**:
```http
GET /api/v1/analytics/overview
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 850,
    "todayLogins": 234,
    "last7Days": {
      "totalLogins": 1456,
      "uniqueUsers": 542,
      "averageLoginsPerDay": 208
    },
    "last30Days": {
      "totalLogins": 5832,
      "uniqueUsers": 987,
      "averageLoginsPerDay": 194
    }
  }
}
```

**Field Descriptions**:
- `totalUsers`: Total number of registered users in the system
- `activeUsers`: Number of users with `isActive: true`
- `todayLogins`: Number of login events today
- `last7Days.totalLogins`: Total login events in last 7 days
- `last7Days.uniqueUsers`: Unique users who logged in during last 7 days
- `last7Days.averageLoginsPerDay`: Average daily logins over last 7 days
- `last30Days`: Same metrics for 30-day period

**Error Responses**:

- **401 Unauthorized**:
```json
{
  "success": false,
  "message": "Please login first"
}
```

- **403 Forbidden**:
```json
{
  "success": false,
  "message": "You are not authorized to access this route"
}
```

**Use Cases**:
- Dashboard overview cards/widgets
- Quick platform health check
- User engagement metrics
- Growth tracking

---

## Common Error Codes

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (not logged in)
- **403**: Forbidden (not admin)
- **404**: Not Found
- **500**: Internal Server Error

### Error Response Format
All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional, only for validation errors
}
```

---

## Testing with cURL Examples

### Get All Groups (Admin)
```bash
curl -X GET "http://localhost:3000/api/v1/groups" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Delete Group
```bash
curl -X DELETE "http://localhost:3000/api/v1/groups/507f1f77bcf86cd799439011/hard" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Search Users
```bash
curl -X GET "http://localhost:3000/api/v1/users/search?q=john" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Delete User
```bash
curl -X DELETE "http://localhost:3000/api/v1/users/507f191e810c19729de860ea" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Create Plan
```bash
curl -X POST "http://localhost:3000/api/v1/plans" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Business Plan",
    "price": 99.99,
    "stripePriceId": "price_business_123",
    "credits": 500,
    "description": "For teams",
    "feature": ["Unlimited everything", "24/7 support"]
  }'
```

### Update Plan
```bash
curl -X PATCH "http://localhost:3000/api/v1/plans/507f1f77bcf86cd799439014" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 34.99,
    "credits": 120
  }'
```

### Delete Plan
```bash
curl -X DELETE "http://localhost:3000/api/v1/plans/507f1f77bcf86cd799439014" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Get Daily Login Statistics
```bash
curl -X GET "http://localhost:3000/api/v1/analytics/logins/daily?limit=7" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Get Platform Overview Statistics
```bash
curl -X GET "http://localhost:3000/api/v1/analytics/overview" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Notes for Frontend Developers

1. **Authentication**: Always include the JWT token in the Authorization header for admin endpoints
2. **Error Handling**: Check the `success` field in responses and handle errors appropriately
3. **Admin Role**: Ensure the logged-in user has `role: "admin"` before accessing admin endpoints
4. **IDs Format**: All IDs are MongoDB ObjectIds (24-character hexadecimal strings)
5. **Dates**: All dates are in ISO 8601 format
6. **Plans**: The `stripePriceId` is required for Stripe integration - coordinate with backend for proper setup
7. **Soft Delete**: Groups use soft delete (archive) by default. Use `/hard` endpoint for permanent deletion
8. **User Deletion**: Admin users cannot be deleted for security reasons. Regular users are permanently deleted (hard delete)
9. **Analytics**: Login activity is automatically tracked on every successful login. Data includes IP address and user agent for security purposes
10. **Date Formats**: All dates use ISO 8601 format (YYYY-MM-DD) for consistency

---

## Frontend Integration Examples

### Creating a Login Activity Graph

The daily login statistics endpoint provides data in a format ready for charting libraries like Chart.js, Recharts, or ApexCharts.

**Example Response to Graph Mapping**:

```javascript
// Fetch data from API
const response = await fetch('http://localhost:3000/api/v1/analytics/logins/daily?limit=30', {
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  }
});

const { data } = await response.json();

// Transform for Chart.js
const chartData = {
  labels: data.stats.map(item => item.date), // ['2025-10-21', '2025-10-22', ...]
  datasets: [
    {
      label: 'Unique Users',
      data: data.stats.map(item => item.uniqueUsers), // [45, 52, 38, ...]
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
    {
      label: 'Total Logins',
      data: data.stats.map(item => item.totalLogins), // [67, 78, 54, ...]
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
    }
  ]
};

// Display summary stats in dashboard cards
console.log(`Total Logins: ${data.summary.totalLogins}`);
console.log(`Unique Users: ${data.summary.totalUniqueUsers}`);
```

**Example with Recharts (React)**:

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function LoginActivityChart({ data }) {
  return (
    <LineChart width={800} height={400} data={data.stats}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="uniqueUsers" stroke="#8884d8" name="Unique Users" />
      <Line type="monotone" dataKey="totalLogins" stroke="#82ca9d" name="Total Logins" />
    </LineChart>
  );
}
```

---

## Swagger Documentation

For interactive API testing, visit the Swagger UI:
- **Development**: http://localhost:3000/api-docs
- **Production**: https://quizardbackend-production-c78c.up.railway.app/api-docs

The Swagger interface allows you to:
- Test all endpoints interactively
- See request/response schemas
- Authenticate with your JWT token
- View all available parameters and examples
