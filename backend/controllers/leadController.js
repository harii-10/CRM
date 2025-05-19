const Lead = require('../models/lead');

const createLead = async (req, res, next) => {
  try {
    const { customer, source, stage, value } = req.body;
    const lead = new Lead({ customer, source, stage, value, assignedTo: req.user.id });
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({ assignedTo: req.user.id })
      .populate('customer', 'name email')
      .populate('assignedTo', 'name');
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const lead = await Lead.findOneAndUpdate(
      { _id: id, assignedTo: req.user.id },
      updates,
      { new: true }
    );
    if (!lead) {
      throw Object.assign(new Error('Lead not found'), { status: 404 });
    }
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

module.exports = { createLead, getLeads, updateLead };