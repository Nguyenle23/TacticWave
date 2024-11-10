import React from 'react';
import { StatisticsCard } from './StatisticsCard';
import { Button } from '../../commons/Button';

export const Statistics = () => {
  const stats = [
    { title: 'Experiment', count: '7' },
    { title: 'Creator', count: '5' },
    { title: 'Matrix 3x3', count: '2' },
    { title: 'Matrix 4x4', count: '2' },
    { title: 'Matrix 5x5', count: '3' },
  ];

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium mb-4">Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
        {stats.map((stat, index) => (
          <StatisticsCard key={index} {...stat} />
        ))}
      </div>
      <Button className="w-full mt-4">Create new</Button>
    </div>
  );
};