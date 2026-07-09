const Customer = require('../models/customers');

exports.createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json({
            success: true,
            message: "Customer added successfully",
            data: customer
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate('agentId', 'name email phone');
        res.status(200).json({
            success: true,
            message: "Customers fetched successfully",
            data: customers
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSingleCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).populate('agentId', 'name email phone');
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, message: "Customer fetched successfully", data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, message: "Customer updated successfully", data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};