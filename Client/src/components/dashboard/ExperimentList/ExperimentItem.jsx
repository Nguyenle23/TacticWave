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
  type,
  config,
}) => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const transformData = (input) => ({
    listings: input.listings.map((node, index) => ({
        node: node,
        intensity: input.intensity[index],
        duration: input.duration[index],
        order: 1 // Static value for "order"
    })),
    type: input.type
});

  const hanldePlayExp = async (index) => {
    // try {
    //   // Navigate to the experiment page with the experiment index and config data
    //   navigate(`/run/${index}`, {
    //     state: {
    //       experimentName,
    //       matrixSize,
    //       type,
    //       config
    //     },
    //   });
    // } catch (err) {
    //   setError(err.message);
    // }
    if (config.delay === 0) {
      delete config.delay;
    }
    if (config.type === "Simultaneous") {
      config = transformData(config);
    }
    
    await runExp(config)
    // console.log(config)
  };

  return (
    <>
      <tbody>
        <tr className="border-b hover:bg-gray-100">
          <td className="p-2 text-sm text-gray-500">{index + 1}</td>
          <td className="p-2 text-sm text-gray-500">{date}</td>
          <td className="p-2">
            <span className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm">
              {matrixSize}
            </span>
          </td>
          <td className="p-2 text-sm">{type}</td>
          <td className="p-2">
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
