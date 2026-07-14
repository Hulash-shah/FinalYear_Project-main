const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,       // snapshot of product name at time of sale
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: Number,       // snapshot of unit price at time of sale
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },

    client: {
      type: String,
      required: true,
      trim: true,
    },

    invoiceNumber: {
      type: String,
      trim: true,
      default: () => `INV-${Date.now()}`,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      default: "Pending",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    dueDate: Date,

    description: String,

    // Optional — only present when this invoice was created from Store
    // products. When present, stock is auto-decremented on create and
    // reversed on delete/edit.
    items: {
      type: [invoiceItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);