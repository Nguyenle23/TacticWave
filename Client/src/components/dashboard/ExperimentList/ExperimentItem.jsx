import React from "react";
import { MoreVertical } from "lucide-react";

export const ExperimentItem = ({ date, experimentName, matrixSize, totalNodes, creator }) => {
  return (
      <tbody>
        <tr className="border-b hover:bg-gray-100">
          <td className="p-2 text-sm text-gray-500">{date}</td>
          <td className="p-2">{experimentName}</td>
          <td className="p-2">
            <span className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm">
              {matrixSize}x{matrixSize}
            </span>
          </td>
          <td className="p-2 text-sm">{totalNodes}</td>
          <td className="p-2 text-sm">{creator}</td>
          <td className="p-2">
            <MoreVertical className="cursor-pointer text-gray-500" size={20} />
          </td>
        </tr>
      </tbody>
  );
};
