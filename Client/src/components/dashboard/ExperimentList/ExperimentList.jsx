import React, { useState, useEffect } from "react";
import { ExperimentItem } from "./ExperimentItem";
import { runExp } from "../../apis/callAPI";

export const ExperimentList = ({ isSubmitID, experiments }) => {
  const [pressTimesStart, setPressTimesStart] = useState([]);
  const [pressTimeEnd, setPressTimeEnd] = useState([]);
  // Chỉ số experiment hiện tại
  const [currentIndex, setCurrentIndex] = useState(0);

  // Kích hoạt play (tự động gọi handlePlayExp bên trong ExperimentItem)
  const [activatePlay, setActivatePlay] = useState(false);

  // Trạng thái đang xử lý (processing)
  const [isProcessing, setIsProcessing] = useState(false);

  // Ẩn/hiện dòng "Press C"
  const [showContinueLine, setShowContinueLine] = useState(false);

  // Chặn người dùng nhấn Space nhiều lần
  const [canPressSpace, setCanPressSpace] = useState(true);

  // Lấy ra experiment hiện tại từ mảng `experiments`
  const currentExperiment = experiments[currentIndex];

  // State lưu config đã transform
  const [transformedConfig, setTransformedConfig] = useState({});

  // Hàm để transform dữ liệu (dành cho "Simultaneous" chẳng hạn)
  const transformData = (input) => ({
    listings: input.listings.map((node, index) => ({
      node: node,
      intensity: input.intensity[index],
      duration: input.duration[index],
      order: 1, // Giá trị tĩnh
    })),
    type: input.type,
  });

  // Mỗi khi `currentExperiment` thay đổi, ta transform lại config
  useEffect(() => {
    if (!currentExperiment || !currentExperiment.config) {
      return; // Nếu chưa có currentExperiment hoặc không có config thì bỏ qua
    }

    let updatedConfig = { ...currentExperiment.config };

    // Xóa `delay` nếu = 0
    if (updatedConfig.delay === 0) {
      delete updatedConfig.delay;
    }

    // Nếu type là "Simultaneous", transform theo logic
    if (updatedConfig.type === "Simultaneous") {
      updatedConfig = transformData(updatedConfig);
    }

    setTransformedConfig(updatedConfig);
  }, [currentExperiment]);

  // Chuyển sang experiment tiếp theo khi nhấn "C"
  const handleNext = () => {
    if (isProcessing) {
      console.log("Processing... Cannot proceed to the next experiment.");
      return;
    }

    // Lấy thời gian hiện tại
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}:${String(
      now.getMilliseconds()
    ).padStart(3, "0")}`;

    // Thêm thời gian vào mảng nextTimes và lưu vào localStorage
    setPressTimeEnd((prevTimes) => {
      const updatedTimes = [...prevTimes, formattedTime];

      // Lưu mảng updatedTimes vào localStorage
      localStorage.setItem("pressTimeEnd", JSON.stringify(updatedTimes));

      console.log("Next times:", updatedTimes); // In ra toàn bộ mảng sau mỗi lần nhấn
      return updatedTimes;
    });

    // Reset cho phép nhấn Space
    setCanPressSpace(true);

    if (currentIndex < experiments.length - 1) {
      setCurrentIndex((prev) => prev + 1); // Tăng chỉ số thử nghiệm hiện tại
      setShowContinueLine(false); // Ẩn dòng "Press C"
    }
  };
  // Bắt đầu thử nghiệm khi nhấn "Space"
  const handleStartNewTrial = async () => {
    if (isProcessing || !canPressSpace) {
      console.log("Cannot start a new trial at the moment.");
      return;
    }
  
    try {
      // Lấy thời gian hiện tại
      const now = new Date();
      const formattedTime = `${String(now.getHours()).padStart(
        2,
        "0"
      )}:${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds()
      ).padStart(2, "0")}:${String(now.getMilliseconds()).padStart(3, "0")}`;
  
      // Thêm thời gian mới vào mảng pressTimesStart và lưu vào localStorage
      setPressTimesStart((prevTimes) => {
        const updatedTimes = [...prevTimes, formattedTime];
  
        // Lưu mảng updatedTimes vào localStorage
        localStorage.setItem("pressTimesStart", JSON.stringify(updatedTimes));
  
        console.log("Press times (Start):", updatedTimes); // In ra toàn bộ mảng sau mỗi lần nhấn
        return updatedTimes;
      });
  
      // Khóa Space lại (chỉ cho nhấn 1 lần trong xử lý)
      setCanPressSpace(false);
  
      // Gọi API với transformedConfig
      console.log("Calling API with config:", transformedConfig);
      const response = await runExp(transformedConfig);
      console.log("API response:", response);
  
      // Kích hoạt chạy (bên ExperimentItem)
      setActivatePlay(true);
  
      // Sau 1 giây thì hiển thị "Press C"
      setTimeout(() => {
        setActivatePlay(false);
        setShowContinueLine(true);
        setCanPressSpace(true); // Mở lại Space sau khi xử lý xong
      }, 1000);
    } catch (error) {
      console.error("Error calling API:", error.message);
      setCanPressSpace(true); // Nếu lỗi, cho phép nhấn lại
    }
  };
  

  // Lắng nghe phím "Space" & "C"
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isProcessing) return; // Đang xử lý thì bỏ qua

      if (event.key === "c" || event.key === "C") {
        handleNext();
      } else if (event.code === "Space") {
        handleStartNewTrial();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentIndex, isProcessing, canPressSpace, transformedConfig]);

  // Nếu chưa có experiment nào, hiển thị "Loading..."
  if (!currentExperiment) {
    return <div className="text-lg text-gray-600">Loading...</div>;
  }

  return (
    <>
      {isSubmitID && (
        <>
          {/* Chỉ hiển thị hai dòng chỉ dẫn */}
          <div className="flex flex-col items-center my-16">
            {/* <span>Start {JSON.stringify(pressTimesStart)}</span>
            <span>End {JSON.stringify(pressTimeEnd)}</span> */}
            <p
              className={`text-4xl font-bold text-gray-800 transition-opacity duration-500 ${
                showContinueLine ? "opacity-0" : "opacity-100"
              }`}
            >
              Press{" "}
              <span className="bg-gray-300 px-6 py-3 rounded text-gray-900 font-extrabold shadow-lg">
                SPACEBAR
              </span>{" "}
              to start a new trial.
            </p>

            <p
              className={`text-4xl font-bold text-gray-800 mt-8 transition-opacity duration-500 ${
                showContinueLine ? "opacity-100" : "opacity-0"
              }`}
            >
              When you are done, Press{" "}
              <span className="bg-gray-300 px-6 py-3 rounded text-gray-900 font-extrabold shadow-lg">
                C
              </span>{" "}
              on the keyboard to Continue.
            </p>
          </div>

          {/* Ẩn ExperimentItem khỏi UI, nhưng vẫn dùng để chạy logic */}
          <div className="invisible">
            <ExperimentItem
              {...currentExperiment}
              index={currentIndex}
              activatePlay={activatePlay}
              onStartProcessing={() => setIsProcessing(true)}
              onEndProcessing={() => setIsProcessing(false)}
            />
          </div>
        </>
      )}
    </>
  );
};
