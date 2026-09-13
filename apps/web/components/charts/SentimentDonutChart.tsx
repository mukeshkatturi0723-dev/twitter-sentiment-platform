"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface SentimentDonutChartProps {
  positive: number;
  negative: number;
  neutral: number;
}

const COLORS = ["#22c55e", "#ef4444", "#94a3b8"];

export const SentimentDonutChart: React.FC<SentimentDonutChartProps> = ({
  positive,
  negative,
  neutral
}) => {
  const total = positive + negative + neutral;
  const data = [
    { name: "Positive", value: positive },
    { name: "Negative", value: negative },
    { name: "Neutral", value: neutral },
  ];

  const posPct = total > 0 ? ((positive / total) * 100).toFixed(0) : "0";

  return (
    <div className="flex flex-col items-center justify-center relative w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            stroke="transparent"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: number) => [`${val} tweets`, ""]}
            contentStyle={{
              backgroundColor: "#0d1320",
              borderColor: "#1e293b",
              borderRadius: "0.5rem",
              fontSize: "12px",
              color: "#f1f5f9"
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Statistic */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
        <span className="text-2xl font-extrabold text-white tracking-tight">
          {posPct}%
        </span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
          Positive
        </span>
      </div>

      {/* Legend below */}
      <div className="flex items-center justify-center gap-4 text-xs mt-[-10px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Pos ({positive})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Neg ({negative})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          <span>Neu ({neutral})</span>
        </div>
      </div>
    </div>
  );
};
