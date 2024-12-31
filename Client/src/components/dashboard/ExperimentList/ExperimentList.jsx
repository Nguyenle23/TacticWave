// ExperimentList.jsx
import React, { useState, useEffect } from "react";
import { ExperimentItem } from "./ExperimentItem";

export const ExperimentList = ({ experiments }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Theo dõi chỉ số `experiment` hiện tại
  const [activatePlay, setActivatePlay] = useState(false); // Kích hoạt lại hàm play
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái xử lý

  const handleNext = () => {
    if (isProcessing) {
      console.log('Đang xử lý. Không thể tiếp tục đến thử nghiệm tiếp theo.');
      return;
    }
    if (currentIndex < experiments.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    if (isProcessing) {
      console.log('Đang xử lý. Không thể khởi động lại.');
      return;
    }
    // Kích hoạt lại `handlePlayExp` trong `ExperimentItem`
    setActivatePlay(true);
    setTimeout(() => setActivatePlay(false), 100); // Reset lại trạng thái sau khi kích hoạt
  };

  const handleStartNewTrial = () => {
    if (isProcessing) {
      console.log('Đang xử lý. Không thể bắt đầu thử nghiệm mới.');
      return;
    }
    setActivatePlay(true);
    setTimeout(() => setActivatePlay(false), 100); // Reset lại trạng thái sau khi kích hoạt
  };

  // Lắng nghe phím "C", "R", và "SPACEBAR"
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isProcessing) {
        // Bỏ qua các phím nếu đang xử lý
        return;
      }
      if (event.key === "c" || event.key === "C") {
        handleNext(); // Tiếp tục đến phần tử tiếp theo
      } else if (event.key === "r" || event.key === "R") {
        handleRestart(); // Kích hoạt lại hàm Play
      } else if (event.code === "Space") {
        handleStartNewTrial(); // Bắt đầu thử nghiệm mới
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress); // Cleanup sự kiện
    };
  }, [currentIndex, isProcessing]);

  const currentExperiment = experiments[currentIndex];

  if (!currentExperiment) {
    return <div className="text-lg text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Card hiển thị thông tin */}
      <div className="relative bg-white rounded-md shadow-md p-6 w-full max-w-3xl border border-gray-300 mb-4">
        {/* ID và Section */}
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Pattern {currentIndex + 1}
        </h2>

        {/* Nội dung chính */}
        <div className="text-gray-700 leading-7">
          <p className="mb-4 font-medium">{currentExperiment.date}</p>
          <p className="mb-6 text-sm text-gray-600 leading-relaxed">
            Please answer the question on the paper next to you.
          </p>
          <div className="space-y-3">
            <p className="text-sm">
              Press{" "}
              <span className="bg-gray-200 px-3 py-1 rounded text-gray-700 font-semibold">
                SPACEBAR
              </span>{" "}
              to start a new trial.
            </p>

            <p className="text-sm">
              Press{" "}
              <span className="bg-gray-200 px-3 py-1 rounded text-gray-700 font-semibold">
                R
              </span>{" "}
              on the keyboard to Restart (replay current experiment).
            </p>
      
            <p className="text-sm">
              When you are done, Press{" "}
              <span className="bg-gray-200 px-3 py-1 rounded text-gray-700 font-semibold">
                C
              </span>{" "}
              on the keyboard to Continue.
            </p>
          </div>
        </div>
      </div>

      {/* ExperimentItem logic chỉ chạy, không hiển thị */}
      <div className="invisible">
        <ExperimentItem
          {...currentExperiment}
          index={currentIndex}
          activatePlay={activatePlay} // Truyền trạng thái kích hoạt
          onStartProcessing={() => setIsProcessing(true)} // Callback khi bắt đầu xử lý
          onEndProcessing={() => setIsProcessing(false)} // Callback khi kết thúc xử lý
        />
      </div>
    </div>
  );
};
