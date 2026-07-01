const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional link to a real Customer record (used by customers.js to
    // aggregate totalSpent). Not required, because invoices can be created
    // from the Finance page just by typing a client name.
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },

    // Free-text client name, matches what AddInvoiceModal actually collects.
    client: {
      type: String,
      required: true,
      trim: true,
    },

    invoiceNumber: {
      type: String,
      trim: true,
      // Auto-generate one if the frontend doesn't supply it.
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

    // Issue date, shown in InvoicesList as "Iss: ..."
    date: {
      type: Date,
      default: Date.now,
    },

    dueDate: Date,

    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);