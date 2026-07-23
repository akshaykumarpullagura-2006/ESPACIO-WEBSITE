import Lead from '../models/Lead.js';
import Project from '../models/Project.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ActivityLog from '../models/ActivityLog.js';

/**
 * @desc    Get Admin Panel Dashboard summary metrics and analytical charts
 * @route   GET /api/dashboard/stats
 * @access  Private (Admin)
 */
export const getStats = async (req, res, next) => {
  try {
    // 1. Core Summary Metrics
    const totalLeads = await Lead.countDocuments({ softDelete: false });
    const newLeads = await Lead.countDocuments({ status: 'new', softDelete: false });
    const totalProjects = await Project.countDocuments({ softDelete: false });
    const totalProducts = await Product.countDocuments({ softDelete: false });
    const totalCategories = await Category.countDocuments({ softDelete: false });

    // 2. Leads breakdown by status
    const statusBreakdown = await Lead.aggregate([
      { $match: { softDelete: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 3. Leads growth breakdown by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyLeads = await Lead.aggregate([
      {
        $match: {
          softDelete: false,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly counts to clean array e.g., ["Jan", "Feb"]
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = monthlyLeads.map((m) => ({
      name: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      leads: m.count,
    }));

    // 4. Retrieve recent activity logs (last 10 edits/actions)
    const recentLogs = await ActivityLog.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalLeads,
          newLeads,
          totalProjects,
          totalProducts,
          totalCategories,
        },
        statusBreakdown,
        leadsChart: chartData,
        recentActivity: recentLogs,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Log a new administrative action to the audit logger
 * @route   POST /api/dashboard/logs
 * @access  Private (Admin)
 */
export const createLog = async (req, res, next) => {
  const { action, details } = req.body;
  if (!action) {
    return res.status(400).json({ success: false, message: 'Action is required' });
  }

  try {
    const log = await ActivityLog.create({
      user: req.user.id,
      action,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (err) {
    next(err);
  }
};
