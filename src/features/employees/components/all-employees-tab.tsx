"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeProfileModal } from "./employee-profile-modal";
import { EmployeeSlipsModal } from "./employee-slips-modal"; // Import new slips modal

export const AllEmployeesTab = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals States
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSlipsOpen, setIsSlipsOpen] = useState(false);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/employees/all");
      if (res.ok) {
        const json = await res.json();
        setEmployees(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = confirm(`Are you sure you want to remove ${name} from the system?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        toast.success(`${name} has been permanently deleted.`);
      } else {
        const errJson = await res.json();
        toast.error(errJson.error || "Could not delete employee.");
      }
    } catch (error) {
      toast.error("Failed to reach the server.");
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading employees...</div>;
  if (employees.length === 0) return <div className="p-4 text-center text-gray-500">No active employees found.</div>;

  return (
    <>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-900">Name</th>
              <th className="px-6 py-3 font-medium text-gray-900">Email</th>
              <th className="px-6 py-3 font-medium text-gray-900">Status</th>
              <th className="px-6 py-3 font-medium text-gray-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {employees.map((emp) => (
              <tr key={emp.id} className="bg-white">
                <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                <td className="px-6 py-4 text-gray-500">{emp.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium">
                      •••
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedUserId(emp.id);
                          setIsProfileOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        View Profile & Salary
                      </DropdownMenuItem>

                      {/* NEW OPTION: Salary Slips History */}
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedUserId(emp.id);
                          setSelectedUserName(emp.name);
                          setIsSlipsOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        Salary Slips History
                      </DropdownMenuItem>

                      <DropdownMenuItem 
                        onClick={() => handleDelete(emp.id, emp.name)}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        Delete Employee
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profile & Salary Management Modal */}
      <EmployeeProfileModal 
        userId={selectedUserId} 
        isOpen={isProfileOpen} 
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedUserId(null);
        }} 
      />

      {/* Salary Slips History Modal */}
      <EmployeeSlipsModal
        userId={selectedUserId}
        userName={selectedUserName}
        isOpen={isSlipsOpen}
        onClose={() => {
          setIsSlipsOpen(false);
          setSelectedUserId(null);
          setSelectedUserName(null);
        }}
      />
    </>
  );
};