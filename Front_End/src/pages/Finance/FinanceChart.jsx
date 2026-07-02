import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from '../../components/ui/Card';
import { C } from '../../theme/colors';
import { fmt } from '../../utils/formatters';

const FinanceChart = ({ data }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", margin: "0 0 4px 0",color: C.text, }}>Financial Overview</h3>
        <p style={{ margin: 0, color: C.textMuted, fontSize: "0.85rem" }}>Revenue, Expenses, and Profit comparison (YTD)</p>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false}/>
        <XAxis 
          dataKey="month" 
          tick={{ fill: C.textMuted, fontSize: 11 }} 
          axisLine={false} 
          tickLine={false} 
        />
        <YAxis 
          tick={{ fill: C.textMuted, fontSize: 11 }} 
          axisLine={false} 
          tickLine={false} 
          tickFormatter={v => `$${v / 1000}k`} 
        />
        <Tooltip 
          contentStyle={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 8, color: C.text, fontSize: 13 }} 
          formatter={v => [fmt(v)]} 
          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
        />
        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px", color: C.textMuted }}/>
        <Bar dataKey="revenue" fill={C.accent} name="Revenue" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" fill={C.danger} name="Expenses" radius={[4, 4, 0, 0]} />
        <Bar dataKey="profit" fill={C.info} name="Net Profit" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

export default FinanceChart;
