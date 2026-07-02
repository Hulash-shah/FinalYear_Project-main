import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from '../../components/ui/Card';
import { C } from '../../theme/colors';
import { fmt } from '../../utils/formatters';

const RevenueChart = ({ data }) => (
  <Card>
    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700,  fontSize: "0.95rem", marginBottom: 16, color: C.text, }}>Revenue vs Expenses</h3>
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={C.accent} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={C.accent} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={C.danger} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={C.danger} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#222"/>
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
          tickFormatter={v => `₹${v / 1000}k`} 
        />
        <Tooltip 
          contentStyle={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 8, color: C.text, fontSize: 12 }} 
          formatter={v => [fmt(v)]} 
        />
        <Area type="monotone" dataKey="revenue" stroke={C.accent} strokeWidth={2} fill="url(#rev)" name="Revenue"/>
        <Area type="monotone" dataKey="expenses" stroke={C.danger} strokeWidth={2} fill="url(#exp)" name="Expenses"/>
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);

export default RevenueChart;
