'use client';
import React, { useState } from "react";

const Tabs = ({ 
  tabs, 
  defaultActiveTab = 0, 
  onTabChange, 
  tabClassName = "py-3 text-sm font-medium flex justify-center items-center transition-colors duration-200",
  activeTabClassName = "text-[#fc6011] bg-gray-100 border-b-2 border-[#fc6011]"
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onTabChange) onTabChange(index);
  };

  return (
    <div className="w-full mt-2 h-lvh">
      {/* Navigation Tabs */}
      <div 
        className={`grid border-b-2 border-gray-200 bg-white sticky top-0 z-10`}
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }} // Dynamic columns
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`${tabClassName} ${activeTab === index ? activeTabClassName : "text-gray-500 bg-white hover:bg-gray-50 hover:text-[#fc6011]"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="py-4">{tabs[activeTab]?.component}</div>
    </div>
  );
};

export default Tabs;
