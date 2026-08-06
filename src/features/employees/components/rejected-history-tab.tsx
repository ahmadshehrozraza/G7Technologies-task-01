"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export const RejectedHistoryTab = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRejected = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/employees/rejected");
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
    fetchRejected();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = confirm(`Are you sure you want to permanently delete ${name}'s rejected record?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        toast.success(`Rejected record for ${name} deleted permanently.`);
      } else {
        toast.error("Could not delete the record.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading history...</div>;
  if (employees.length === 0) return <div className="p-4 text-center text-gray-500">No rejected applications found.</div>;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 font-medium text-gray-900">Name</th>
            <th className="px-6 py-3 font-medium text-gray-900">Email</th>
            <th className="px-6 py-3 font-medium text-gray-900">Status</th>
            <th className="px-6 py-3 font-medium text-gray-900">Applied On</th>
            <th className="px-6 py-3 font-medium text-gray-900 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {employees.map((emp) => (
            <tr key={emp.id} className="bg-white">
              <td className="px-6 py-4 text-gray-500 line-through">{emp.name}</td>
              <td className="px-6 py-4 text-gray-500">{emp.email}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  {emp.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(emp.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleDelete(emp.id, emp.name)}
                  className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium transition"
                >
                  Remove Record
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};