const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const PDFDocument = require("pdfkit");

const Invoice = require("../models/Invoice");
const Expense = require("../models/Expense");
const Customer = require("../models/Customer");
const Employee = require("../models/Employee");
const Product = require("../models/Product");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Predefined report templates. Each maps to an instruction that gets
// combined with the summarized business data below.
const REPORT_TEMPLATES = {
  financial_summary: "Write a monthly financial summary covering total revenue, total expenses, net profit, outstanding/pending invoices, and any notable trends. Call out top expense categories and any invoices that are overdue.",
  customer_overview: "Write a customer relationship overview: how many customers by status (Lead/Active/Inactive/VIP), who the top customers are by total spend, and any customers with no recent purchases that might need follow-up.",
  expense_breakdown: "Write a detailed expense breakdown by category, including totals, percentage of overall spend, and any categories that stand out as high or unusual.",
  employee_report: "Write an employee/staffing report: headcount by department, active vs on-leave vs inactive, and total payroll cost.",
  inventory_status: "Write an inventory status report: total products, stock levels, which products are low or out of stock, and inventory value by category.",
};

// Pull and lightly summarize the user's real data. We aggregate rather than
// dump full raw records — keeps the prompt small and avoids sending more
// personal data than necessary to the AI provider.
async function summarizeBusinessData(userId) {
  const [invoices, expenses, customers, employees, products] = await Promise.all([
    Invoice.find({ userId }).lean(),
    Expense.find({ userId }).lean(),
    Customer.find({ userId }).lean(),
    Employee.find({ userId }).lean(),
    Product.find({ userId }).lean(),
  ]);

  const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((a, b) => a + b.amount, 0);
  const totalExpenses = expenses.filter(e => e.status !== "Rejected").reduce((a, b) => a + b.amount, 0);
  const pendingInvoiceAmt = invoices.filter(i => i.status === "Pending" || i.status === "Overdue").reduce((a, b) => a + b.amount, 0);
  const overdueInvoices = invoices.filter(i => i.status === "Overdue");

  const expenseByCategory = {};
  expenses.filter(e => e.status !== "Rejected").forEach(e => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
  });

  const customersByStatus = {};
  customers.forEach(c => { customersByStatus[c.status] = (customersByStatus[c.status] || 0) + 1; });

  const customerSpend = {};
  invoices.filter(i => i.status === "Paid" && i.customerId).forEach(i => {
    const key = i.customerId.toString();
    customerSpend[key] = (customerSpend[key] || 0) + i.amount;
  });
  const topCustomers = Object.entries(customerSpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, amt]) => {
      const c = customers.find(c => c._id.toString() === id);
      return { name: c ? c.name : "Unknown", totalSpent: amt };
    });

  const employeesByDept = {};
  employees.forEach(e => { employeesByDept[e.dept] = (employeesByDept[e.dept] || 0) + 1; });
  const totalPayroll = employees.filter(e => e.status !== "Inactive").reduce((a, b) => a + b.salary, 0);

  const lowStock = products.filter(p => p.status === "Low Stock" || p.status === "Out of Stock");
  const inventoryValue = products.reduce((a, b) => a + (b.price * b.stock), 0);

  return {
    revenue: { totalRevenue, totalExpenses, netProfit: totalRevenue - totalExpenses, pendingInvoiceAmt, overdueInvoiceCount: overdueInvoices.length },
    expenseByCategory,
    customers: { total: customers.length, byStatus: customersByStatus, topCustomers },
    employees: { total: employees.length, byDept: employeesByDept, totalPayroll },
    inventory: { totalProducts: products.length, lowStockCount: lowStock.length, lowStockItems: lowStock.map(p => ({ name: p.name, stock: p.stock })), inventoryValue },
  };
}

router.post("/generate", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: "GEMINI_API_KEY is not configured on the server." });
    }

    const { reportType, customPrompt } = req.body;

    if (!reportType && !customPrompt) {
      return res.status(400).json({ success: false, message: "Provide a reportType or a customPrompt." });
    }

    const summary = await summarizeBusinessData(req.user.id);

    const instruction = reportType && REPORT_TEMPLATES[reportType]
      ? REPORT_TEMPLATES[reportType]
      : customPrompt;

    const extraContext = reportType && customPrompt ? `\n\nAdditional instructions from the user: ${customPrompt}` : "";

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(
      `You are a business analyst writing a report for a small business owner. Use only the data provided below — do not invent numbers. Write in clear prose with short section headers, no markdown symbols like # or *, since this will be rendered directly into a PDF.

Task: ${instruction}${extraContext}

Business data (JSON):
${JSON.stringify(summary, null, 2)}`
    );

    const reportText = result.response.text();

    // Render the text into a simple, clean PDF.
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="report-${Date.now()}.pdf"`);
      res.send(pdfBuffer);
    });

    doc.fontSize(20).text("Business Report", { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#666").text(new Date().toLocaleDateString());
    doc.moveDown(1.5);
    doc.fillColor("#000").fontSize(11);

    reportText.split("\n").forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        doc.moveDown(0.5);
        return;
      }
      // Lines that look like headers (short, no trailing period) get bolded.
      const looksLikeHeader = trimmed.length < 60 && !trimmed.endsWith(".") && trimmed === trimmed.replace(/^[-•]\s*/, "");
      if (looksLikeHeader) {
        doc.moveDown(0.5).font("Helvetica-Bold").fontSize(13).text(trimmed);
        doc.font("Helvetica").fontSize(11);
      } else {
        doc.text(trimmed, { align: "left" });
      }
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Failed to generate report" });
  }
});

module.exports = router;