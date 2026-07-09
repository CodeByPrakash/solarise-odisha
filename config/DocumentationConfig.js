// Central constants for the Documentation Team module.
// Values here are taken directly from the "Documentation Team Comprehensive
// Workchecklist & Flow" chart, so this file IS the source of truth for what
// counts as a valid status/case type. When Section B grows new cases beyond
// "Case 1: Ownership Transfer", add them here first and everything else
// (model validation, controller checks) picks it up automatically.

// Section A: Internal Processes & Submissions (main lifecycle of every case)
const CASE_STATUSES = [
    'new_registration',   // New Registration (Not Verified)
    'docs_requested',     // Docs Requested
    'docs_verified',      // Docs Verified
    'work_in_progress',   // Work in Progress
    'process_fee_paid',   // Process fee paid
    'psa_agreement_done'  // PSA Agreement Done (final)
];

// Section B: Specialized Processes - which "case" this registration belongs to.
// 'standard' = no special handling, just walks through CASE_STATUSES.
const CASE_TYPES = [
    'standard',
    'ownership_transfer', // Case 1
    'name_correction',    // seen in the Agent Action Required list
    'com_dom'              // seen in the Agent Action Required list
];

// Case 1: "Are members listed in the ROR 'Alive' or 'Dead'?"
const ROR_STATUSES = ['alive', 'dead'];

// Case 1 requirement branches - auto-applied to a case's `documents` list
// once its ROR status is set.
const OWNERSHIP_TRANSFER_REQUIREMENTS = {
    alive: [
        'Aadhaar of Beneficiary',
        'NOC (No Objection Certificate)',
        'Form 1',
        'Self Undertaking'
    ],
    dead: [
        'Death Certificate',
        'Legal Heir Certificate'
    ]
};

// Section C: Agent Action Required & Inter-Departmental items.
// NOTE: the source chart's Section C text was partly garbled by OCR
// (e.g. "Bank poupon -> Zang connection"), so this list is my best-effort
// cleanup rather than a verbatim transcription. Categories are intentionally
// generic/open-ended (targetDocument is free text) so you can correct or
// add exact wording without touching any code.
const ACTION_ITEM_CATEGORIES = [
    'name_correction',   // e.g. Electric bill / bank passbook name correction
    'ownership_transfer',
    'com_dom',
    'bank_update',
    'other'
];

const ACTION_ITEM_STATUSES = [
    'action_required', // red - blocked on agent / inter-departmental action
    'wip',              // yellow gear - in progress
    'verified',         // green check
    'done'
];

module.exports = {
    CASE_STATUSES,
    CASE_TYPES,
    ROR_STATUSES,
    OWNERSHIP_TRANSFER_REQUIREMENTS,
    ACTION_ITEM_CATEGORIES,
    ACTION_ITEM_STATUSES
};