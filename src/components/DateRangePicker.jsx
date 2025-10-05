'use client';

import React from 'react';

export default function DateRangePicker({ from, to, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <label className="text-sm font-medium text-gray-600">From:</label>
      <input
        type="date"
        value={from}
        onChange={(e) => onChange({ from: e.target.value, to })}
        className="border px-2 py-1 rounded-md text-sm"
      />
      <label className="text-sm font-medium text-gray-600 sm:ml-4">To:</label>
      <input
        type="date"
        value={to}
        onChange={(e) => onChange({ from, to: e.target.value })}
        className="border px-2 py-1 rounded-md text-sm"
      />
    </div>
  );
}
