const express = require('express');
const router = express.Router();

const {
    createAgent,
    getAgents,
    getSingleAgent,
    updateAgent,
    deleteAgent
} = require('../controllers/agentsController');

router.post('/', createAgent);
router.get('/', getAgents);
router.get('/:id', getSingleAgent);
router.patch('/:id', updateAgent);
router.delete('/:id', deleteAgent);

module.exports = router;