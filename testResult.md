## On Agents - http://localhost:5000/api/agents
---
POSTMAN:-
POST http://localhost:5000/api/agents
```text
{
  "name": "Om Prakash",
  "email": "om@solarise.com",
  "address": "Bhubaneswar, Odisha",
  "phone": 9876543210
}
```
---
```text
{
  "success": true,
  "message": "Agent fetched successfully",
  "data": [
    {
      "_id": "6a4fd3475f11f44404864d7a",
      "name": "Om Prakash",
      "email": "om@solarise.com",
      "address": "Bhubaneswar, Odisha",
      "phone": 9876543210,
      "__v": 0
    }
  ]
}
```

## On Customer
POST http://localhost:5000/api/customers
```text
{
  "name": "Sita Devi",
  "phone": 9998887771,
  "customerNumber": 1001,
  "geolocation": { "latitude": 20.27, "longitude": 85.84 },
  "aadhaarNumber": 123456789012,
  "agentId": "{{agentId}}" <-- passed "6a4fd3475f11f44404864d7a"
}
```
```text
{
  "success": true,
  "message": "Customers fetched successfully",
  "data": [
    {
      "geolocation": {
        "latitude": 20.27,
        "longitude": 85.84
      },
      "_id": "6a4fd3905f11f44404864d7b",
      "name": "Sita Devi",
      "phone": 9998887771,
      "customerNumber": 1001,
      "aadhaarNumber": 123456789012,
      "agentId": {
        "_id": "6a4fd3475f11f44404864d7a",
        "name": "Om Prakash",
        "email": "om@solarise.com",
        "phone": 9876543210
      },
      "createdAt": "2026-07-09T17:00:00.949Z",
      "updatedAt": "2026-07-09T17:00:00.949Z",
      "__v": 0
    }
  ]
}
```
## On Documentation-case
POST http://localhost:5000/api/documentation-cases
```text
{
  "customerId": "{{customerId}}", <-- Passed "6a4fd3905f11f44404864d7b"
  "agentId": "{{agentId}}" <-- passed "6a4fd3475f11f44404864d7a"
}
```
---
```text
{
  "success": true,
  "message": "Documentation cases fetched successfully",
  "count": 1,
  "data": [
    {
      "processFee": {
        "paid": false
      },
      "psaAgreement": {
        "done": false
      },
      "_id": "6a4fd3fe5f11f44404864d7c",
      "customerId": {
        "_id": "6a4fd3905f11f44404864d7b",
        "name": "Sita Devi",
        "phone": 9998887771,
        "customerNumber": 1001
      },
      "agentId": {
        "_id": "6a4fd3475f11f44404864d7a",
        "name": "Om Prakash",
        "email": "om@solarise.com",
        "phone": 9876543210
      },
      "status": "new_registration",
      "statusHistory": [
        {
          "status": "new_registration",
          "changedAt": "2026-07-09T17:01:50.958Z"
        }
      ],
      "caseType": "standard",
      "documents": [],
      "actionItems": [],
      "createdAt": "2026-07-09T17:01:50.961Z",
      "updatedAt": "2026-07-09T17:01:50.961Z",
      "__v": 0
    }
  ]
}
```
---