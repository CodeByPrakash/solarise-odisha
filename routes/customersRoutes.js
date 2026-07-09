const express = require('express');
const router = express.Router();

const {
    createCustomer,
    getCustomers,
    getSingleCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customersController');

router.post('/', createCustomer);
router.get('/', getCustomers);
router.get('/:id', getSingleCustomer);
router.patch('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;