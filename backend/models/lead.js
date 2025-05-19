const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  source: { type: String, enum: ['website', 'referral', 'event', 'other'], required: true },
  stage: { 
    type: String, 
    enum: ['Prospect', 'Qualified', 'Proposal', 'Closed'], 
    default: 'Prospect' 
  },
  value: { type: Number, default: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lead', leadSchema);