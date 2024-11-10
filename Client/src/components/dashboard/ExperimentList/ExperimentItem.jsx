// import React from 'react';
// import { MoreVertical } from 'lucide-react';

// export const ExperimentItem = ({ date, title, matrix, creator }) => {
//     return (
//         <div className="flex flex-col md:flex-row items-start md:items-center
//         justify-between p-4 border-b hover:bg-gray-50 space-y-2 md:space-y-0">
//             <div className="w-full md:w-32 text-sm text-gray-500">{date}</div>
//             <div className="flex-1">{title}</div>
//             <div className="flex items-center space-x-4">
//                 <span className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm">
//                     {matrix}
//                 </span>
//                 <div className="text-sm">{creator}</div>
//                 <MoreVertical className="cursor-pointer text-gray-500" size={20} />
//             </div>
//         </div>
//     );
// };

import React from "react";
import { MoreVertical } from "lucide-react";

export const ExperimentItem = ({ date, title, matrix, creator }) => {
  return (
      <tbody>
        <tr className="border-b hover:bg-gray-100">
          <td className="p-2 text-sm text-gray-500">{date}</td>
          <td className="p-2">{title}</td>
          <td className="p-2">
            <span className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm">
              {matrix}
            </span>
          </td>
          <td className="p-2 text-sm">{creator}</td>
          <td className="p-2">
            <MoreVertical className="cursor-pointer text-gray-500" size={20} />
          </td>
        </tr>
      </tbody>
  );
};
