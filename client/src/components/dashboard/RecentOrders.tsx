import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

const RecentOrders: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/recent-orders'],
    refetchOnWindowFocus: false,
  });

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div>
          <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
          <CardDescription>Last 5 orders across all channels.</CardDescription>
        </div>
        <Link href="/admin/orders">
          <a className="text-sm font-medium text-primary hover:text-primary/80 flex items-center">
            View all orders
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Link>
      </CardHeader>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <CardContent>
            <p className="text-red-500">Error loading recent orders.</p>
          </CardContent>
        ) : !data || data.length === 0 ? (
          <CardContent>
            <p className="text-gray-500">No recent orders found.</p>
          </CardContent>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customer?.fullName || 'Unknown'}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(order.status).bgColor} ${getStatusColor(order.status).textColor}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`}>
                      <a className="text-primary hover:text-primary/80">Details</a>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
};

export default RecentOrders;
