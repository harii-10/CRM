const Customer = require('../models/customer');

const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, company } = req.body;
    const customer = new Customer({ name, email, phone, company, createdBy: req.user.id });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({ createdBy: req.user.id }).populate('createdBy', 'name');
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const customer = await Customer.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      updates,
      { new: true }
    );
    if (!customer) {
      throw Object.assign(new Error('Customer not found'), { status: 404 });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

const addInteraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, notes } = req.body;
    const customer = await Customer.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { $push: { interactions: { type, notes } } },
      { new: true }
    );
    if (!customer) {
      throw Object.assign(new Error('Customer not found'), { status: 404 });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

module.exports = { createCustomer, getCustomers, updateCustomer, addInteraction };