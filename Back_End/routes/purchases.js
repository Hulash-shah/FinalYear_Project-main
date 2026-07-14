const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const { adjustStock } = require("../utils/stockAdjust");

// Get all purchases for the logged-in user
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: purchases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create purchase (restock) — increments stock for each item
router.post("/", async (req, res) => {
  try {
    const { supplier, purchaseNumber, items, date, notes } = req.body;

    if (!supplier || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Supplier and at least one item are required.",
      });
    }

    const totalCost = items.reduce((sum, it) => sum + (it.unitCost * it.quantity), 0);

    const purchase = await Purchase.create({
      userId: req.user.id,
      supplier,
      purchaseNumber,
      items,
      totalCost,
      date,
      notes,
    });

    // Restock: add quantity to each product's stock.
    await adjustStock(purchase.items, +1, req.user.id);

    res.status(201).json({ success: true, data: purchase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update purchase — reconciles stock difference (old items reversed, new items applied)
router.put("/:id", async (req, res) => {
  try {
    const existing = await Purchase.findOne({ _id: req.params.id, userId: req.user.id });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Purchase not found" });
    }

    const body = { ...req.body };
    if (Array.isArray(body.items)) {
      body.totalCost = body.items.reduce((sum, it) => sum + (it.unitCost * it.quantity), 0);
    }

    const updated = await Purchase.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      body,
      { new: true, runValidators: true }
    );

    if (Array.isArray(body.items)) {
      // Reverse old restock, then apply new restock.
      await adjustStock(existing.items, -1, req.user.id);
      await adjustStock(updated.items, +1, req.user.id);
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete purchase — reverses the restock (deducts stock back out)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Purchase.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Purchase not found" });
    }

    await adjustStock(deleted.items, -1, req.user.id);

    res.json({ success: true, message: "Purchase deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;