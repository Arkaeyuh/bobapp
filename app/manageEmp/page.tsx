"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ManageEmp() {
  interface Employee {
    employeeid: number;
    lastname: string;
    firstname: string;
    ismanager: boolean;
  }

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstname: "",
    lastname: "",
    ismanager: false,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      const response = await fetch("/api/employee");
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }

  async function addEmployee() {
    if (!newEmployee.firstname || !newEmployee.lastname) {
      alert("Please fill in all fields.");
      return;
    }

    const employeeData = {
      employeeid: Math.floor(Math.random() * 10000), // Temporary ID
      ...newEmployee,
    };

    try {
      const response = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) throw new Error("Failed to add employee");

      setEmployees([...employees, employeeData]);
      setShowModal(false); // Close modal after adding
      setNewEmployee({ firstname: "", lastname: "", ismanager: false });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function removeEmployee(employeeid: number) {
    try {
      const response = await fetch(`/api/employee/${employeeid}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove employee");
      setEmployees(employees.filter((emp) => emp.employeeid !== employeeid));
    } catch (error) {
      console.error("Error removing employee:", error);
    }
  }

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        Manage Employees
      </h1>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Add Employee
        </button>
        <ul className="space-y-5">
          {employees.map((employee) => (
            <li
              key={employee.employeeid}
              className="p-5 bg-white shadow-lg rounded-xl flex items-center justify-between border border-gray-200"
            >
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {employee.lastname}, {employee.firstname}
                </p>
                <p className="text-sm text-gray-600">
                  {employee.ismanager ? "Manager" : "Employee"}
                </p>
              </div>
              <button
                onClick={() => removeEmployee(employee.employeeid)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Add New Employee
            </h2>
            <input
              type="text"
              name="firstname"
              value={newEmployee.firstname}
              onChange={handleInputChange}
              placeholder="First Name"
              className="w-full p-2 border rounded mb-2 text-gray-800"
            />
            <input
              type="text"
              name="lastname"
              value={newEmployee.lastname}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="w-full p-2 border rounded mb-2 text-gray-800"
            />
            <label className="flex items-center space-x-2 mb-4 text-gray-800">
              <input
                type="checkbox"
                name="ismanager"
                checked={newEmployee.ismanager}
                onChange={handleInputChange}
              />
              <span>Is Manager</span>
            </label>
            <div className="flex justify-between">
              <button
                onClick={addEmployee}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
