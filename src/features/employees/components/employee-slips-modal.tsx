"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface SlipsModalProps {
  userId: string | null;
  userName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeSlipsModal = ({ userId, userName, isOpen, onClose }: SlipsModalProps) => {
  const [slips, setSlips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId || !isOpen) return;

    const fetchSlips = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/employees/${userId}/slips`);
        if (res.ok) {
          const json = await res.json();
          setSlips(json.data);
        } else {
          toast.error("Failed to load salary history.");
        }
      } catch (error) {
        toast.error("Network error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlips();
  }, [userId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Salary Slips History — {userName || "Employee"}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading history...</div>
        ) : slips.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No salary slips generated yet.</div>
        ) : (
          <div className="overflow-x-auto border rounded-lg mt-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-900">Period</th>
                  <th className="px-4 py-2 font-medium text-gray-900">Basic</th>
                  <th className="px-4 py-2 font-medium text-gray-900">Bonus</th>
                  <th className="px-4 py-2 font-medium text-gray-900">Deduction</th>
                  <th className="px-4 py-2 font-medium text-gray-900">Net Amount</th>
                  <th className="px-4 py-2 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {slips.map((slip) => (
                  <tr key={slip.id} className="bg-white">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {slip.month} {slip.year}
                    </td>
                    <td className="px-4 py-3 text-gray-600">${slip.basicSalary}</td>
                    <td className="px-4 py-3 text-green-600">+${slip.bonus}</td>
                    <td className="px-4 py-3 text-red-600">-${slip.deduction}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">${slip.netAmount}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {slip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};