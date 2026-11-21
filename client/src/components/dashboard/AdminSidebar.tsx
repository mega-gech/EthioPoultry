import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  Store,
  Users,
} from "lucide-react";
import Sidebar, { type DashboardMenuItem } from "./Sidebar";

const adminMenuItems: DashboardMenuItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Sellers", to: "/admin/sellers", icon: Store },
  { label: "Orders", to: "/admin/orders", icon: ClipboardList },
  { label: "Market Prices", to: "/admin/market-prices", icon: BarChart3 },
  { label: "Reports", to: "/admin/reports", icon: ClipboardList },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

type AdminSidebarProps = {
  userName: string;
  userEmail?: string;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function AdminSidebar(props: AdminSidebarProps) {
  return <Sidebar {...props} role="admin" menuItems={adminMenuItems} />;
}
