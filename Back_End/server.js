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
const purchaseRoutes = require("./routes/purchases");
const expenseRoutes = require("./routes/expenses");
const reportRoutes = require("./routes/reports");

const app = express();

app.use(express.json());
app.use(cors({
  origin: "https://bizcore-peach.vercel.app",
  credentials: true
}));

app.use("/", authRoutes);
app.use("/api/employees", verifyToken, employeeRoutes);
app.use("/api/products", verifyToken, productRoutes);
app.use("/api/customers", verifyToken, customerRoutes);
app.use("/api/invoices", verifyToken, invoiceRoutes);
app.use("/api/purchases", verifyToken, purchaseRoutes);
app.use("/api/expenses", verifyToken, expenseRoutes);
app.use("/api/reports", verifyToken, reportRoutes);

mongoose.connect('mongodb://shahhulash_db_user:46t4Io4B6JU3V78t@ac-oni1z2g-shard-00-00.rmt0vta.mongodb.net:27017,ac-oni1z2g-shard-00-01.rmt0vta.mongodb.net:27017,ac-oni1z2g-shard-00-02.rmt0vta.mongodb.net:27017/?ssl=true&replicaSet=atlas-70hel3-shard-0&authSource=admin&appName=Cluster0')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

app.listen(5000, () => console.log('Server running on port 5000'));