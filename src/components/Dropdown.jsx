import React, { useState } from "react";

const Dropdown = ({ options, label, onChange }) => {
  const [selected, setSelected] = useState("");
  const [idCounter, setIdCounter] = useState(1); // Initialize ID counter

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value); // Set selected value
    setIdCounter((prev) => prev + 1); // Increment the ID counter
    if (onChange) {
      onChange(value, idCounter); // Pass the value and ID back to the parent
    }
  };

  return (
    <div className="w-auto mb-2">
      <select
        id="dropdown"
        className="w-auto py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#fc6011] focus:border-[#fc6011] text-sm"
        value={selected}
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Display selected value and ID */}
      {/* {selected && (
        <div className="mt-4 p-3 bg-gray-50 border rounded-md shadow-sm">
          <p className="text-sm text-gray-800">
            <strong>Selected Status:</strong> {selected}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Assigned ID:</strong> {idCounter}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default Dropdown;
