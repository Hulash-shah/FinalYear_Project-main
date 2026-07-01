const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Find an existing customer by exact (case-insensitive) name match for this
// user, or create one from real details if none exists, so every invoice
// client is reflected on the Customers page as a proper CRM record.
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
    const { client, amount, dueDate, status, date, customerId, newCustomerEmail, newCustomerPhone, newCustomerCompany } = req.body;

    if (!client || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Client, amount and due date are required",
      });
    }

    // If the frontend already picked a customer from the dropdown, trust
    // that customerId. Otherwise, resolve/create one from the typed name
    // plus whatever contact details were entered for the new customer.
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
    });

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

    // Same auto-link/create logic on edit, in case the client name changed
    // and no customerId was explicitly provided.
    if (body.client && !body.customerId) {
      const customer = await resolveCustomer(req.user.id, body.client, {
        newCustomerEmail: body.newCustomerEmail,
        newCustomerPhone: body.newCustomerPhone,
        newCustomerCompany: body.newCustomerCompany,
      });
      body.customerId = customer._id;
    }

    const updated = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
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