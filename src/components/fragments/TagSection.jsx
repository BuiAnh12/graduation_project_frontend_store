"use client";
import React, { useState, useMemo } from "react";

export default function TagSection({
  title,
  tags = [],
  selectedSet,
  onToggle,
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [tags, search]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800 flex-1">{title}</h3>
        {/* Search */}
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className=" px-3 py-2 border border-gray-500 rounded-lg text-xs focus:ring-2 focus:ring-green-500 flex-1"
        />
      </div>

      {/* Tags list */}
      <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-2">
        {filtered.map((tag) => (
          <button
            key={tag._id}
            onClick={() => onToggle(tag._id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
              ${
                selectedSet.has(tag._id)
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
