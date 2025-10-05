import React from 'react';

const LabelWithIcon = ({ title, iconPath, onClick }) => {
    return (
        <button
            className="flex items-center justify-between w-auto"
            onClick={onClick}
        >
            <img src={iconPath} alt="icon" className="w-5 h-5 mx-2" />
            <span className="text-gray-500 font-medium">{title}</span>
            
        </button>
    );
};


export default LabelWithIcon;
