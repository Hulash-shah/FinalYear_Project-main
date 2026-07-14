const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");
const Product = require("../models/Product");

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function resolveCustomer(userId, client, details = {}) {
  let customer = await Customer.findOne({
    userId,
    name: { $regex: `^${escapeRegex(client)}$`, $options: "i" },
  });

  if (!customer) {
    const email = details.newCustomerEmail
      || `${client.toLowerCase().replace(/[^a-z0-9]+/g, ".")}.${Date.now()}@placeholder.local`;

    customer = await Customer.create({
      userId,
      name: client,
      email,
      phone: details.newCustomerPhone || "",
      company: details.newCustomerCompany || "",
      status: "Lead",
    });
  }

  return customer;
}

// Refreshes a product's status field ("In Stock" / "Low Stock" / "Out of
// Stock") after its stock count changes, matching the logic in products.js.
function statusFor(stock) {
  if (stock <= 0) return "Out of Stock";
  if (stock < 10) return "Low Stock";
  return "In Stock";
}

// Applies stock deltas for a set of invoice items. `sign` is +1 to restore
// stock (e.g. on delete/cancel) or -1 to deduct it (e.g. on create/sale).
// Uses $inc for an atomic update, then recalculates status separately.
async function adjustStock(items, sign, userId) {
  for (const item of items) {
    const product = await Product.findOneAndUpdate(
      { _id: item.productId, userId },
      { $inc: { stock: sign * item.quantity } },
      { new: true }
    );
    if (product) {
      const clampedStock = Math.max(product.stock, 0);
      await Product.findByIdAndUpdate(product._id, {
        stock: clampedStock,
        status: statusFor(clampedStock),
      });
    }
  }
}

// Get all invoices for the logged-in user
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: invoices,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Create invoice
router.post("/", async (req, res) => {
  try {
    const {
      client, amount, dueDate, status, date,
      customerId, newCustomerEmail, newCustomerPhone, newCustomerCompany,
      items,
    } = req.body;

    if (!client || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Client, amount and due date are required",
      });
    }

    let finalCustomerId = customerId || undefined;
    if (!finalCustomerId) {
      const customer = await resolveCustomer(req.user.id, client, {
        newCustomerEmail, newCustomerPhone, newCustomerCompany,
      });
      finalCustomerId = customer._id;
    }

    const invoice = await Invoice.create({
      client,
      amount: Number(amount),
      dueDate,
      status,
      date,
      customerId: finalCustomerId,
      userId: req.user.id,
      items: Array.isArray(items) ? items : [],
    });

    // Deduct stock for each line item, if any were supplied.
    if (invoice.items.length > 0) {
      await adjustStock(invoice.items, -1, req.user.id);
    }

    res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Update invoice
router.put("/:id", async (req, res) => {
  try {
    const body = { ...req.body };

    if (body.client && !body.customerId) {
      const customer = await resolveCustomer(req.user.id, body.client, {
        newCustomerEmail: body.newCustomerEmail,
        newCustomerPhone: body.newCustomerPhone,
        newCustomerCompany: body.newCustomerCompany,
      });
      body.customerId = customer._id;
    }

    // Grab the invoice as it was BEFORE the update, so we can reverse its
    // old stock impact before applying the new one.
    const existing = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const updated = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      body,
      { new: true, runValidators: true }
    );

    // Only touch stock if items actually changed in this request.
    if (Array.isArray(body.items)) {
      // Step 1: restore stock from the OLD items (undo the original sale).
      if (existing.items.length > 0) {
        await adjustStock(existing.items, +1, req.user.id);
      }
      // Step 2: deduct stock for the NEW items (apply the updated sale).
      if (updated.items.length > 0) {
        await adjustStock(updated.items, -1, req.user.id);
      }
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Delete invoice
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Reverse the sale — restore stock for whatever was deducted at creation.
    if (deleted.items.length > 0) {
      await adjustStock(deleted.items, +1, req.user.id);
    }

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;