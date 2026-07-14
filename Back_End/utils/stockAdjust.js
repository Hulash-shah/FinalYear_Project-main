const Product = require("../models/Product");

function statusFor(stock) {
  if (stock <= 0) return "Out of Stock";
  if (stock < 10) return "Low Stock";
  return "In Stock";
}

// Applies stock deltas for a set of line items. `sign` is +1 to add stock
// (e.g. a purchase/restock, or reversing a sale) or -1 to deduct it (e.g.
// a sale, or reversing a purchase).
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

module.exports = { adjustStock, statusFor };