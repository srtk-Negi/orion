"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { type Transaction } from "@/app/dashboard/page";

export function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const getAmountColor = (amount: number) => {
    if (amount > 0) return "text-emerald-400";
    if (amount < 0) return "text-red-400";
    return "text-muted-foreground";
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      payout: "bg-blue-100 text-blue-900 border-blue-200",
      subscription: "bg-purple-100 text-purple-900 border-purple-200",
      brand_deal: "bg-green-100 text-green-900 border-green-200",
      affiliate_income: "bg-orange-100 text-orange-900 border-orange-200",
      sponsorship: "bg-pink-100 text-pink-900 border-pink-200",
      product_sales: "bg-cyan-100 text-cyan-900 border-cyan-200",
    };
    return colors[tag] || "bg-gray-100 text-gray-900 border-gray-200";
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      YouTube: "bg-red-100 text-red-900 border-red-200",
      Twitch: "bg-purple-100 text-purple-900 border-purple-200",
      Tiktok: "bg-cyan-100 text-cyan-900 border-cyan-200",
      Amazon: "bg-orange-100 text-orange-900 border-orange-200",
      Shopify: "bg-green-100 text-green-900 border-green-200",
      Patreon: "bg-pink-100 text-pink-900 border-pink-200",
    };
    return colors[platform] || "bg-gray-100 text-gray-900 border-gray-200";
  };

  const getPaymentMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      PayPal: "bg-blue-100 text-blue-900 border-blue-200",
      ACH: "bg-indigo-100 text-indigo-900 border-indigo-200",
      Venmo: "bg-sky-100 text-sky-900 border-sky-200",
    };
    return colors[method] || "bg-gray-100 text-gray-900 border-gray-200";
  };

  const getStatusColor = (status: string) => {
    return status === "cleared"
      ? "bg-emerald-100 text-emerald-900 border-emerald-200"
      : "bg-amber-100 text-amber-900 border-amber-200";
  };

  return (
    <Card className="border-border/50 bg-card/50 overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-border/50 border-b">
              <th className="text-muted-foreground p-4 text-left text-sm font-semibold">
                Date & Time
              </th>
              <th className="text-muted-foreground p-4 text-left text-sm font-semibold">
                Transaction Name
              </th>
              <th className="text-muted-foreground p-4 text-left text-sm font-semibold">
                Platform
              </th>
              <th className="text-muted-foreground p-4 text-left text-sm font-semibold">
                Auto Tag
              </th>
              <th className="text-muted-foreground p-4 text-left text-sm font-semibold">
                Payment Method
              </th>
              <th className="text-muted-foreground p-4 text-center text-sm font-semibold">
                Currency
              </th>
              <th className="text-muted-foreground p-4 text-center text-sm font-semibold">
                Status
              </th>
              <th className="text-muted-foreground p-4 text-right text-sm font-semibold">
                Amount
              </th>
              <th className="text-muted-foreground p-4 text-center text-sm font-semibold">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-border/30 hover:bg-secondary/30 group border-b transition-all duration-200"
              >
                <td className="text-muted-foreground group-hover:text-foreground p-4 text-sm transition-colors">
                  <div className="flex flex-col">
                    <span>
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </td>
                <td className="group-hover:text-primary p-4 text-sm font-medium transition-colors">
                  {transaction.name}
                </td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={`${getPlatformColor(transaction.source)}`}
                  >
                    {transaction.source}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={`${getTagColor(transaction.autoTag)}`}
                  >
                    {transaction.autoTag.replace("_", " ")}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={`${getPaymentMethodColor(transaction.paymentMethod)}`}
                  >
                    {transaction.paymentMethod}
                  </Badge>
                </td>
                <td className="p-4 text-center">
                  <span className="text-muted-foreground text-sm">
                    {transaction.currency}
                  </span>
                </td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(transaction.status)}`}
                  >
                    {transaction.status}
                  </Badge>
                </td>
                <td
                  className={`p-4 text-right text-sm font-semibold ${getAmountColor(Number(transaction.amount))} transition-all duration-200`}
                >
                  $
                  {Math.abs(Number(transaction.amount)).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                    },
                  )}
                </td>
                <td className="p-4 text-center">
                  <Badge
                    variant={transaction.isRecurring ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {transaction.isRecurring ? "Recurring" : "One-Time"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-border/50 flex items-center justify-center gap-3 border-t p-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="bg-secondary/50 hover:bg-secondary flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:shadow-none"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <span className="text-muted-foreground min-w-[80px] text-center text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className="bg-secondary/50 hover:bg-secondary flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:shadow-none"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  );
}
