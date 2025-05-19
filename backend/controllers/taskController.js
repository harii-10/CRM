const Task = require('../models/task');

const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, relatedTo, relatedToModel } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      relatedTo,
      relatedToModel,
      assignedTo: req.user.id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name')
      .populate('relatedTo');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: id, assignedTo: req.user.id },
      updates,
      { new: true }
    );
    if (!task) {
      throw Object.assign(new Error('Task not found'), { status: 404 });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, updateTask };