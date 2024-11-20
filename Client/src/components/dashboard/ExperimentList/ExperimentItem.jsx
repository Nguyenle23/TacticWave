import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { runExp } from "../../apis/callAPI";

export const ExperimentItem = ({ date, experimentName, matrixSize, totalNodes, creator, config }) => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle the click event and trigger the API request
  const handleMoreClick = async () => {
    if (!config) {
      return; // Do nothing if config is not available
    }

    try {
      // Call the runExp function with the config data
      const response = await runExp(config);
      setResponseData(response.data);  // Assuming response.data contains the desired data
    } catch (err) {
      setError(err.message); // Set error if any
    }
  };

  return (
    <>
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
            <MoreVertical 
              onClick={handleMoreClick}  // Trigger the API request when clicked
              className="cursor-pointer text-gray-500" 
              size={20} 
            />
          </td>
        </tr>
      </tbody>

    </>
  );
};
