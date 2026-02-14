import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';

export async function getBusinesses(params) {
  try {
    await connectToDatabase();

    const search = params.search;
    const category = params.category;
    const isOpen = params.isOpen;
    const minRating = params.minRating;
    const sort = params.sort;
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 12;
    const skip = (page - 1) * limit;

    const isAdmin = params.isAdmin === 'true' || params.isAdmin === true;
    
    // Default: Only show non-deleted. If Admin, show all (unless filtered otherwise)
    // Middleware handles isDeleted: { $ne: true } by default unless includeDeleted is set
    const query = {}; 

    // Search
    if (search) {
      query.$or = [
         { $text: { $search: search } }, 
         { businessName: { $regex: search, $options: 'i' } },
         { address: { $regex: search, $options: 'i' } },
         { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (category && category !== 'All') {
      query.category = category;
    }

    if (isOpen === 'true') {
      query.isOpenNow = true;
    }

    if (minRating) {
        query.rating = { $gte: parseFloat(minRating) };
    }

    // Sorting
    let sortOptions = {};
    if (sort === 'rating') {
        sortOptions = { rating: -1, reviewCount: -1 };
    } else if (sort === 'reviewCount') {
        sortOptions = { reviewCount: -1 };
    } else if (sort === 'name') {
        sortOptions = { businessName: 1 };
    } else {
        sortOptions = { createdAt: -1 }; // Default
    }

    // Set options to include deleted if admin
    const queryOptions = isAdmin ? { includeDeleted: true } : {};

    const businesses = await Business.find(query)
      .setOptions(queryOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(); // Faster for read-only

    // countDocuments also triggers middleware
    const total = await Business.countDocuments(query).setOptions(queryOptions);
    const openNowCount = await Business.countDocuments({ isOpenNow: true }).setOptions(queryOptions);
    
    // If Admin, also get deleted count specifically (needs includeDeleted: true to find them)
    let deletedCount = 0;
    if (isAdmin) {
        deletedCount = await Business.countDocuments({ isDeleted: true }).setOptions({ includeDeleted: true });
    }

    // Serialize _id and dates to plain objects for Next.js
    const serializedBusinesses = businesses.map(biz => ({
        ...biz,
        _id: biz._id.toString(),
        createdAt: biz.createdAt?.toISOString(),
        updatedAt: biz.updatedAt?.toISOString(),
    }));

    // Aggregation for stats
    // Middleware does NOT apply to aggregate, so we must manually filter
    const matchStage = isAdmin ? {} : { isDeleted: { $ne: true } };
    
    // Combine with other filters if necessary (usually stats are global or filtered by category? 
    // The current code didn't filter stats by search/category, just global stats? 
    // Actually, looking at previous code, it grouped by null (global). 
    // But usually you want stats for the *filtered* results? 
    // The original code was `Business.aggregate([{ $group: ... }])` which implies global stats of ALL businesses.
    // If we want global stats of non-deleted businesses:
    
    const stats = await Business.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: '$reviewCount' }
        }
      }
    ]);
    
    const avgRating = stats.length > 0 ? stats[0].avgRating : 0;
    const totalReviews = stats.length > 0 ? stats[0].totalReviews : 0;

    return {
      success: true,
      count: serializedBusinesses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: serializedBusinesses,
      openNowCount,
      deletedCount,
      avgRating,
      totalReviews
    };

  } catch (error) {
    console.error('Fetch Error:', error);
    return { success: false, message: error.message, data: [], total: 0, openNowCount: 0, avgRating: 0, totalReviews: 0 };
  }
}
