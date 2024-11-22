import React, { useState } from "react";
import {
  MoreVertical,
  Play,
  PlayCircleIcon,
  PlaySquareIcon,
} from "lucide-react";
import { runExp } from "../../apis/callAPI";
import { useNavigate } from "react-router-dom";

export const ExperimentItem = ({
  index,
  date,
  experimentName,
  matrixSize,
  totalNodes,
  creator,
  config,
}) => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const handleMoreClick = async () => {
  //   if (!config) {
  //     return;
  //   }

  //   try {
  //     // Call the runExp function with the config data
  //     const response = await runExp(config);
  //     setResponseData(response.data);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  const hanldePlayExp = async (index) => {
    try {
      // Navigate to the experiment page with the experiment index and config data
      navigate(`/run/${index}`, {
        state: {
          experimentName,
          matrixSize,
          totalNodes,
          creator,
          config
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <tbody>
        <tr className="border-b hover:bg-gray-100">
          <td className="p-2 text-sm text-gray-500">{index}</td>
          <td className="p-2 text-sm text-gray-500">{date}</td>
          <td className="p-2">{experimentName}</td>
          <td className="p-2">
            <span className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm">
              {matrixSize}
            </span>
          </td>
          <td className="p-2 text-sm">{totalNodes}</td>
          <td className="p-2 text-sm">{creator}</td>
          <td className="p-2">
            {/* <MoreVertical  */}
            <PlayCircleIcon
              onClick={hanldePlayExp} // Trigger the API request when clicked
              className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors"
              size={30}
            />
          </td>
        </tr>
      </tbody>
    </>
  );
};
