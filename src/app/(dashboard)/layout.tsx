import { SidebarProvider } from "@/components/ui/sidebar";

import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
  children: React.ReactNode;
}

/**
 * Layout component that serves as the primary wrapper for dashboard pages.
 * It provides sidebar context, includes the main dashboard sidebar and navbar,
 * and renders page content within a full-screen layout.
 */
const Layout = ({ children }: Props) => {
  return (
    // Provide sidebar context to child components
    <SidebarProvider>
      {/* Persistent dashboard sidebar */}
      <DashboardSidebar />

      {/* Main content area with navbar and dynamic page content */}
      <main className="flex flex-col h-screen w-screen bg-muted">
        {/* Dashboard navigation bar */}
        <DashboardNavbar />

        {/* Page-specific content injected via children prop */}
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
