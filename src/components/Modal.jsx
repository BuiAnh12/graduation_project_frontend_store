'use client';

import { useEffect, useState } from 'react';

const Modal = ({ open, onClose, closeTitle = 'Hủy', onConfirm, confirmTitle = 'Lưu', title, children, className = '' }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && open) {
                onClose?.();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
            <div className={`bg-white rounded-lg shadow-lg w-96 p-6 ${className}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg">&times;</button>
                </div>

                <div className="mb-4">{children}</div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        {closeTitle}
                    </button>
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {confirmTitle}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Modal