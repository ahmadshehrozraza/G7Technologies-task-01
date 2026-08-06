"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner"; // FIXED: Direct import from sonner

export const PendingRequestsTab = ({ onActionComplete }: { onActionComplete: () => void }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPending = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/employees/pending");
      if (res.ok) {
        const json = await res.json();
        setRequests(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: string, status: "VERIFIED" | "REJECTED", name: string) => {
    try {
      const res = await fetch(`/api/admin/employees/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((req) => req.id !== id));
        onActionComplete();
        
        // FIXED: Using Sonner toast
        if (status === "VERIFIED") {
          toast.success(`${name} has been successfully approved.`);
        } else {
          toast.info(`${name} has been rejected.`);
        }
      } else {
        toast.error("Something went wrong while updating the status.");
      }
    } catch (error) {
      toast.error("Could not reach the server. Please try again.");
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading requests...</div>;
  if (requests.length === 0) return <div className="p-4 text-center text-gray-500">No pending requests.</div>;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 font-medium text-gray-900">Name</th>
            <th className="px-6 py-3 font-medium text-gray-900">Email</th>
            <th className="px-6 py-3 font-medium text-gray-900 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {requests.map((req) => (
            <tr key={req.id} className="bg-white">
              <td className="px-6 py-4">{req.name}</td>
              <td className="px-6 py-4">{req.email}</td>
              <td className="px-6 py-4 text-right space-x-2">
                <button 
                  onClick={() => handleAction(req.id, "VERIFIED", req.name)}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(req.id, "REJECTED", req.name)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};