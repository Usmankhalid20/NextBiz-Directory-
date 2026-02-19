import { Schema } from 'mongoose';

export default function softDeletePlugin(schema: Schema) {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  });

  // @ts-ignore - Mongoose types for middleware are a bit tricky with `this` context
  schema.pre(/^find/, function (next) {
    // @ts-ignore
    if (this.getOptions().includeDeleted) {
    // @ts-ignore
    return next();
    }
    // Filter out soft-deleted docs by default
    // @ts-ignore
    this.where({ isDeleted: { $ne: true } });
    // @ts-ignore
    next();
  });
}
