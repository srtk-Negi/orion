"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  autoTag: string;
  platform: string;
  frequency: "recurring" | "one-time";
}

const generateAnalyticsData = (): Transaction[] => {
  const platforms = [
    "Youtube",
    "Twitch",
    "Tiktok",
    "Amazon",
    "Shopify",
    "Venmo",
  ];
  const tags = [
    "payout",
    "subscription",
    "brand_deal",
    "affiliate_income",
    "sponsorship",
    "product_sales",
  ];
  const transactions: Transaction[] = [];

  for (let i = 1; i <= 100; i++) {
    const day = Math.floor(Math.random() * 30) + 1;
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const tag = tags[Math.floor(Math.random() * tags.length)];
    const isIncome = Math.random() > 0.15;
    const amount = isIncome
      ? Math.random() * 5000 + 100
      : Math.random() * 500 + 50;

    transactions.push({
      id: `txn-${i}`,
      date: `2025-04-${day.toString().padStart(2, "0")}`,
      amount: Math.round(amount * 100) / 100,
      type: isIncome ? "income" : "expense",
      autoTag: tag,
      platform: platform,
      frequency: Math.random() > 0.4 ? "recurring" : "one-time",
    });
  }

  return transactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
};

const transactions = generateAnalyticsData();

export function DataAnalytics() {
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "payout",
    "subscription",
    "brand_deal",
  ]);

  // Calculate total inflow and outflow
  const { totalInflow, totalOutflow, inflowChange, outflowChange } =
    useMemo(() => {
      const currentMonth = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const currentExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      // Mock previous month data (80% of current for demo)
      const prevInflow = currentMonth * 0.8;
      const prevOutflow = currentExpense * 0.9;

      return {
        totalInflow: currentMonth,
        totalOutflow: currentExpense,
        inflowChange: ((currentMonth - prevInflow) / prevInflow) * 100,
        outflowChange: ((currentExpense - prevOutflow) / prevOutflow) * 100,
      };
    }, []);

  // Recurring vs One-Time data
  const frequencyData = useMemo(() => {
    const recurring = transactions
      .filter((t) => t.frequency === "recurring" && t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const oneTime = transactions
      .filter((t) => t.frequency === "one-time" && t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    return [
      { name: "Recurring", value: recurring, fill: "var(--chart-1)" },
      { name: "One-Time", value: oneTime, fill: "var(--chart-2)" },
    ];
  }, []);

  // Top 5 categories by income
  const topCategories = useMemo(() => {
    const categoryTotals = transactions
      .filter((t) => t.type === "income")
      .reduce(
        (acc, t) => {
          acc[t.autoTag] = (acc[t.autoTag] || 0) + t.amount;
          return acc;
        },
        {} as Record<string, number>,
      );

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, []);

  // Average transaction size with trend
  const avgTransactionData = useMemo(() => {
    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const avgSize =
      incomeTransactions.reduce((sum, t) => sum + t.amount, 0) /
      incomeTransactions.length;

    // Group by week for trend
    const weeklyAvg = incomeTransactions.reduce(
      (acc, t) => {
        const week = `Week ${Math.ceil(new Date(t.date).getDate() / 7)}`;
        if (!acc[week]) acc[week] = { total: 0, count: 0 };
        acc[week].total += t.amount;
        acc[week].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    const trendData = Object.entries(weeklyAvg).map(([week, data]) => ({
      week,
      avg: data.total / data.count,
    }));

    return { avgSize, trendData };
  }, []);

  // Cash flow trend with toggleable tags
  const cashFlowData = useMemo(() => {
    const dailyData = transactions
      .filter((t) => t.type === "income")
      .reduce(
        (acc, t) => {
          const date = t.date;
          if (!acc[date]) {
            acc[date] = { date, total: 0 };
            selectedTags.forEach((tag) => {
              acc[date][tag] = 0;
            });
          }
          if (selectedTags.includes(t.autoTag)) {
            acc[date][t.autoTag] = (acc[date][t.autoTag] || 0) + t.amount;
          }
          acc[date].total += t.amount;
          return acc;
        },
        {} as Record<string, any>,
      );

    return Object.values(dailyData).sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [selectedTags]);

  const allTags = [
    "payout",
    "subscription",
    "brand_deal",
    "affiliate_income",
    "sponsorship",
    "product_sales",
  ];
  const tagColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--primary)",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="space-y-6">
      {/* Total Inflow & Outflow */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inflow</CardTitle>
            <div
              className={`flex items-center gap-1 text-xs ${inflowChange >= 0 ? "text-emerald-500" : "text-red-500"}`}
            >
              {inflowChange >= 0 ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(inflowChange).toFixed(1)}%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalInflow.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {inflowChange >= 0 ? "Up" : "Down"} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outflow</CardTitle>
            <div
              className={`flex items-center gap-1 text-xs ${outflowChange <= 0 ? "text-emerald-500" : "text-red-500"}`}
            >
              {outflowChange >= 0 ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(outflowChange).toFixed(1)}%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalOutflow.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {outflowChange <= 0 ? "Down" : "Up"} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recurring vs One-Time & Average Transaction Size */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recurring vs One-Time</CardTitle>
            <CardDescription>Income distribution by frequency</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={frequencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {frequencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">
                Average Transaction Size
              </CardTitle>
              <CardDescription className="mt-1">Weekly trend</CardDescription>
            </div>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-2xl font-bold">
              ${avgTransactionData.avgSize.toFixed(2)}
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={avgTransactionData.trendData}>
                  <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories by Income */}
      <Card>
        <CardHeader>
          <CardTitle>Top Categories by Income</CardTitle>
          <CardDescription>Top 5 auto tags by total income</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Bar
                dataKey="value"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cash Flow Trend with Tag Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cash Flow Trend</CardTitle>
              <CardDescription>Income over time by auto tag</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag, index) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-md border px-3 py-1 text-xs transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
                  }`}
                >
                  {tag.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              {selectedTags.map((tag, index) => (
                <Area
                  key={tag}
                  type="monotone"
                  dataKey={tag}
                  stackId="1"
                  stroke={tagColors[allTags.indexOf(tag)]}
                  fill={tagColors[allTags.indexOf(tag)]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
