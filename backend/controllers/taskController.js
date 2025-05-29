const Task = require('../models/task');

const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, status, priority, relatedTo } = req.body;

    // Handle the relatedTo structure from frontend
    let taskData = {
      title,
      description,
      dueDate,
      status: status || 'Not Started',
      priority: priority || 'Medium',
      assignedTo: req.user.id,
    };

    // Handle relatedTo field - it comes as an object with type and id
    if (relatedTo && relatedTo.type && relatedTo.type !== 'none' && relatedTo.id) {
      taskData.relatedTo = relatedTo.id;
      taskData.relatedToModel = relatedTo.type === 'customer' ? 'Customer' : 'Lead';
    }

    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { status, dueDate, relatedToModel } = req.query;
    let query = { assignedTo: req.user.id };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by related model type if provided
    if (relatedToModel) {
      query.relatedToModel = relatedToModel;
    }

    // Filter by due date
    if (dueDate === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query.dueDate = { $gte: today, $lt: tomorrow };
    } else if (dueDate === 'week') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      query.dueDate = { $gte: today, $lt: nextWeek };
    } else if (dueDate === 'overdue') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.dueDate = { $lt: today };
      query.status = { $ne: 'Completed' };
    }

    const tasks = await Task.find(query)
      .sort({ dueDate: 1 })
      .populate('assignedTo', 'name')
      .populate({
        path: 'relatedTo',
        select: 'name email company stage',
      });

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

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, assignedTo: req.user.id })
      .populate('assignedTo', 'name')
      .populate({
        path: 'relatedTo',
        select: 'name email company stage',
      });

    if (!task) {
      throw Object.assign(new Error('Task not found'), { status: 404 });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, assignedTo: req.user.id });

    if (!task) {
      throw Object.assign(new Error('Task not found'), { status: 404 });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };