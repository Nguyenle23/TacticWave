// ExperimentItem.jsx
import React, { useEffect, useState } from "react";
import { PlayCircleIcon } from "lucide-react";

export const ExperimentItem = ({
  index,
  date,
  experimentName,
  matrixSize,
  type,
  config,
  activatePlay,
  onStartProcessing, // Nhận callback từ ExperimentList
  onEndProcessing,   // Nhận callback từ ExperimentList
}) => {
  const [transformedConfig, setTransformedConfig] = useState(config); // Lưu `config` đã xử lý
  const [isProcessing, setIsProcessing] = useState(false);
  const [vibratingTimeStart, setVibratingTimeStart] = useState([])

  const transformData = (input) => ({
    listings: input.listings.map((node, index) => ({
      node: node,
      intensity: input.intensity[index],
      duration: input.duration[index],
      order: 1, // Static value for "order"
    })),
    type: input.type,
  });

  // Xử lý `config` ngay khi component mount
  useEffect(() => {
    let updatedConfig = { ...config };

    if (updatedConfig.delay === 0) {
      delete updatedConfig.delay;
    }

    if (updatedConfig.type === "Simultaneous") {
      updatedConfig = transformData(updatedConfig);
    }

    setTransformedConfig(updatedConfig); // Lưu `config` đã xử lý
  }, [config]);

  const handlePlayExp = () => {
    // Nếu đang xử lý, không làm gì cả
    if (isProcessing) {
      console.log("Đang xử lý. Vui lòng chờ...");
      return;
    }
  
    // Lấy thời gian hiện tại
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}:${String(
      now.getMilliseconds()
    ).padStart(3, "0")}`;
  
    console.log(`Hàm được gọi vào lúc: ${formattedTime}`);
  
    // Đặt cờ xử lý thành true và thông báo cho ExperimentList
    setIsProcessing(true);
    onStartProcessing();
  
    // Tạo một số nguyên ngẫu nhiên từ 1 đến 3
    const delay = Math.floor(Math.random() * 3) + 1; // 1, 2 hoặc 3
  
    console.log(`Đang trì hoãn thực thi trong ${delay} giây...`);
  
    setTimeout(() => {
      const finishedTime = new Date();
      const formattedFinishedTime = `${String(finishedTime.getHours()).padStart(
        2,
        "0"
      )}:${String(finishedTime.getMinutes()).padStart(2, "0")}:${String(
        finishedTime.getSeconds()
      ).padStart(2, "0")}:${String(finishedTime.getMilliseconds()).padStart(
        3,
        "0"
      )}`;
  
      // Lấy mảng hiện tại từ localStorage (hoặc tạo mảng mới nếu chưa có)
      const existingTimes = JSON.parse(localStorage.getItem("vibratingTimes")) || [];
  
      // Thêm thời gian mới vào mảng
      const updatedTimes = [...existingTimes, formattedFinishedTime];
  
      // Ghi lại mảng mới vào localStorage
      localStorage.setItem("vibratingTimes", JSON.stringify(updatedTimes));
  
      console.log("Vibrating times:", updatedTimes); // In mảng cập nhật
  
      // Reset cờ xử lý và thông báo cho ExperimentList
      setIsProcessing(false);
      onEndProcessing();
    }, delay * 1000); // Chuyển sang milliseconds
  };
  
  

  // Kích hoạt lại `handlePlayExp` khi `activatePlay` thay đổi
  useEffect(() => {
    if (activatePlay) {
      handlePlayExp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activatePlay]);

  return (
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
            onClick={handlePlayExp} // Gọi API với config đã xử lý
            className={`cursor-pointer text-blue-500 hover:text-blue-700 transition-colors ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            size={30}
            title={isProcessing ? "Đang xử lý..." : "Chạy thử nghiệm"}
          />
        </td>
      </tr>
    </tbody>
  );
};
