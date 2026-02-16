import connectToDatabase from '@/lib/mongodb';
import Business, { IBusinessDocument } from '@/models/Business';
import mongoose, { SortOrder } from 'mongoose';

interface GetBusinessesParams {
  search?: string;
  category?: string;
  isOpen?: string;
  minRating?: string;
  sort?: string;
  page?: string;
  limit?: string;
  isAdmin?: string | boolean;
}

export async function getBusinesses(params: GetBusinessesParams) {
  try {
    await connectToDatabase();

    const search = params.search;
    const category = params.category;
    const isOpen = params.isOpen;
    const minRating = params.minRating;
    const sort = params.sort;
    const page = parseInt(params.page || '1') || 1;
    const limit = parseInt(params.limit || '12') || 12;
    const skip = (page - 1) * limit;

    const isAdmin = params.isAdmin === 'true' || params.isAdmin === true;
    
    // Default: Only show non-deleted. If Admin, show all (unless filtered otherwise)
    // Middleware handles isDeleted: { $ne: true } by default unless includeDeleted is set
    const query: any = {}; 

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
    let sortOptions: { [key: string]: SortOrder } = {};
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
    // @ts-ignore - setOptions definition
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
        // @ts-ignore
        createdAt: biz.createdAt?.toISOString(),
        // @ts-ignore
        updatedAt: biz.updatedAt?.toISOString(),
    }));

    // Aggregation for stats
    // Middleware does NOT apply to aggregate, so we must manually filter
    const matchStage = isAdmin ? {} : { isDeleted: { $ne: true } };
    
    // @ts-ignore
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

  } catch (error: any) {
    console.error('Fetch Error:', error);
    return { 
      success: false, 
      message: error.message, 
      data: [], 
      total: 0, 
      page: 1,
      pages: 0,
      openNowCount: 0, 
      avgRating: 0, 
      totalReviews: 0,
      deletedCount: 0
    };
  }
}
