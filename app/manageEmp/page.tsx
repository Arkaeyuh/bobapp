"use client";

import React, { useEffect, useState } from "react";

export default function ManageEmployee() {
  interface Employee {
    employeeid: number;
    firstname: string;
    lastname: string;
    ismanager: boolean;
  }

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
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
      const res = await fetch("/api/employee");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
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

    const employeeData: Employee = {
      employeeid: employees.length + 1,
      ...newEmployee,
    };

    try {
      const res = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (!res.ok) throw new Error("Failed to add employee");

      setEmployees([...employees, employeeData]);
      setShowModal(false);
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

  async function removeEmployee(employeeid: number, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/employee`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeid }),
      });
      if (!response.ok) throw new Error("Failed to remove employee");
      setEmployees(employees.filter((e) => e.employeeid !== employeeid));
    } catch (error) {
      console.error("Error removing employee:", error);
    }
  }

  function handleEmployeeClick(employee: Employee) {
    setSelectedEmployee(employee);
  }

  function closeEmployeeModal() {
    setSelectedEmployee(null);
  }

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        Manage Employees
      </h1>

      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow opacity-90 transition hover:bg-blue-700 hover:opacity-100 hover:scale-105 duration-200"
        >
          Add Employee
        </button>
        <button
          onClick={() => (window.location.href = "/managerHome")}
          className="mb-4 ml-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow opacity-90 transition hover:bg-green-700 hover:opacity-100 hover:scale-105 duration-200"
        >
          Home
        </button>
        <ul className="space-y-5">
          {employees.map((employee) => (
            <li
              key={employee.employeeid}
              className="p-5 bg-white shadow-lg rounded-xl flex items-center justify-between border border-gray-200 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:shadow-gray-400 duration-200"
              onClick={() => handleEmployeeClick(employee)}
            >
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {employee.firstname} {employee.lastname}
                </p>
                <p className="text-sm text-gray-600">
                  {employee.ismanager ? "Manager" : "Staff"}
                </p>
              </div>
              <button
                onClick={(e) => removeEmployee(employee.employeeid, e)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg shadow opacity-90 hover:bg-red-600 hover:opacity-100 transition hover:scale-105 duration-200"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Add New Employee
            </h2>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={newEmployee.firstname}
              onChange={handleInputChange}
              className="mb-2 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-white bg-gray-900"
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={newEmployee.lastname}
              onChange={handleInputChange}
              className="mb-2 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-white bg-gray-900"
            />
            <label className="text-white flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                name="ismanager"
                checked={newEmployee.ismanager}
                onChange={handleInputChange}
              />
              <span>Manager?</span>
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:scale-105 duration-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Employee Details
            </h2>
            <p className="text-gray-200">
              <strong>ID:</strong> {selectedEmployee.employeeid}
            </p>
            <p className="text-gray-200">
              <strong>Name:</strong> {selectedEmployee.firstname}{" "}
              {selectedEmployee.lastname}
            </p>
            <p className="text-gray-200">
              <strong>Role:</strong>{" "}
              {selectedEmployee.ismanager ? "Manager" : "Staff"}
            </p>
            <button
              onClick={closeEmployeeModal}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition hover:scale-105 duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
