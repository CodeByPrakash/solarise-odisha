const mongoose = require('mongoose');
const {
    CASE_STATUSES,
    CASE_TYPES,
    ROR_STATUSES,
    ACTION_ITEM_CATEGORIES,
    ACTION_ITEM_STATUSES
} = require('../config/documentationConfig');

// A single required/uploaded document tracked against a case
// (Section A: Docs Requested -> Docs Verified, and Case 1 requirement lists)
const documentItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    required: {
        type: Boolean,
        default: true
    },
    uploaded: {
        type: Boolean,
        default: false
    },
    documentUrl: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date
    },
    remarks: {
        type: String
    }
}, { timestamps: true });

// Section C: Agent Action Required & Inter-Departmental checklist item
const actionItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ACTION_ITEM_CATEGORIES,
        default: 'other'
    },
    targetDocument: {
        type: String // e.g. "Electric Bill", "Bank Passbook"
    },
    status: {
        type: String,
        enum: ACTION_ITEM_STATUSES,
        default: 'action_required'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agents'
    },
    notes: {
        type: String
    }
}, { timestamps: true });

// Audit trail entry - drives the Agent <-> Doc Team WIP back-and-forth
// shown in the "Communication Flow" diagram.
const statusHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: CASE_STATUSES,
        required: true
    },
    note: {
        type: String
    },
    changedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const documentationCaseSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers',
        required: true
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agents',
        required: true
    },

    status: {
        type: String,
        enum: CASE_STATUSES,
        default: 'new_registration'
    },
    statusHistory: [statusHistorySchema],

    caseType: {
        type: String,
        enum: CASE_TYPES,
        default: 'standard'
    },

    // Section B - Case 1: Ownership Transfer
    ownershipTransfer: {
        rorStatus: {
            type: String,
            enum: ROR_STATUSES
        }
    },

    documents: [documentItemSchema],
    actionItems: [actionItemSchema],

    processFee: {
        amount: { type: Number },
        paid: { type: Boolean, default: false },
        paidAt: { type: Date }
    },

    psaAgreement: {
        done: { type: Boolean, default: false },
        doneAt: { type: Date },
        documentUrl: { type: String }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("DocumentationCase", documentationCaseSchema);