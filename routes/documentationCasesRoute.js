const express = require('express');
const router = express.Router();

const {
    createCase,
    getCases,
    getSingleCase,
    updateStatus,
    setOwnershipTransfer,
    addDocument,
    updateDocument,
    addActionItem,
    updateActionItem,
    markProcessFeePaid,
    markPsaAgreementDone,
    deleteCase
} = require('../controllers/documentationCasesController');

// Core case CRUD
router.post('/', createCase);
router.get('/', getCases);
router.get('/:id', getSingleCase);
router.delete('/:id', deleteCase);

// Section A: lifecycle transitions
router.patch('/:id/status', updateStatus);
router.patch('/:id/process-fee', markProcessFeePaid);
router.patch('/:id/psa-agreement', markPsaAgreementDone);

// Section B: Case 1 - Ownership Transfer
router.patch('/:id/ownership-transfer', setOwnershipTransfer);

// Documents checklist
router.post('/:id/documents', addDocument);
router.patch('/:id/documents/:documentId', updateDocument);

// Section C: Agent action items
router.post('/:id/action-items', addActionItem);
router.patch('/:id/action-items/:actionItemId', updateActionItem);

module.exports = router;