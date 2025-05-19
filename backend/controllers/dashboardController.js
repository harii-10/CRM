const Customer = require('../models/customer');
const Lead = require('../models/lead');
const Task = require('../models/task');

const getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const customerCount = await Customer.countDocuments({ createdBy: req.user.id });
    const leadCount = await Lead.countDocuments({ assignedTo: req.user.id });
    const taskCount = await Task.countDocuments({ assignedTo: req.user.id });
    
    // Get tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasksDueToday = await Task.countDocuments({
      assignedTo: req.user.id,
      dueDate: { $gte: today, $lt: tomorrow },
      status: { $ne: 'Completed' }
    });
    
    // Get leads by stage
    const leadsByStage = await Lead.aggregate([
      { $match: { assignedTo: req.user.id } },
      { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$value' } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get recent activities
    const recentTasks = await Task.find({ assignedTo: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'relatedTo',
        select: 'name email'
      });
    
    const recentLeads = await Lead.find({ assignedTo: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name');
    
    res.json({
      counts: {
        customers: customerCount,
        leads: leadCount,
        tasks: taskCount,
        tasksDueToday
      },
      leadsByStage,
      recentActivities: {
        tasks: recentTasks,
        leads: recentLeads
      }
    });
  } catch (error) {
    next(error);
  }
};

const getLeadPerformance = async (req, res, next) => {
  try {
    // Get leads created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const leadPerformance = await Lead.aggregate([
      { 
        $match: { 
          assignedTo: req.user.id,
          createdAt: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
          },
          count: { $sum: 1 },
          value: { $sum: '$value' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(leadPerformance);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getLeadPerformance };
