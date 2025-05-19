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
    const { stage, sortBy } = req.query;
    let query = { assignedTo: req.user.id };

    // Filter by stage if provided
    if (stage) {
      query.stage = stage;
    }

    // Build sort options
    let sort = {};
    if (sortBy === 'value') {
      sort.value = -1; // Sort by value descending
    } else if (sortBy === 'recent') {
      sort.createdAt = -1; // Sort by most recent
    } else {
      // Default sort
      sort.createdAt = -1;
    }

    const leads = await Lead.find(query)
      .sort(sort)
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

const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findOne({ _id: id, assignedTo: req.user.id })
      .populate('customer', 'name email company')
      .populate('assignedTo', 'name');

    if (!lead) {
      throw Object.assign(new Error('Lead not found'), { status: 404 });
    }

    res.json(lead);
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findOneAndDelete({ _id: id, assignedTo: req.user.id });

    if (!lead) {
      throw Object.assign(new Error('Lead not found'), { status: 404 });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createLead, getLeads, getLeadById, updateLead, deleteLead };