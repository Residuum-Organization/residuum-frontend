import React from "react";

import AdminHeader from "../components/admin/AdminHeader";
import AdminStats from "../components/admin/AdminStats";
import QuickActions from "../components/admin/QuickActions";
import PendingPoints from "../components/admin/PendingPoints";
import ActivePoints from "../components/admin/ActivePoints";
import BottomNav from "../components/admin/BottomNav";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] flex justify-center items-center p-3">
      <main className="w-[340px] h-[750px] bg-[#F6F8FA] rounded-[28px] overflow-hidden shadow-2xl relative">
        <section className="px-5 pt-5 pb-20">
          <AdminHeader />
          <AdminStats />
          <QuickActions />
          <PendingPoints />
          <ActivePoints />
        </section>

        <BottomNav />
      </main>
    </div>
  );
}
