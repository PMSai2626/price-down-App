"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPriceHistory } from "@/app/actions";
import { Loader2 } from "lucide-react";

export default function PriceChart({ productId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const history = await getPriceHistory(productId);

      const chartData = history.map((item) => ({
        date: item.checkedAt?.toDate
          ? item.checkedAt.toDate().toLocaleDateString()
          : new Date(item.checkedAt).toLocaleDateString(),
        price: Number(item.price),
      }));

      // If there's only one point, duplicate it so Recharts can draw a horizontal trendline
      if (chartData.length === 1) {
        chartData.push({
          date: "Current",
          price: chartData[0].price,
        });
      }

      setData(chartData);
      setLoading(false);
    }

    loadData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400 w-full">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading chart...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 w-full">
        No price history yet. Check back after the first update!
      </div>
    );
  }

  return (
    <div className="w-full">
      <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
        Price History
      </h4>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-zinc-800" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-gray-400 dark:text-gray-500"
            />

            <YAxis
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-gray-400 dark:text-gray-500"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#FA5D19"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}