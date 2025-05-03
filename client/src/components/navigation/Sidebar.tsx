import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Users,
  Factory,
  BarChart2,
  ShoppingBag,
  ClipboardList,
  UserCircle,
  FileEdit,
  Settings,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface NavGroupProps {
  label: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, active, onClick }) => {
  return (
    <Link href={href}>
      <button
        type="button"
        className={cn(
          "sidebar-link flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-left",
          active 
            ? "bg-primary/10 text-primary border-l-3 border-primary" 
            : "text-foreground hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
        onClick={onClick}
      >
        <div className="h-5 w-5 mr-3">{icon}</div>
        {label}
      </button>
    </Link>
  );
};

const NavGroup: React.FC<NavGroupProps> = ({ label, children }) => {
  return (
    <div className="space-y-1 pt-2">
      <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </h3>
      {children}
    </div>
  );
};

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const [location] = useLocation();
  
  return (
    <div className={cn(
      "md:flex md:flex-shrink-0 transition-all duration-300 ease-in-out transform",
      open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-800">
        <div className="flex flex-col h-0 flex-1">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white dark:bg-sidebar border-b border-gray-200 dark:border-gray-800">
            <svg 
              className="h-8 w-auto text-primary" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="ml-2 text-xl font-semibold text-foreground">UniERP</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-4 pb-4 bg-white dark:bg-sidebar">
            <nav className="flex-1 px-2 space-y-1">
              <NavGroup label="Dashboard">
                <NavItem 
                  href="/erp" 
                  icon={<LayoutDashboard />} 
                  label="Overview" 
                  active={location === "/erp"} 
                />
              </NavGroup>

              <NavGroup label="ERP">
                <NavItem 
                  href="/erp/inventory" 
                  icon={<Package />} 
                  label="Inventory" 
                  active={location === "/erp/inventory"} 
                />
                <NavItem 
                  href="/erp/finance" 
                  icon={<DollarSign />} 
                  label="Finance" 
                  active={location === "/erp/finance"} 
                />
                <NavItem 
                  href="/erp/hr" 
                  icon={<Users />} 
                  label="HR" 
                  active={location === "/erp/hr"} 
                />
                <NavItem 
                  href="/erp/manufacturing" 
                  icon={<Factory />} 
                  label="Manufacturing" 
                  active={location === "/erp/manufacturing"} 
                />
                <NavItem 
                  href="/erp/sales" 
                  icon={<BarChart2 />} 
                  label="Sales" 
                  active={location === "/erp/sales"} 
                />
              </NavGroup>

              <NavGroup label="E-Commerce">
                <NavItem 
                  href="/admin/products" 
                  icon={<ShoppingBag />} 
                  label="Products" 
                  active={location === "/admin/products"} 
                />
                <NavItem 
                  href="/admin/orders" 
                  icon={<ClipboardList />} 
                  label="Orders" 
                  active={location === "/admin/orders"} 
                />
              </NavGroup>

              <NavGroup label="CRM">
                <NavItem 
                  href="/crm/customers" 
                  icon={<UserCircle />} 
                  label="Customers" 
                  active={location === "/crm/customers"} 
                />
                <NavItem 
                  href="/crm/leads" 
                  icon={<FileEdit />} 
                  label="Leads" 
                  active={location === "/crm/leads"} 
                />
              </NavGroup>

              <NavGroup label="Settings">
                <NavItem 
                  href="/settings/general" 
                  icon={<Settings />} 
                  label="General" 
                  active={location === "/settings/general"} 
                />
                <NavItem 
                  href="/settings/preferences" 
                  icon={<Settings />} 
                  label="Preferences" 
                  active={location === "/settings/preferences"} 
                />
              </NavGroup>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
