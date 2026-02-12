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

    const businesses = await Business.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(); // Faster for read-only

    const total = await Business.countDocuments(query);
    const openNowCount = await Business.countDocuments({ isOpenNow: true });

    // Serialize _id and dates to plain objects for Next.js
    const serializedBusinesses = businesses.map(biz => ({
        ...biz,
        _id: biz._id.toString(),
        createdAt: biz.createdAt?.toISOString(),
        updatedAt: biz.updatedAt?.toISOString(),
    }));

    // Aggregation for stats
    const stats = await Business.aggregate([
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
      avgRating,
      totalReviews
    };

  } catch (error) {
    console.error('Fetch Error:', error);
    return { success: false, message: error.message, data: [], total: 0, openNowCount: 0, avgRating: 0, totalReviews: 0 };
  }
}
