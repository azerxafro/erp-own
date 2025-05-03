import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingBag, UserPlus, Package, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  linkText: string;
  linkHref: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  linkText,
  linkHref,
}) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 ${iconBgColor} rounded-md`}>
              <div className={`h-6 w-6 ${iconColor}`}>{icon}</div>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-semibold text-foreground">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
        <div className="text-sm">
          <Link href={linkHref}>
            <a className="font-medium text-primary hover:text-primary/80 flex items-center">
              {linkText}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

const StatCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center">
          <Skeleton className="h-12 w-12 rounded-md" />
          <div className="ml-5 w-0 flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-7 w-32" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
        <Skeleton className="h-4 w-20" />
      </CardFooter>
    </Card>
  );
};

const StatCards: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-8">
        <p className="text-red-600 dark:text-red-400">Error loading dashboard statistics.</p>
      </div>
    );
  }

  const { totalRevenue, totalOrders, newCustomers, inventoryItems } = data;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue || 0)}
        icon={<DollarSign />}
        iconBgColor="bg-primary/10"
        iconColor="text-primary"
        linkText="View all"
        linkHref="/erp/finance"
      />
      <StatCard
        title="Total Orders"
        value={totalOrders?.toString() || "0"}
        icon={<ShoppingBag />}
        iconBgColor="bg-secondary/10"
        iconColor="text-secondary"
        linkText="View all"
        linkHref="/admin/orders"
      />
      <StatCard
        title="New Customers"
        value={newCustomers?.toString() || "0"}
        icon={<UserPlus />}
        iconBgColor="bg-accent/10"
        iconColor="text-accent"
        linkText="View all"
        linkHref="/crm/customers"
      />
      <StatCard
        title="Inventory Items"
        value={inventoryItems?.toString() || "0"}
        icon={<Package />}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        linkText="View all"
        linkHref="/erp/inventory"
      />
    </div>
  );
};

export default StatCards;
