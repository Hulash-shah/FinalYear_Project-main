const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,        // snapshot of product name at time of purchase
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitCost: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    supplier: {
      type: String,
      required: true,
      trim: true,
    },

    purchaseNumber: {
      type: String,
      trim: true,
      default: () => `PO-${Date.now()}`,
    },

    items: {
      type: [purchaseItemSchema],
      required: true,
      validate: v => Array.isArray(v) && v.length > 0,
    },

    // Total cost, derived from items but stored for fast reporting/queries.
    totalCost: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Purchase", purchaseSchema);