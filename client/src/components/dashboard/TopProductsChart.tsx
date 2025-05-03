import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type Metric = 'revenue' | 'units';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <p className="font-medium text-sm">{data.productName}</p>
        <p className="text-sm">
          Revenue: {formatCurrency(data.revenue)}
        </p>
        <p className="text-sm">
          Units: {data.units}
        </p>
      </div>
    );
  }

  return null;
};

const TopProductsChart: React.FC = () => {
  const [metric, setMetric] = useState<Metric>('revenue');

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/top-products', metric],
    refetchOnWindowFocus: false,
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Top Products</h3>
          <div>
            <Select value={metric} onValueChange={(value) => setMetric(value as Metric)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">By Revenue</SelectItem>
                <SelectItem value="units">By Units Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="relative h-80">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          ) : error ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <p className="mt-1 text-sm text-red-500">Error loading product data</p>
              </div>
            </div>
          ) : !data || data.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <p className="mt-1 text-sm text-gray-500">No product data available</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  dataKey={metric}
                  nameKey="productName"
                >
                  {data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ paddingLeft: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProductsChart;
