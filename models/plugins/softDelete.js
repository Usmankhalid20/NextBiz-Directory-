import mongoose from 'mongoose';

export default function softDeletePlugin(schema) {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  });

  const types = [
    'count',
    'countDocuments',
    'find',
    'findOne',
    'findOneAndUpdate',
    'update',
    'updateMany',
  ];

  types.forEach((type) => {
    schema.pre(type, function () {
      if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
      }
    });
  });

  schema.methods.softDelete = async function (userId) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    return this.save();
  };

  schema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    return this.save();
  };
}
