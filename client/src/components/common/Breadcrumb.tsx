
import React from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItemProps {
  href?: string;
  label: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
  className?: string;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ href, label, active }) => {
  if (active || !href) {
    return (
      <span className={cn(
        "text-sm",
        active ? "text-foreground font-medium" : "text-muted-foreground"
      )}>
        {label}
      </span>
    );
  }

  return (
    <Link href={href}>
      <button className="text-sm text-muted-foreground hover:text-primary text-left">
        {label}
      </button>
    </Link>
  );
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  if (items.length === 0) return null;

  return (
    <div className={cn("mb-6 flex items-center text-sm", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <BreadcrumbItem 
            href={item.href} 
            label={item.label} 
            active={index === items.length - 1}
          />
          {index < items.length - 1 && (
            <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
