const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// ======================
// GET ALL EXPENSES (only this user's)
// ======================
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch expenses" });
  }
});

// ======================
// CREATE EXPENSE
// ======================
router.post("/", async (req, res) => {
  try {
    const { title, description, category, amount, status, date } = req.body;

    if (!title || !category || !amount) {
      return res.status(400).json({ success: false, message: "Title, category and amount are required" });
    }

    const expense = await Expense.create({
      userId: req.user.id,
      title,
      description,
      category,
      amount: Number(amount),
      status,
      date,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create expense" });
  }
});

// ======================
// UPDATE EXPENSE (only if it belongs to this user)
// ======================
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.json({ success: true, data: expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update expense" });
  }
});

// ======================
// DELETE EXPENSE (only if it belongs to this user)
// ======================
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete expense" });
  }
});

module.exports = router;