import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

const getStockColor = (percentage: number): string => {
  if (percentage >= 70) return "bg-primary";
  if (percentage >= 30) return "bg-yellow-500";
  return "bg-red-500";
};

const InventoryStatus: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/inventory-status'],
    refetchOnWindowFocus: false,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div>
          <CardTitle className="text-lg font-medium">Inventory Status</CardTitle>
          <CardDescription>Critical inventory levels across product categories.</CardDescription>
        </div>
        <Link href="/erp/inventory">
          <a className="text-sm font-medium text-primary hover:text-primary/80 flex items-center">
            Manage inventory
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-2 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-2 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-2 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-2 w-full mb-4" />
          </div>
        ) : error ? (
          <p className="text-red-500">Error loading inventory status.</p>
        ) : !data || data.length === 0 ? (
          <p className="text-gray-500">No inventory data available.</p>
        ) : (
          <div className="space-y-4">
            {data.map((item: any) => (
              <div key={item.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-sm font-medium text-foreground">{item.stockPercentage}%</span>
                </div>
                <Progress 
                  value={item.stockPercentage} 
                  className="h-2 bg-gray-200 dark:bg-gray-700"
                  indicatorClassName={getStockColor(item.stockPercentage)}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryStatus;
