import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
// Store Pages
import StoreDashboard from "@/pages/store/StoreDashboard";
import CreateOrder from "@/pages/store/CreateOrder";
import OrderList from "@/pages/store/OrderList";
import ReceiveGoods from "@/pages/store/ReceiveGoods";
import StoreInventory from "@/pages/store/StoreInventory";
// Kitchen Pages
import KitchenDashboard from "@/pages/kitchen/KitchenDashboard";
import IncomingOrders from "@/pages/kitchen/IncomingOrders";
import ProductionPlanning from "@/pages/kitchen/ProductionPlanning";
import ProductionSummary from "@/pages/kitchen/ProductionSummary";
import StorePackaging from "@/pages/kitchen/StorePackaging";
import KitchenInventory from "@/pages/kitchen/KitchenInventory";
import IssueGoods from "@/pages/kitchen/IssueGoods";
// Coordinator Pages
import CoordinatorDashboard from "@/pages/coordinator/CoordinatorDashboard";
import AggregatedOrders from "@/pages/coordinator/AggregatedOrders";
import DeliverySchedule from "@/pages/coordinator/DeliverySchedule";
import DeliveryTracking from "@/pages/coordinator/DeliveryTracking";
import ExceptionHandling from "@/pages/coordinator/ExceptionHandling";
// Manager & Admin Pages
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route element={<MainLayout />}>
              <Route path="/profile" element={<Profile />} />
              {/* Store Routes */}
              <Route path="/store" element={<StoreDashboard />} />
              <Route path="/store/orders/new" element={<CreateOrder />} />
              <Route path="/store/orders" element={<OrderList />} />
              <Route path="/store/receive" element={<ReceiveGoods />} />
              <Route path="/store/inventory" element={<StoreInventory />} />
              {/* Kitchen Routes */}
              <Route path="/kitchen" element={<KitchenDashboard />} />
              <Route path="/kitchen/orders" element={<IncomingOrders />} />
              <Route path="/kitchen/production-summary" element={<ProductionSummary />} />
              <Route path="/kitchen/production" element={<ProductionPlanning />} />
              <Route path="/kitchen/packaging" element={<StorePackaging />} />
              <Route path="/kitchen/inventory" element={<KitchenInventory />} />
              <Route path="/kitchen/issue" element={<IssueGoods />} />
              {/* Coordinator Routes */}
              <Route path="/coordinator" element={<CoordinatorDashboard />} />
              <Route path="/coordinator/orders" element={<AggregatedOrders />} />
              <Route path="/coordinator/coordination" element={<CoordinatorDashboard />} />
              <Route path="/coordinator/schedule" element={<DeliverySchedule />} />
              <Route path="/coordinator/tracking" element={<DeliveryTracking />} />
              <Route path="/coordinator/exceptions" element={<ExceptionHandling />} />
              {/* Manager Routes */}
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/manager/products" element={<ManagerDashboard />} />
              <Route path="/manager/recipes" element={<ManagerDashboard />} />
              <Route path="/manager/inventory" element={<ManagerDashboard />} />
              <Route path="/manager/reports" element={<ManagerDashboard />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminDashboard />} />
              <Route path="/admin/roles" element={<AdminDashboard />} />
              <Route path="/admin/config" element={<AdminDashboard />} />
              <Route path="/admin/locations" element={<AdminDashboard />} />
              <Route path="/admin/reports" element={<AdminDashboard />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
