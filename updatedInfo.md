```text
Why this shape:

config/ — new folder, holds the enums (statuses, case types, ROR alive/dead requirements) in one place, taken straight from your workchecklist diagram. Both the model and controller import from here so nothing is hardcoded twice.
models/documentationCases.js — one DocumentationCase document per customer registration, referencing Customers and Agents by ObjectId (same pattern your customers.js already uses for agentId).
controllers/documentationCasesController.js — not just CRUD; it has dedicated endpoints for the workflow moves in your diagrams (updateStatus, setOwnershipTransfer, markProcessFeePaid, markPsaAgreementDone, action items for Section C).
```
