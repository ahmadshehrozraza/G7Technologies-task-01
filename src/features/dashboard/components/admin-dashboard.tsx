"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingRequestsTab } from "@/features/employees/components/pending-requests-tab";
import { AllEmployeesTab } from "@/features/employees/components/all-employees-tab";
import { RejectedHistoryTab } from "@/features/employees/components/rejected-history-tab";

export const AdminDashboard = ({ user }: { user: any }) => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pendingRes, allRes] = await Promise.all([
        fetch("/api/admin/employees/pending"),
        fetch("/api/admin/employees/all")
      ]);

      if (pendingRes.ok) {
        const pendingJson = await pendingRes.json();
        setPendingCount(pendingJson.count);
      }
      
      if (allRes.ok) {
        const allJson = await allRes.json();
        setTotalCount(allJson.count);
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6">
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-blue-200">
          <h3 className="font-semibold text-blue-800">Pending Approvals</h3>
          <p className="text-3xl font-bold mt-2">
            {isLoading ? "..." : pendingCount}
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-green-200">
          <h3 className="font-semibold text-green-800">Total Employees</h3>
          <p className="text-3xl font-bold mt-2">
            {isLoading ? "..." : totalCount}
          </p>
        </div>
      </div> */}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
  <Tabs defaultValue="pending" className="w-full">
    <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
      <TabsTrigger value="pending">
        Pending Requests ({pendingCount}) {pendingCount > 0 && `(${pendingCount})`}
      </TabsTrigger>
      <TabsTrigger value="all">
        Active Employees ({totalCount})
      </TabsTrigger>
      <TabsTrigger value="rejected">
        Rejected History
      </TabsTrigger>
    </TabsList>
    
    <div className="mt-6">
      <TabsContent value="pending">
        <PendingRequestsTab onActionComplete={fetchStats} />
      </TabsContent>
      
      <TabsContent value="all">
        <AllEmployeesTab />
      </TabsContent>
      
      <TabsContent value="rejected">
        <RejectedHistoryTab />
      </TabsContent>
    </div>
  </Tabs>
</div>
    </div>
  );
};