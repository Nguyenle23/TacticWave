import React from 'react';

export const StatisticsCard = ({ title, count }) => (
    <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center">
        <h3 className="text-gray-600">{title}</h3>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {count}
        </span>
        </div>
    </div>
);