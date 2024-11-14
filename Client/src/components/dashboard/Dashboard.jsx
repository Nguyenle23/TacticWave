import React, { useState } from 'react';
import { ExperimentList } from './ExperimentList/ExperimentList';
import { Statistics } from './Statistics/Statistics';

export const Dashboard = () => {
    const experiments = [
        { date: '2021-09-01', title: 'Experiment 1', matrix: '3x3', totalNodes: 9, creator: 'thanh.cv' },
        { date: '2021-09-01 22:10', title: 'Experiment 1', matrix: '3x3', totalNodes: 3, creator: 'tan.dt' },
        { date: '2021-09-02', title: 'Experiment 2', matrix: '4x4', totalNodes: 8, creator: 'nguyen.le' },
        { date: '2021-09-03', title: 'Experiment 3', matrix: '5x5', totalNodes: 13, creator: 'nam.anh' },
    ];

    return (
        <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-auto">
        <div className="flex-1">
            <ExperimentList experiments={experiments} />
        </div>
        <div className="w-full lg:w-80">
            <Statistics />
        </div>
        </div>
    );
};