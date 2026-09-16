"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { BrandComparisonItem } from "@/lib/api-client";

interface ComparisonBarChartProps {
  data?: BrandComparisonItem[];
  brands?: BrandComparisonItem[];
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({ data, brands }) => {
  const items = data || brands || [];
  const chartData = items.map((d) => ({
    name: d.brand,
    Positive: d.positive_percentage,
    Neutral: d.neutral_percentage,
    Negative: d.negative_percentage,
    netScore: d.net_sentiment_score
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            unit="%"
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(val: number) => [`${val.toFixed(1)}%`, ""]}
            contentStyle={{
              backgroundColor: "#0d1320",
              borderColor: "#1e293b",
              borderRadius: "0.5rem",
              fontSize: "12px",
              color: "#f1f5f9"
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
          />
          <Bar dataKey="Positive" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Neutral" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Negative" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
