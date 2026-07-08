import React from "react";

import AdminHeader from "../components/admin/AdminHeader";
import AdminStats from "../components/admin/AdminStats";
import QuickActions from "../components/admin/QuickActions";
import PendingPoints from "../components/admin/PendingPoints";
import ActivePoints from "../components/admin/ActivePoints";
import AdminShell from "../components/admin/AdminShell";

export default function AdminPage() {
  return (
    <AdminShell>
      <AdminHeader />
      <AdminStats />
      <QuickActions />
      <PendingPoints />
      <ActivePoints />
    </AdminShell>
  );
}
