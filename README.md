# 🚀 BizCore – Business Management System

BizCore is a full-stack **Business Management System** developed as a **Final Year Project** to streamline and centralize business operations. The system integrates multiple business functionalities such as employee management, product/store management, financial tracking, authentication, and system settings into a single platform.

Built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**, BizCore demonstrates practical implementation of full-stack development concepts along with Data Structures and Algorithms.

---

## 📌 Project Overview

Managing business data across multiple systems can be inefficient and time-consuming. BizCore provides a centralized solution that allows users to manage business operations through an intuitive web interface.

The system includes:

* 🔐 User Authentication
* 📊 Dashboard
* 👥 Employee Management
* 🛒 Store/Product Management
* 💰 Finance Management
* ⚙️ Settings Management
* 🔍 Product Sorting & Searching

---

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* Protected Routes
* Secure API Communication

### 📊 Dashboard

* Business overview
* Easy navigation across modules
* User-friendly interface

### 👥 Employee Management

* Add Employees
* Update Employee Details
* Delete Employees
* View Employee Records

### 🛒 Store Management

Manage products under categories such as:

* Shoes
* Clothing
* Sports Gear

Features include:

* Add Products
* Update Products
* Delete Products
* Search Products

### 💰 Finance Module

* Finance Tracking
* Business Records Management
* NPR (Nepalese Rupees) Currency Support

### ⚙️ Settings

* Application Configurations
* User Preferences

---

## 🧠 Algorithms Used

This project demonstrates the implementation of Data Structures and Algorithms in a real-world application.

### Merge Sort

Used for sorting product data efficiently.

**Time Complexity:**

```text
O(n log n)
```

### Binary Search

Used for searching products in sorted datasets.

**Time Complexity:**

```text
O(log n)
```

API Example:

```text
/api/products/sorted
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* Mongoose

### Tools

* Git
* GitHub
* VS Code
* npm

---

## 🏗️ System Architecture

```text
User
   │
   ▼
React Frontend (Port: 5173)
   │
   ▼
Express + Node.js Backend (Port: 5000)
   │
   ▼
MongoDB Database
```

---

## 📁 Project Structure

```text
FinalYear_Project-main/
│
├── Back_End/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── package.json
│   └── ...
│
├── Front_End/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/Hulash-shah/FinalYear_Project-main.git
cd FinalYear_Project-main
```

---

### 2. Backend Setup

```bash
cd Back_End
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/businessDB
PORT=5000
JWT_SECRET=your_secret_key
```

Run Backend:

```bash
npm start
```

Backend:

```text
http://localhost:5000
```

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd Front_End
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🗄️ Database

BizCore uses **MongoDB** for storing:

* User Information
* Employee Records
* Product Data
* Finance Information
* Application Settings

Database Name:

```text
businessDB
```

---

## 🔄 Application Flow

```text
User
   │
   ▼
React Frontend
   │
HTTP Request
   │
   ▼
Node.js + Express Backend
   │
Database Operations
   │
   ▼
MongoDB
   │
Response
   │
   ▼
Frontend
```

---

## 🎓 Academic Purpose

This project was developed as a **Final Year Project** to demonstrate:

* Full-Stack Web Development
* REST API Development
* Database Design
* Authentication Systems
* Data Structures & Algorithms
* Software Engineering Concepts

---

## 👨‍💻 Developer

**Hulash Shah**

B.Sc. CSIT Student
Interested in:

* Artificial Intelligence
* Machine Learning
* Data Science
* Full Stack Development

GitHub: https://github.com/Hulash-shah

---

⭐ If you found this project useful, consider giving it a star!
