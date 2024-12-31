import React, { useState, useEffect } from "react";
import { ExperimentList } from "./ExperimentList/ExperimentList";
import { Statistics } from "./Statistics/Statistics";
import { getAllRecords } from "../apis/callAPI";

export const Dashboard = () => {
  const [experiments, setExperiments] = useState([]);
  const [userID, setUserID] = useState(""); // Giá trị mặc định ban đầu là rỗng
  const [isSubmitID, setIsSubmitID] = useState(false);

  const handleDropdownChange = (event) => {
    const selectedId = parseInt(event.target.value);
    setUserID(selectedId || ""); // Nếu không chọn giá trị hợp lệ, giữ lại giá trị rỗng
  };

  const getBreakPositions = (userID) => {
    switch (userID) {
      case 1:
        return [38, 61, 84, 107];
      case 2:
        return [22, 22+22+1, 22+22+38+2, 22+22+38+22+3];
      case 3:
        return [22, 22+22+1, 22+22+22+2, 22+22+22+38+3];
      case 4:
        return [22, 22+38+1, 22+38+22+2, 22+38+22+22+3];
      case 5:
        return [38, 38+22+1, 38+22+22+2, 38+22+22+22+3];
      case 6:
        return [22, 22+22+1, 22+22+38+2, 22+22+38+22+3];
      case 7:
        return [22, 22+22+1, 22+22+22+2, 22+22+22+38+3];
      case 8:
        return [22, 22+38+1, 22+38+22+2, 22+38+22+22+3];
      case 9:
        return [38, 38+22+1, 38+22+22+2, 38+22+22+22+3];
      case 10:
        return [22, 22+22+1, 22+22+38+2, 22+22+38+22+3];
      case 11:
        return [22, 22+22+1, 22+22+22+2, 22+22+22+38+3];
      case 12:
        return [22, 22+38+1, 22+38+22+2, 22+38+22+22+3];
      case 13:
        return [38, 38+22+1, 38+22+22+2, 38+22+22+22+3];
      case 14:
        return [22, 22+22+1, 22+22+38+2, 22+22+38+22+3];
      case 15:
        return [22, 22+22+1, 22+22+22+2, 22+22+22+38+3];
      case 16:
        return [22, 22+38+1, 22+38+22+2, 22+38+22+22+3];
      default:
        return [];
    }
  };

  const fetchExperiments = async (userID) => {
    try {
      setIsSubmitID(true);
      const response = await getAllRecords(userID);
      if (response.length === 0) {
        return;
      }
      const data = response.data.result;

      // Lấy breakPositions từ hàm switch case
      const breakPositions = getBreakPositions(userID);

      // Tạo một bản sao của danh sách experiments và thêm các phần tử mới
      let updatedExperiments = [...data];

      breakPositions.forEach((position) => {
        if (position <= updatedExperiments.length) {
          updatedExperiments.splice(position, 0, { type: "Break" });
        }
      });

      setExperiments(updatedExperiments); // Cập nhật trạng thái experiments
    } catch (error) {
      console.error("Network Error:", error.message);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
    }
  };

  console.log(experiments);

  return (
    <>
      {!isSubmitID && (
        <>
          {/* Dropdown List */}
          <div className="flex p-4 gap-4 items-center">
            <label
              htmlFor="experiment-dropdown"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Select Experiment ID:
            </label>
            <div className="flex gap-8">
              <select
                id="experiment-dropdown"
                className="block w-40 p-2 border border-gray-300 rounded-md shadow-sm"
                value={userID} // Giá trị hiển thị hiện tại
                onChange={handleDropdownChange}
              >
                <option value="" disabled>
                  Choose one
                </option>
                {Array.from({ length: 16 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    ID: {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => userID && fetchExperiments(userID)} // Đảm bảo chỉ gửi khi userID hợp lệ
                disabled={!userID} // Disable nút nếu chưa chọn ID
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
      <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-auto">
        <div className="flex-1">
          {experiments.length === 0 ? (
            <div className="text-center text-lg font-semibold text-gray-500">
              No experiments found
            </div>
          ) : (
            <div className="flex-1">
              <ExperimentList
                isSubmitID={isSubmitID}
                experiments={experiments}
              />
            </div>
          )}
        </div>
        <div className="w-full lg:w-80">
          <Statistics />
        </div>
      </div>
    </>
  );
};
