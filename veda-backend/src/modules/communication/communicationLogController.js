const CommunicationLog = require('./communicationLogModel');
const Student = require('../student/studentModels');
const Teacher = require('../teacher/teacherModel');
const Staff = require('../staff/staffModels');
const Parent = require('../parents/parentModel');

// Get communication logs
exports.getCommunicationLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, userModel, action, startDate, endDate } = req.query;

    const query = {};
    
    if (userId && userModel) {
      query.user = userId;
      query.userModel = userModel;
    }
    if (action) query.action = action;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await CommunicationLog.find(query)
      .populate('user', 'personalInfo.name personalInfo.email')
      .populate('target')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommunicationLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching communication logs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Get logs for a specific user
exports.getUserLogs = async (req, res) => {
  try {
    const { userId, userModel } = req.params;
    const { page = 1, limit = 10, action, startDate, endDate } = req.query;

    const query = { user: userId, userModel: userModel };
    
    if (action) query.action = action;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await CommunicationLog.find(query)
      .populate('target')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommunicationLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching user logs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Get communication statistics
exports.getCommunicationStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Total logs
    const totalLogs = await CommunicationLog.countDocuments(query);

    // Logs by action
    const logsByAction = await CommunicationLog.aggregate([
      { $match: query },
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]);

    // Logs by user model
    const logsByUserModel = await CommunicationLog.aggregate([
      { $match: query },
      { $group: { _id: '$userModel', count: { $sum: 1 } } }
    ]);

    // Logs by target model
    const logsByTargetModel = await CommunicationLog.aggregate([
      { $match: { ...query, targetModel: { $exists: true } } },
      { $group: { _id: '$targetModel', count: { $sum: 1 } } }
    ]);

    // Daily activity for the last 30 days
    const dailyActivity = await CommunicationLog.aggregate([
      {
        $match: {
          ...query,
          timestamp: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Most active users
    const mostActiveUsers = await CommunicationLog.aggregate([
      { $match: query },
      { $group: { _id: { user: '$user', userModel: '$userModel' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLogs,
        logsByAction,
        logsByUserModel,
        logsByTargetModel,
        dailyActivity,
        mostActiveUsers
      }
    });
  } catch (error) {
    console.error('Error fetching communication stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Get activity summary for dashboard
exports.getActivitySummary = async (req, res) => {
  try {
    const { userId, userModel } = req.params;
    const { days = 7 } = req.query;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Recent activity
    const recentActivity = await CommunicationLog.find({
      user: userId,
      userModel: userModel,
      timestamp: { $gte: startDate }
    })
      .populate('target')
      .sort({ timestamp: -1 })
      .limit(10);

    // Activity counts
    const activityCounts = await CommunicationLog.aggregate([
      {
        $match: {
          user: userId,
          userModel: userModel,
          timestamp: { $gte: startDate }
        }
      },
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]);

    // Daily activity
    const dailyActivity = await CommunicationLog.aggregate([
      {
        $match: {
          user: userId,
          userModel: userModel,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        recentActivity,
        activityCounts,
        dailyActivity,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error fetching activity summary:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Create a log entry (for internal use)
exports.createLog = async (req, res) => {
  try {
    const {
      user,
      userModel,
      action,
      target,
      targetModel,
      details,
      ipAddress,
      userAgent,
      sessionId
    } = req.body;

    const logData = {
      user,
      userModel,
      action,
      target,
      targetModel,
      details,
      ipAddress,
      userAgent,
      sessionId,
      timestamp: new Date()
    };

    const log = await CommunicationLog.create(logData);

    res.status(201).json({
      success: true,
      message: 'Log created successfully',
      data: log
    });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// Delete old logs (cleanup)
exports.deleteOldLogs = async (req, res) => {
  try {
    const { days = 90 } = req.query;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await CommunicationLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} old logs`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting old logs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
