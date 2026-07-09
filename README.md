Task Initiative Done. Make Sure All Contribute and commit changes.

New Structure 
solarise-odisha/
├── config/
│   └── documentationConfig.js          ✅ done — shared enums/constants (statuses, case types, doc requirements)
├── models/
│   ├── agents.js                        (existing)
│   ├── customers.js                     (existing)
│   └── documentationCases.js           ✅ done — the Mongoose schema
├── controllers/
│   ├── agentsController.js              (existing)
│   ├── customersController.js           (existing, empty)
│   └── documentationCasesController.js ✅ done — CRUD + workflow-transition logic
├── routes/
│   ├── agentsRoute.js                   (existing, empty)
│   ├── customersRoutes.js               (existing, empty)
│   └── documentationCasesRoute.js      ⏳ next — wires controller functions to URLs
└── server.js                            ⏳ next — needs 2 lines added to mount the new route