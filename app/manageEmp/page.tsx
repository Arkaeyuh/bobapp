"use client";

import React, { useEffect, useState } from "react";

export default function ManageEmployee() {
  // Define the Employee interface
  interface Employee {
    employeeid: number;
    firstname: string;
    lastname: string;
    ismanager: boolean;
    isactive: boolean;
  }

  // State to store the list of employees
  const [employees, setEmployees] = useState<Employee[]>([]);
  // State to control the visibility of the "Add Employee" modal
  const [showModal, setShowModal] = useState(false);
  // State to store the currently selected employee for details view
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  // State to store the new employee data being added
  const [newEmployee, setNewEmployee] = useState({
    firstname: "",
    lastname: "",
    ismanager: false,
    isactive: true,
  });

  // Fetch employees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch the list of employees from the API
  async function fetchEmployees() {
    try {
      const res = await fetch("/api/employee");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      console.log(data);
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }

  // Add a new employee to the list
  async function addEmployee() {
    // Validate input fields
    if (!newEmployee.firstname || !newEmployee.lastname) {
      alert("Please fill in all fields.");
      return;
    }

    // Prepare the new employee data
    const employeeData: Employee = {
      employeeid: employees.length + 10,
      ...newEmployee,
    };

    try {
      // Send a POST request to add the employee
      const res = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (!res.ok) throw new Error("Failed to add employee");

      // Update the state with the new employee
      setEmployees([...employees, employeeData]);
      setShowModal(false);
      // Reset the new employee form
      setNewEmployee({
        firstname: "",
        lastname: "",
        ismanager: false,
        isactive: true,
      });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  }

  // Handle input changes for the new employee form
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Remove or toggle the active status of an employee
  async function removeEmployee(
    employeeid: number,
    isactive: boolean,
    e: React.MouseEvent
  ) {
    e.stopPropagation(); // Prevent triggering parent click events
    try {
      const response = await fetch(`/api/employee`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeid, isactive }),
      });
      if (!response.ok) throw new Error("Failed to remove employee");
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      console.error("Error removing employee:", error);
    }
  }

  // Handle clicking on an employee to view details
  function handleEmployeeClick(employee: Employee) {
    setSelectedEmployee(employee);
  }

  // Close the employee details modal
  function closeEmployeeModal() {
    setSelectedEmployee(null);
  }

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        Manage Employees
      </h1>

      <div className="max-w-2xl mx-auto">
        {/* Button to open the "Add Employee" modal */}
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow opacity-90 transition hover:bg-blue-700 hover:opacity-100 hover:scale-105 duration-200"
        >
          Add Employee
        </button>
        {/* Button to navigate back to the home page */}
        <button
          onClick={() => (window.location.href = "/managerHome")}
          className="mb-4 ml-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow opacity-90 transition hover:bg-green-700 hover:opacity-100 hover:scale-105 duration-200"
        >
          Home
        </button>
        {/* List of employees */}
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
              {/* Button to toggle employee active status */}
              <button
                onClick={(e) =>
                  removeEmployee(employee.employeeid, employee.isactive, e)
                }
                className={`px-3 py-1 ${
                  employee.isactive ? "bg-red-500" : "bg-green-500"
                } text-white rounded-lg shadow opacity-90 hover:${
                  employee.isactive ? "bg-red-600" : "bg-green-600"
                } hover:opacity-100 transition hover:scale-105 duration-200`}
              >
                {employee.isactive ? "Set to Inactive" : "Set to Active"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for adding a new employee */}
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
              {/* Cancel button to close the modal */}
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              {/* Add button to submit the new employee */}
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

      {/* Modal for displaying employee details */}
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
            <p className="text-gray-200">
              <strong>Status:</strong>{" "}
              {selectedEmployee.isactive ? "Active" : "Inactive"}
            </p>
            {/* Close button for the details modal */}
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
