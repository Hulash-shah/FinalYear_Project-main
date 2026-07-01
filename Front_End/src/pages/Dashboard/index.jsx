import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import RevenueChart from './RevenueChart';
import ActivityFeed from './ActivityFeed';
import LowStockAlert from './LowStockAlert';
import { C } from '../../theme/colors';
import { fmt } from '../../utils/formatters';

export default function DashboardPage({ data, setActivePage }) {
  // Total revenue = sum of Paid invoices, not the static mock revenueData,
  // so this number (and the chart below) move whenever a real invoice is
  // created/marked Paid on the Finance page.
  const totalRevenue = data.invoices
    .filter(i => i.status === "Paid")
    .reduce((a, b) => a + b.amount, 0);

  const activeEmployees = data.employees.filter(e => e.status === "Active").length;
  const pendingInvoices = data.invoices.filter(i => i.status === "Pending" || i.status === "Overdue").length;

  const lowStock = data.inventory.filter(i => i.stock < i.minStock);

  // Category breakdown for the pie chart — built from real expense
  // categories (invoices don't have a "category" field, only expenses do),
  // instead of the static mock data.salesData.
  const CHART_COLORS = [C.accent, C.info, C.warning, C.success, C.danger, "#a855f7", "#14b8a6"];
  const categoryTotals = {};
  data.expenses
    .filter(e => e.status !== "Rejected")
    .forEach(e => {
      const key = e.category || "Uncategorized";
      categoryTotals[key] = (categoryTotals[key] || 0) + e.amount;
    });
  const categorySum = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const categoryData = Object.entries(categoryTotals).map(([name, amt]) => ({
    name,
    value: categorySum ? Math.round((amt / categorySum) * 100) : 0,
  }));


  // Build the Revenue vs Expenses chart from real invoices/expenses,
  // grouped by month — same logic as the Finance page chart.
  const monthKey = (d) => {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
  };
  const monthLabel = (key) => {
    const [y, m] = key.split("-");
    return new Date(Number(y), Number(m) - 1, 1).toLocaleString("default", { month: "short" });
  };

  const monthMap = {};
  const touchMonth = (date) => {
    const key = monthKey(date);
    if (!monthMap[key]) monthMap[key] = { key, month: monthLabel(key), revenue: 0, expenses: 0 };
    return monthMap[key];
  };

  data.invoices
    .filter(i => i.status === "Paid")
    .forEach(i => { touchMonth(i.date || i.createdAt).revenue += i.amount; });

  data.expenses
    .filter(e => e.status !== "Rejected")
    .forEach(e => { touchMonth(e.date || e.createdAt).expenses += e.amount; });

  const revenueChartData = Object.values(monthMap)
    .sort((a, b) => a.key.localeCompare(b.key));

  // Recent activity, generated from the latest real invoices/expenses
  // instead of a hardcoded list, so it reflects what's actually happened.
  const recentActivity = [...data.invoices, ...data.expenses]
    .map(item => {
      const isInvoice = "client" in item;
      const ts = new Date(item.date || item.createdAt);
      return {
        text: isInvoice
          ? `Invoice ${item.invoiceNumber || ""} for ${item.client} is ${item.status}`.trim()
          : `Expense "${item.title}" recorded (${item.status})`,
        time: ts.toLocaleDateString(),
        type: isInvoice
          ? (item.status === "Paid" ? "success" : item.status === "Overdue" ? "warning" : "info")
          : (item.status === "Approved" ? "success" : item.status === "Rejected" ? "warning" : ""),
        ts,
      };
    })
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 5);

  return (
    <div className="page-content" style={{ padding: "28px 28px", overflowY: "auto", flex: 1 }}>
       <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", color: C.text, margin: "0 0 8px 0" }}>Dashboard</h1>
                    <p style={{ color: C.textMuted, margin: "0 0 24px 1", fontSize: "1rem" }}>Welcome back! Here's what's happening today.</p>
      {/* <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today."/> */}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard
          label="Total Revenue (YTD)"
          value= {fmt(totalRevenue)}
          change="+12.4%"
          icon= "rupee"
          color={C.accent}
          onClick={() => setActivePage("finance")}
        />
        <StatCard
          label="Active Employees"
          value={activeEmployees}
          change="+2"
          icon="employees"
          color={C.info}
          onClick={() => setActivePage("employees")}
        />
        <StatCard
          label="Pending Invoices"
          value={pendingInvoices}
          change={pendingInvoices > 2 ? "+1" : "-1"}
          icon="rupee"
          color={C.warning}
          onClick={() => setActivePage("finance")}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <RevenueChart data={revenueChartData} />
        <Card
          onClick={() => setActivePage("finance")}
          style={{ cursor: "pointer" }}
        >
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: 16 }}>Expenses by Category</h3>
          {categoryData.length === 0 ? (
            <p style={{ color: C.textMuted, fontSize: "0.85rem", padding: "20px 0" }}>No expense data yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {categoryData.map((e, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 8, color: C.text, fontSize: 12 }}
                    formatter={v => [`${v}%`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 4 }}>
                {categoryData.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length], display: "inline-block" }}/>
                    <span style={{ fontSize: "0.75rem", color: C.textMuted }}>{s.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        <ActivityFeed activities={recentActivity} onViewAll={() => setActivePage("finance")} />

        {/* <Card style={{ cursor: "default" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: 14 }}>Project Progress</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {data.projects.filter(p => p.status !== "Completed").slice(0, 4).map(p => (
              <div key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: "0.8rem", color: C.text }}>{p.name}</span>
                  <span style={{ fontSize: "0.75rem", color: C.textMuted }}>{p.progress}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: "#2a2a2a" }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 3,
                      width: `${p.progress}%`,
                      background: p.progress > 75 ? C.success : p.progress > 40 ? C.accent : C.warning,
                      transition: "width 0.3s"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card> */}

        <LowStockAlert items={lowStock} onViewAll={() => setActivePage("store")} />
      </div>
    </div>
  );
}