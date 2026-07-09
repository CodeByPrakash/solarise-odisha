```text
#Setup

Make sure your .env has MONGO_URI pointing to a real MongoDB (Atlas or local), then run npm install and npm run dev. You should see MongoDB connected successfully and Server running on port 5000.
In Postman, create a new Environment with one variable: baseUrl = http://localhost:5000/api. Use {{baseUrl}} in every request below.
Optional but recommended: create a Collection called "Solarise Odisha" with three folders — Agents, Customers, Documentation Cases.

For every POST/PATCH request: method + body, set Body → raw → JSON in Postman.

Step 1 — Create an Agent
POST {{baseUrl}}/api/agents
json{
  "name": "Om Prakash",
  "email": "om@solarise.com",
  "address": "Bhubaneswar, Odisha",
  "phone": 9876543210
}
Response data._id → save this as Postman variable agentId (Postman → Tests tab of this request, add: pm.environment.set("agentId", pm.response.json().data._id); so it auto-fills for you every time you run it).
Step 2 — Create a Customer
POST {{baseUrl}}/customers
json{
  "name": "Sita Devi",
  "phone": 9998887771,
  "customerNumber": 1001,
  "geolocation": { "latitude": 20.27, "longitude": 85.84 },
  "aadhaarNumber": 123456789012,
  "agentId": "{{agentId}}"
}
Same trick — in Tests tab: pm.environment.set("customerId", pm.response.json().data._id);
Step 3 — Create a Documentation Case
POST {{baseUrl}}/documentation-cases
json{
  "customerId": "{{customerId}}",
  "agentId": "{{agentId}}"
}
Status starts at new_registration. In Tests tab: pm.environment.set("caseId", pm.response.json().data._id);
Step 4 — Walk it through Section A
PATCH {{baseUrl}}/documentation-cases/{{caseId}}/status
json{ "status": "docs_requested", "note": "Requested Aadhaar and passbook copy" }
Then repeat with "status": "docs_verified", then "status": "work_in_progress". Each call appends to statusHistory — check the response to see the trail building up.
Step 5 — Try Case 1: Ownership Transfer
PATCH {{baseUrl}}/documentation-cases/{{caseId}}/ownership-transfer
json{ "rorStatus": "alive" }
Response should show caseType: "ownership_transfer" and a documents array auto-filled with Aadhaar of Beneficiary, NOC, Form 1, Self Undertaking. Try "rorStatus": "dead" on a different case to see Death Certificate + Legal Heir Certificate instead.
Step 6 — Verify a document
Grab a document's _id from the case response (data.documents[0]._id), then:
PATCH {{baseUrl}}/documentation-cases/{{caseId}}/documents/{documentId}
json{ "uploaded": true, "documentUrl": "https://example.com/aadhaar.pdf", "verified": true }
Step 7 — Section C: Agent action item
POST {{baseUrl}}/documentation-cases/{{caseId}}/action-items
json{
  "title": "Electric bill name correction",
  "category": "name_correction",
  "targetDocument": "Electric Bill",
  "assignedTo": "{{agentId}}"
}
Grab the returned action item's _id, then move it along:
PATCH {{baseUrl}}/documentation-cases/{{caseId}}/action-items/{actionItemId}
json{ "status": "wip" }
Step 8 — Process fee + PSA agreement (closes the case)
PATCH {{baseUrl}}/documentation-cases/{{caseId}}/process-fee
json{ "amount": 2500 }
PATCH {{baseUrl}}/documentation-cases/{{caseId}}/psa-agreement
json{ "documentUrl": "https://example.com/psa-agreement.pdf" }
Case status should now read psa_agreement_done.
Step 9 — List & filter
GET {{baseUrl}}/documentation-cases — all cases, populated with customer/agent summary
GET {{baseUrl}}/documentation-cases?status=work_in_progress — filter by status
GET {{baseUrl}}/documentation-cases?caseType=ownership_transfer — filter by case type
GET {{baseUrl}}/documentation-cases/{{caseId}} — single case, fully populated
```