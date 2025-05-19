const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed'], 
    default: 'Pending' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  relatedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'relatedToModel', 
    required: true 
  },
  relatedToModel: { 
    type: String, 
    enum: ['Customer', 'Lead'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);