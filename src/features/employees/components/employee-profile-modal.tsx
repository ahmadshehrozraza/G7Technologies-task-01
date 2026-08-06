"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeProfileModal = ({ userId, isOpen, onClose }: ProfileModalProps) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSlip, setIsGeneratingSlip] = useState(false);

  // Salary Calculator State
  const [basic, setBasic] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);
  const [deduction, setDeduction] = useState<number>(0);

  useEffect(() => {
    if (!userId || !isOpen) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/employees/${userId}/profile`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (error) {
        toast.error("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isOpen]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      department: formData.get("department") as string,
      designation: formData.get("designation") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    };

    try {
      const res = await fetch(`/api/admin/employees/${userId}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSlip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    setIsGeneratingSlip(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      month: formData.get("month") as string,
      year: Number(formData.get("year")),
      basicSalary: Number(basic),
      bonus: Number(bonus),
      deduction: Number(deduction),
    };

    try {
      const res = await fetch(`/api/admin/employees/${userId}/salary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Salary slip generated successfully!");
      } else {
        toast.error("Failed to generate salary slip.");
      }
    } catch (error) {
      toast.error("Network error.");
    } finally {
      setIsGeneratingSlip(false);
    }
  };

  const netPayable = Number(basic) + Number(bonus) - Number(deduction);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Profile & Advanced Salary Management</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading profile...</div>
        ) : data ? (
          <div className="space-y-6">
            {/* Profile Form */}
            <form onSubmit={handleUpdate} className="space-y-4 border-b pb-6">
              <h3 className="font-semibold text-gray-800 text-sm">Personal & Job Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500">Name</label>
                  <p className="text-sm font-medium text-gray-900">{data.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">Email</label>
                  <p className="text-sm font-medium text-gray-900">{data.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Department</label>
                  <input name="department" defaultValue={data.profile?.department || ""} className="w-full px-3 py-1.5 border rounded-md text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Designation</label>
                  <input name="designation" defaultValue={data.profile?.designation || ""} className="w-full px-3 py-1.5 border rounded-md text-sm" />
                </div>
              </div>

              <button type="submit" disabled={isSaving} className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-md text-xs transition">
                {isSaving ? "Saving..." : "Update Profile"}
              </button>
            </form>

            {/* Salary Slip Generation Form */}
            <form onSubmit={handleGenerateSlip} className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-sm">Generate Salary Slip & Calculations</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Month</label>
                  <select name="month" className="w-full px-3 py-1.5 border rounded-md text-sm bg-white">
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Year</label>
                  <input name="year" type="number" defaultValue={new Date().getFullYear()} className="w-full px-3 py-1.5 border rounded-md text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Basic Salary</label>
                  <input type="number" value={basic} onChange={(e) => setBasic(Number(e.target.value))} required className="w-full px-3 py-1.5 border rounded-md text-sm" placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Bonus (+)</label>
                  <input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className="w-full px-3 py-1.5 border rounded-md text-sm" placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Deduction (-)</label>
                  <input type="number" value={deduction} onChange={(e) => setDeduction(Number(e.target.value))} className="w-full px-3 py-1.5 border rounded-md text-sm" placeholder="0" />
                </div>
              </div>

              {/* Net Payable Live Preview */}
              <div className="p-3 bg-gray-50 border rounded-md flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Net Payable Amount:</span>
                <span className="text-lg font-bold text-blue-600">${netPayable >= 0 ? netPayable : 0}</span>
              </div>

              <button type="submit" disabled={isGeneratingSlip} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-xs transition">
                {isGeneratingSlip ? "Generating..." : "Save & Generate Slip"}
              </button>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center text-red-500">Failed to load data.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};