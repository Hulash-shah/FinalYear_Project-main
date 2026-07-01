require('dotenv').config();   // ← must be first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const verifyToken = require("./middleware/auth");
const productRoutes = require("./routes/products");
const customerRoutes = require("./routes/customers");
const invoiceRoutes = require("./routes/invoices");
const expenseRoutes = require("./routes/expenses");
const reportRoutes = require("./routes/reports");

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/", authRoutes);
app.use("/api/employees", verifyToken, employeeRoutes);
app.use("/api/products", verifyToken, productRoutes);
app.use("/api/customers", verifyToken, customerRoutes);
app.use("/api/invoices", verifyToken, invoiceRoutes);
app.use("/api/expenses", verifyToken, expenseRoutes);
app.use("/api/reports", verifyToken, reportRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/businessDB')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

app.listen(5000, () => console.log('Server running on port 5000'));