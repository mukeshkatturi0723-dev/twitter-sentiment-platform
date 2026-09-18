"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { TrendPoint } from "@/lib/api-client";

interface TrendLineChartProps {
  data: TrendPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-slate-700 text-xs shadow-xl space-y-1">
        <p className="font-semibold text-slate-200">{label}</p>
        <div className="space-y-0.5">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span style={{ color: entry.color }} className="capitalize font-medium">
                {entry.name}:
              </span>
              <span className="font-mono text-white font-semibold">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="neuGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
          />

          <Area
            type="monotone"
            dataKey="positive"
            name="Positive"
            stroke="#22c55e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#posGrad)"
          />
          <Area
            type="monotone"
            dataKey="neutral"
            name="Neutral"
            stroke="#f59e0b"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#neuGrad)"
          />
          <Area
            type="monotone"
            dataKey="negative"
            name="Negative"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#negGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
