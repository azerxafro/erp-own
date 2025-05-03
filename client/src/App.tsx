import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/layouts/Dashboard";
import Overview from "@/pages/dashboard/Overview";
import InventoryDashboard from "@/pages/inventory/InventoryDashboard";
import FinanceDashboard from "@/pages/finance/FinanceDashboard";
import HRDashboard from "@/pages/hr/HRDashboard";
import ManufacturingDashboard from "@/pages/manufacturing/ManufacturingDashboard";
import SalesDashboard from "@/pages/sales/SalesDashboard";
import ProductsList from "@/pages/products/ProductsList";
import CategoriesList from "@/pages/products/CategoriesList";
import OrdersList from "@/pages/orders/OrdersList";
import CustomersList from "@/pages/customers/CustomersList";
import LeadsList from "@/pages/leads/LeadsList";
import General from "@/pages/settings/General";
import Preferences from "@/pages/settings/Preferences";
import Store from "@/pages/ecommerce/Store";
import ProductPage from "@/pages/ecommerce/ProductPage";
import Checkout from "@/pages/ecommerce/Checkout";

function Router() {
  const [location] = useLocation();

  // Check if the current path is for the store (e-commerce frontend)
  const isStorePath = location === "/" || 
                      location.startsWith("/product") || 
                      location.startsWith("/checkout");

  if (isStorePath) {
    return (
      <Switch>
        <Route path="/" component={Store} />
        <Route path="/product/:id" component={ProductPage} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/checkout/success/:orderId" component={Checkout} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Dashboard>
      <Switch>
        {/* ERP Dashboard */}
        <Route path="/erp" component={Overview} />
        <Route path="/erp/inventory" component={InventoryDashboard} />
        <Route path="/erp/finance" component={FinanceDashboard} />
        <Route path="/erp/hr" component={HRDashboard} />
        <Route path="/erp/manufacturing" component={ManufacturingDashboard} />
        <Route path="/erp/sales" component={SalesDashboard} />
        
        {/* E-commerce Admin */}
        <Route path="/admin/products" component={ProductsList} />
<Route path="/admin/categories" component={CategoriesList} />
        <Route path="/admin/orders" component={OrdersList} />
        
        {/* CRM */}
        <Route path="/crm" component={CustomersList} />
        <Route path="/crm/customers" component={CustomersList} />
        <Route path="/crm/leads" component={LeadsList} />
        
        {/* Settings */}
        <Route path="/settings" component={General} />
        <Route path="/settings/general" component={General} />
        <Route path="/settings/preferences" component={Preferences} />
        
        {/* Default Dashboard */}
        <Route path="/admin" component={Overview} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Dashboard>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
