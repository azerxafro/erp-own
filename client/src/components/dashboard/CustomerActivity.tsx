import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { formatDateTime, getInitials, getRandomColor } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

const CustomerActivity: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/customer-activity'],
    refetchOnWindowFocus: false,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div>
          <CardTitle className="text-lg font-medium">Customer Activity</CardTitle>
          <CardDescription>Recent customer interactions and order status.</CardDescription>
        </div>
        <Link href="/crm">
          <a className="text-sm font-medium text-primary hover:text-primary/80 flex items-center">
            Open CRM
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-start">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500">Error loading customer activity.</p>
        ) : !data || data.length === 0 ? (
          <p className="text-gray-500">No recent customer activity.</p>
        ) : (
          <div className="space-y-4">
            {data.map((activity: any, index: number) => (
              <div key={activity.id} className="flex items-start">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={getRandomColor(index)}>
                      {getInitials(activity.customerName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-foreground">{activity.customerName}</h4>
                  <p className="text-sm text-gray-500">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(activity.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerActivity;
