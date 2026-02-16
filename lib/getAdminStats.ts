import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import User from '@/models/User';
import UploadLog from '@/models/UploadLog';

export async function getAdminStats() {
  await dbConnect();

  try {
    // 1. Total Users
    const totalUsers = await User.countDocuments();

    // 2. Active Users (Placeholder logic)
    const activeUsers = totalUsers; 

    // 3. Users With Access
    const usersWithAccess = await User.countDocuments({ hasDataAccess: true });

    // 4. Soft Deleted Businesses
    const softDeletedBusinesses = await Business.countDocuments({ isDeleted: true });

    // 5. Categories Count
    const categoriesBox = await Business.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$category' } },
      { $count: 'count' }
    ]);
    const categoriesCount = categoriesBox.length > 0 ? categoriesBox[0].count : 0;

    // 6. Businesses Added Today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const businessesAddedToday = await Business.countDocuments({
      createdAt: { $gte: startOfDay },
      isDeleted: false
    });

    // 7. Businesses Deleted Today
    const businessesDeletedToday = await Business.countDocuments({
      deletedAt: { $gte: startOfDay },
      isDeleted: true
    });
    
    // --- Charts Data ---

    // A. Businesses by Category
    const businessesByCategory = await Business.aggregate([
        { $match: { isDeleted: false } }, 
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 } 
    ]);

    // B. Business Ratings Distribution
    const ratingDistribution = await Business.aggregate([
        { $match: { isDeleted: false } },
        { 
            $project: { 
                ratingRange: { 
                    $switch: {
                        branches: [
                            { case: { $gte: ["$rating", 4.5] }, then: "4.5 - 5" },
                            { case: { $gte: ["$rating", 4] }, then: "4 - 4.5" },
                            { case: { $gte: ["$rating", 3] }, then: "3 - 4" },
                            { case: { $gte: ["$rating", 2] }, then: "2 - 3" },
                            { case: { $gte: ["$rating", 1] }, then: "1 - 2" },
                        ],
                        default: "Unrated"
                    } 
                } 
            } 
        },
        { $group: { _id: "$ratingRange", count: { $sum: 1 } } }
    ]);

     // C. Uploads Over Time (Last 7 days)
     const last7Days = new Date();
     last7Days.setDate(last7Days.getDate() - 7);
     
     const uploadsOverTime = await UploadLog.aggregate([
        { $match: { createdAt: { $gte: last7Days } } },
        { 
            $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                count: { $sum: 1 },
                records: { $sum: "$recordsInserted" }
            } 
        },
        { $sort: { _id: 1 } }
     ]);

     // D. Active vs Deleted
     const activeCount = await Business.countDocuments({ isDeleted: false });
     const deletedCount = await Business.countDocuments({ isDeleted: true });

    return {
      stats: {
        totalUsers,
        activeUsers,
        usersWithAccess,
        softDeletedBusinesses,
        categoriesCount,
        businessesAddedToday,
        businessesDeletedToday
      },
      charts: {
        businessesByCategory,
        ratingDistribution,
        uploadsOverTime,
        businessStatus: { active: activeCount, deleted: deletedCount }
      }
    };

  } catch (error) {
    console.error("Error fetching stats:", error);
    throw new Error('Failed to fetch statistics');
  }
}
