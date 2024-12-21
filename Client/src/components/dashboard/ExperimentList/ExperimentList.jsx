import React from "react";
import { ExperimentItem } from "./ExperimentItem";
import { Button } from "../../commons/Button";

export const ExperimentList = ({ experiments }) => {
  return (
    <div className="bg-white rounded-lg border">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium text-xl">Listing</h3>
        <Button variant="secondary">Show all</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left text-sm text-gray-500">No.</th>
              <th className="p-2 text-left text-sm text-gray-500">Date</th>
              <th className="p-2 text-left text-sm text-gray-500">Matrix</th>
              <th className="p-2 text-left text-sm text-gray-500">Type</th>
              <th className="p-2 text-left text-sm text-gray-500">Actions</th>
            </tr>
          </thead>
          {experiments.map((experiment, index) => (
            <ExperimentItem key={index} {...experiment} index={index} />
          ))}
        </table>
      </div>
    </div>
  );
};
