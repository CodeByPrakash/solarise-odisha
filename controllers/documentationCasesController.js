const DocumentationCase = require('../models/documentationCases');
const {
    CASE_STATUSES,
    ROR_STATUSES,
    OWNERSHIP_TRANSFER_REQUIREMENTS,
    ACTION_ITEM_STATUSES
} = require('../config/documentationConfig');

// POST /api/documentation-cases
// Kicks off Section A: "New Registration (Not Verified)"
exports.createCase = async (req, res) => {
    try {
        const { customerId, agentId, caseType } = req.body;

        if (!customerId || !agentId) {
            return res.status(400).json({
                success: false,
                message: "customerId and agentId are required"
            });
        }

        const docCase = await DocumentationCase.create({
            customerId,
            agentId,
            caseType: caseType || 'standard',
            statusHistory: [{ status: 'new_registration' }]
        });

        res.status(201).json({
            success: true,
            message: "Documentation case created successfully",
            data: docCase
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/documentation-cases?status=&caseType=&agentId=&customerId=
exports.getCases = async (req, res) => {
    try {
        const { status, caseType, agentId, customerId } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (caseType) filter.caseType = caseType;
        if (agentId) filter.agentId = agentId;
        if (customerId) filter.customerId = customerId;

        const cases = await DocumentationCase.find(filter)
            .populate('customerId', 'name phone customerNumber')
            .populate('agentId', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Documentation cases fetched successfully",
            count: cases.length,
            data: cases
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/documentation-cases/:id
exports.getSingleCase = async (req, res) => {
    try {
        const docCase = await DocumentationCase.findById(req.params.id)
            .populate('customerId')
            .populate('agentId', 'name email phone');

        if (!docCase) {
            return res.status(404).json({ success: false, message: "Documentation case not found" });
        }

        res.status(200).json({
            success: true,
            message: "Documentation case fetched successfully",
            data: docCase
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/documentation-cases/:id/status   { status, note }
// Moves a case along Section A (or back a step if docs get rejected, etc.)
exports.updateStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        if (!CASE_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${CASE_STATUSES.join(', ')}`
            });
        }

        const docCase = await DocumentationCase.findById(req.params.id);
        if (!docCase) {
            return res.status(404).json({ success: false, message: "Documentation case not found" });
        }

        docCase.status = status;
        docCase.statusHistory.push({ status, note });
        await docCase.save();

        res.status(200).json({ success: true, message: "Status updated successfully", data: docCase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/documentation-cases/:id/ownership-transfer   { rorStatus }
// Section B, Case 1: branches on "Are members listed in the ROR Alive or Dead?"
// and auto-seeds the matching required-documents list.
exports.setOwnershipTransfer = async (req, res) => {
    try {
        const { rorStatus } = req.body;

        if (!ROR_STATUSES.includes(rorStatus)) {
            return res.status(400).json({
                success: false,
                message: `rorStatus must be one of: ${ROR_STATUSES.join(', ')}`
            });
        }

        const docCase = await DocumentationCase.findById(req.params.id);
        if (!docCase) {
            return res.status(404).json({ success: false, message: "Documentation case not found" });
        }

        docCase.caseType = 'ownership_transfer';
        docCase.ownershipTransfer.rorStatus = rorStatus;

        const requiredNames = OWNERSHIP_TRANSFER_REQUIREMENTS[rorStatus];
        const existingNames = docCase.documents.map(d => d.name);
        requiredNames.forEach(name => {
            if (!existingNames.includes(name)) {
                docCase.documents.push({ name, required: true });
            }
        });

        await docCase.save();

        res.status(200).json({
            success: true,
            message: `Case marked as Ownership Transfer (ROR: ${rorStatus}); requirements added`,
            data: docCase
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/documentation-cases/:id/documents   { name, required }
exports.addDocument = async (req, res) => {
    try {
        const { name, required } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Document name is required" });
        }

        const docCase = await DocumentationCase.findById(req.params.id);
        if (!docCase) {
            return res.status(404).json({ success: false, message: "Documentation case not found" });
        }

        docCase.documents.push({ name, required: required !== undefined ? required : true });
        await docCase.save();

        res.status(201).json({ success: true, message: "Document added", data: docCase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/documentation-cases/:id/documents/:documentId   { uploaded, documentUrl, verified, remarks }
exports.updateDocument = async (req, res) => {
    try {
        const { uploaded, documentUrl, verified, remarks } = req.body;

        const docCase = await DocumentationCase.findById(req.params.id);
        if (!docCase) {
            return res.status(404).json({ success: false, message: "Documentation case not found" });
        }

        const document = docCase.documents.id(req.params.documentId);
        if (!document) {
            return res.status(404).json({ success: false, message: "Document entry not found" });
        }

        if (uploaded !== undefined) document.uploaded = uploaded;
        if (documentUrl !== undefined) document.documentUrl = documentUrl;
        if (remarks !== undefined) document.remarks = remarks;
        if (verified !== undefined) {
            document.verified = verified;
            document.verifiedAt = verified ? new Date() : undefined;
        }

        await docCase.save();

        res.status(200).json({ success: true, message: "Document updated", data: docCase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/documentation-cases/:id/action-items   { title, category, targetDocument, assignedTo, notes }
// Section C: Agent Action Required & Inter-Departmental
exports.addActionItem = async (req, res) => {
    try {
        const { title, category, targetDocument, assignedTo, notes } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: "Action item title is required" });
        }

        const docCase = await DocumentationCase.findById(req.params.id);
        if (!docCase) {
            return res.status(404).json({ success: false, message: "Documentation case not found" });
        }

        docCase.actionItems.push({ title, category, targetDocument, assignedTo, notes });
        await docCase.save();

        res.status(201).json({ success: true, message: "Action item added", data: docCase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/documentation-cases/:id/action-items/:actionItemId   { status, notes }
exports.updateActionItem = async (req, res) => {
    try {
        const { status, notes } = req.body;

        if (status && !ACTION_ITEM_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `status must be one of: ${ACTION_ITEM_STATUSES.join(', ')}`
            });
        }

        const docCase = await DocumentationCase.findById(req.params.id);
        if (!docCase) {
            return res.status(404).json({ success: false, message: "Documentation case not found" });
        }

        const item = docCase.actionItems.id(req.params.actionItemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Action item not found" });
        }

        if (status) item.status = status;
        if (notes !== undefined) item.notes = notes;

        await docCase.save();

        res.status(200).json({ success: true, message: "Action item updated", data: docCase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/documentation-cases/:id/process-fee   { amount }
exports.markProcessFeePaid = async (req, res) => {
    try {
        const { amount } = req.body;

        const docCase = await DocumentationCase.findById(req.params.id);
        if (!docCase) {
            return res.status(404).json({ success: false, message: "Documentation case not found" });
        }

        docCase.processFee.paid = true;
        docCase.processFee.paidAt = new Date();
        if (amount !== undefined) docCase.processFee.amount = amount;

        docCase.status = 'process_fee_paid';
        docCase.statusHistory.push({ status: 'process_fee_paid' });

        await docCase.save();

        res.status(200).json({ success: true, message: "Process fee marked as paid", data: docCase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/documentation-cases/:id/psa-agreement   { documentUrl }
// Final step of Section A - closes out the case.
exports.markPsaAgreementDone = async (req, res) => {
    try {
        const { documentUrl } = req.body;

        const docCase = await DocumentationCase.findById(req.params.id);
        if (!docCase) {
            return res.status(404).json({ success: false, message: "Documentation case not found" });
        }

        docCase.psaAgreement.done = true;
        docCase.psaAgreement.doneAt = new Date();
        if (documentUrl) docCase.psaAgreement.documentUrl = documentUrl;

        docCase.status = 'psa_agreement_done';
        docCase.statusHistory.push({ status: 'psa_agreement_done' });

        await docCase.save();

        res.status(200).json({
            success: true,
            message: "PSA agreement marked as done - case complete",
            data: docCase
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/documentation-cases/:id
exports.deleteCase = async (req, res) => {
    try {
        const docCase = await DocumentationCase.findByIdAndDelete(req.params.id);
        if (!docCase) {
            return res.status(404).json({ success: false, message: "Documentation case not found" });
        }
        res.status(200).json({ success: true, message: "Documentation case deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};