// import React, { useState, useEffect } from "react";
// import { ExperimentItem } from "./ExperimentItem";
// import { runExp } from "../../apis/callAPI";

// export const ExperimentList = ({ isSubmitID, experiments }) => {
//   const [pressTimesStart, setPressTimesStart] = useState([]);
//   const [pressTimeEnd, setPressTimeEnd] = useState([]);
//   // Chỉ số experiment hiện tại
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Kích hoạt play (tự động gọi handlePlayExp bên trong ExperimentItem)
//   const [activatePlay, setActivatePlay] = useState(false);

//   // Trạng thái đang xử lý (processing)
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Ẩn/hiện dòng "Press C"
//   const [showContinueLine, setShowContinueLine] = useState(false);

//   // Chặn người dùng nhấn Space nhiều lần
//   const [canPressSpace, setCanPressSpace] = useState(true);

//   // Lấy ra experiment hiện tại từ mảng `experiments`
//   const currentExperiment = experiments[currentIndex];

//   // State lưu config đã transform
//   const [transformedConfig, setTransformedConfig] = useState({});

//   // show Break Notification
//   const [showBreakNotification, setShowBreakNotification] = useState(false);

//   // Hàm để transform dữ liệu (dành cho "Simultaneous" chẳng hạn)
//   const transformData = (input) => ({
//     listings: input.listings.map((node, index) => ({
//       node: node,
//       intensity: input.intensity[index],
//       duration: input.duration[index],
//       order: 1, // Giá trị tĩnh
//     })),
//     type: input.type,
//   });

//   // Mỗi khi `currentExperiment` thay đổi, ta transform lại config
//   useEffect(() => {
//     if (!currentExperiment || !currentExperiment.config) {
//       return; // Nếu chưa có currentExperiment hoặc không có config thì bỏ qua
//     }

//     let updatedConfig = { ...currentExperiment.config };

//     // Xóa `delay` nếu = 0
//     if (updatedConfig.delay === 0) {
//       delete updatedConfig.delay;
//     }

//     // Nếu type là "Simultaneous", transform theo logic
//     if (updatedConfig.type === "Simultaneous") {
//       updatedConfig = transformData(updatedConfig);
//     }

//     setTransformedConfig(updatedConfig);
//     console.log("------==p-----",currentExperiment)
//     // Nếu type là "Break", hiển thị thông báo
//     if (currentExperiment.type === "Simultaneous") {
//       setShowBreakNotification(true);
//     } else {
//       setShowBreakNotification(false);
//     }
//   }, [currentExperiment]);

//   // Chuyển sang experiment tiếp theo khi nhấn "C"
//   const handleNext = () => {
//     if (isProcessing) {
//       console.log("Processing... Cannot proceed to the next experiment.");
//       return;
//     }

//     // Lấy thời gian hiện tại
//     const now = new Date();
//     const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(
//       now.getMinutes()
//     ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}:${String(
//       now.getMilliseconds()
//     ).padStart(3, "0")}`;

//     // Thêm thời gian vào mảng nextTimes và lưu vào localStorage
//     setPressTimeEnd((prevTimes) => {
//       const updatedTimes = [...prevTimes, formattedTime];

//       // Lưu mảng updatedTimes vào localStorage
//       localStorage.setItem("pressTimeEnd", JSON.stringify(updatedTimes));

//       console.log("Next times:", updatedTimes); // In ra toàn bộ mảng sau mỗi lần nhấn
//       return updatedTimes;
//     });

//     // Reset cho phép nhấn Space
//     setCanPressSpace(true);

//     if (currentIndex < experiments.length - 1) {
//       setCurrentIndex((prev) => prev + 1); // Tăng chỉ số thử nghiệm hiện tại
//       setShowContinueLine(false); // Ẩn dòng "Press C"
//     }
//   };
//   // Bắt đầu thử nghiệm khi nhấn "Space"
//   const handleStartNewTrial = async () => {
//     if (isProcessing || !canPressSpace) {
//       console.log("Cannot start a new trial at the moment.");
//       return;
//     }

//     try {
//       // Lấy thời gian hiện tại
//       const now = new Date();
//       const formattedTime = `${String(now.getHours()).padStart(
//         2,
//         "0"
//       )}:${String(now.getMinutes()).padStart(2, "0")}:${String(
//         now.getSeconds()
//       ).padStart(2, "0")}:${String(now.getMilliseconds()).padStart(3, "0")}`;

//       // Thêm thời gian mới vào mảng pressTimesStart và lưu vào localStorage
//       setPressTimesStart((prevTimes) => {
//         const updatedTimes = [...prevTimes, formattedTime];

//         // Lưu mảng updatedTimes vào localStorage
//         localStorage.setItem("pressTimesStart", JSON.stringify(updatedTimes));

//         console.log("Press times (Start):", updatedTimes); // In ra toàn bộ mảng sau mỗi lần nhấn
//         return updatedTimes;
//       });

//       // Khóa Space lại (chỉ cho nhấn 1 lần trong xử lý)
//       setCanPressSpace(false);

//       // Gọi API với transformedConfig
//       // console.log("Calling API with config:", transformedConfig);
//       const response = await runExp(transformedConfig);
//       // console.log("API response:", response);

//       // Kích hoạt chạy (bên ExperimentItem)
//       setActivatePlay(true);

//       // Sau 1 giây thì hiển thị "Press C"
//       setTimeout(() => {
//         setActivatePlay(false);
//         setShowContinueLine(true);
//         setCanPressSpace(true); // Mở lại Space sau khi xử lý xong
//       }, 1000);
//     } catch (error) {
//       console.error("Error calling API:", error.message);
//       setCanPressSpace(true); // Nếu lỗi, cho phép nhấn lại
//     }
//   };

//   // Lắng nghe phím "Space" & "C"
//   useEffect(() => {
//     const handleKeyPress = (event) => {
//       if (isProcessing) return; // Đang xử lý thì bỏ qua

//       if (event.key === "c" || event.key === "C") {
//         handleNext();
//       } else if (event.code === "Space") {
//         handleStartNewTrial();
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => {
//       window.removeEventListener("keydown", handleKeyPress);
//     };
//   }, [currentIndex, isProcessing, canPressSpace, transformedConfig]);

//   // Nếu chưa có experiment nào, hiển thị "Loading..."
//   if (!currentExperiment) {
//     return <div className="text-lg text-gray-600">Loading...</div>;
//   }

//   if (showBreakNotification) {
//     return (
//       <div className="flex flex-col items-center">
//         {currentIndex === experiments.length - 1 ? (
//           <div>
//             <h1>End of Array</h1>
//             <p>The final "Break" element has been reached!</p>
//           </div>
//         ) : (
//           <div>
//             <h1>Break Notification</h1>
//             <p>A "Break" element was found at index {currentIndex}.</p>
//             <button
//               onClick={handleNext}
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Continue
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <>
//       {isSubmitID && (
//         <>
//           {/* Chỉ hiển thị hai dòng chỉ dẫn */}
//           <div className="flex flex-col items-center my-16">
//             {/* <span>Start {JSON.stringify(pressTimesStart)}</span>
//             <span>End {JSON.stringify(pressTimeEnd)}</span> */}
//             <p
//               className={`text-4xl font-bold text-gray-800 transition-opacity duration-500 ${
//                 showContinueLine ? "opacity-0" : "opacity-100"
//               }`}
//             >
//               Press{" "}
//               <span className="bg-gray-300 px-6 py-3 rounded text-gray-900 font-extrabold shadow-lg">
//                 SPACEBAR
//               </span>{" "}
//               to start a new trial.
//             </p>

//             <p
//               className={`text-4xl font-bold text-gray-800 mt-8 transition-opacity duration-500 ${
//                 showContinueLine ? "opacity-100" : "opacity-0"
//               }`}
//             >
//               When you are done, Press{" "}
//               <span className="bg-gray-300 px-6 py-3 rounded text-gray-900 font-extrabold shadow-lg">
//                 C
//               </span>{" "}
//               on the keyboard to Continue.
//             </p>
//           </div>

//           {/* Ẩn ExperimentItem khỏi UI, nhưng vẫn dùng để chạy logic */}
//           <div className="invisible">
//             <ExperimentItem
//               {...currentExperiment}
//               index={currentIndex}
//               activatePlay={activatePlay}
//               onStartProcessing={() => setIsProcessing(true)}
//               onEndProcessing={() => setIsProcessing(false)}
//             />
//           </div>
//         </>
//       )}
//     </>
//   );
// };

import React, { useState, useEffect } from "react";
import { ExperimentItem } from "./ExperimentItem";
import { runExp } from "../../apis/callAPI";
import { ArrowBigLeft, Download } from "lucide-react";

// Màn hình thank you
const ThankYouScreen = ({ userID }) => {
  const handleExportData = () => {
    // Collect data from localStorage
    const experimentData = {
      pressTimesStart: JSON.parse(
        localStorage.getItem("pressTimesStart") || "[]"
      ),
      vibratingTimes: JSON.parse(
        localStorage.getItem("vibratingTimes") || "[]"
      ),
      pressTimeEnd: JSON.parse(localStorage.getItem("pressTimeEnd") || "[]"),
    };

    // Create Blob with the data
    const blob = new Blob([JSON.stringify(experimentData, null, 2)], {
      type: "application/json",
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Set download attributes
    link.href = url;
    link.download = `experiment_data_userID_${userID}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Clean up the link object
    URL.revokeObjectURL(link.href);

    // Clear localStorage
    localStorage.removeItem("pressTimesStart");
    localStorage.removeItem("pressTimeEnd");
    localStorage.removeItem("vibratingTimes");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white-50">
      <h1 className="text-6xl font-bold text-gray-800 mb-6">Thank You!</h1>
      <p className="text-2xl text-gray-600 mb-8">
        The experiment is now complete.
      </p>
      <p className="text-2xl text-gray-600 mb-8">
        Cảm ơn bạn đã tham gia thử nghiệm, chúc bạn năm mới vui vẻ và may mắn,
        nhiều sức khoẻ và thành công trong công việc. Nếu bạn cần thông tin thêm
        về thử nghiệm hoặc cần thêm thông tin về sản phẩm, vui lòng liên hệ với
        chúng tôi qua email: dodien981@gmail.com hoặc số điện thoại: 113. 
        <br />
        Chúng tôi luôn sẵn sàng nghe ý kiến đóng góp từ bạn. Lần cuối, chúc bạn 8386
        mãi đỉnh, năm mới, nhiều niềm vui mới, cầu gì được nấy Cầu tình được
        tình, cầu tài được tài, happy new year, mãi yêu bạn, Chúc bạn sống mãi
        trong ánh sáng của 10 chương dương Phật, lớp bờ you - Teacher 3
      </p>

      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center px-6 py-3 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors duration-200"
        >
          <ArrowBigLeft className="mr-2" />
          <span>Refresh Page</span>
        </button>

        <button
          onClick={handleExportData}
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <Download className="mr-2" />
          <span>Export Data</span>
        </button>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        Notice: Your experiment data will be downloaded as a JSON file and the collected data in localStorage will be deleted!!!
      </div>
    </div>
  );
};

// Màn hình đếm ngược khi gặp type Break
const CountdownTimer = ({ onComplete, currentIndex, experimentsLength }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 2 minutes in seconds

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h2 className="text-4xl font-bold mb-4">Time Remaining</h2>
      <div className="text-6xl font-bold">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <p className="mt-8 text-xl text-gray-600">
        Please wait until the timer completes
      </p>

      {/* line nay de test index thui */}
      <p className="mt-4 text-lg text-blue-600">
        Testing Element {currentIndex} of {experimentsLength}
      </p>
    </div>
  );
};

export const ExperimentList = ({ isSubmitID, experiments, userID }) => {
  const [pressTimesStart, setPressTimesStart] = useState([]);
  const [pressTimeEnd, setPressTimeEnd] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activatePlay, setActivatePlay] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showContinueLine, setShowContinueLine] = useState(false);
  const [canPressSpace, setCanPressSpace] = useState(true);
  const [transformedConfig, setTransformedConfig] = useState({});
  const [showCountdown, setShowCountdown] = useState(false);

  const currentExperiment = experiments[currentIndex];

  // check co phai last break khong thi hien ra screen thank you
  const isLastBreak =
    currentIndex === experiments.length - 1 &&
    currentExperiment?.type === "Break";
  console.log(currentIndex);
  console.log(currentExperiment.type);

  const transformData = (input) => ({
    listings: input.listings.map((node, index) => ({
      node: node,
      intensity: input.intensity[index],
      duration: input.duration[index],
      order: 1,
    })),
    type: input.type,
  });

  useEffect(() => {
    console.log("Current Experiment Full:", currentExperiment);
    console.log("Type:", currentExperiment?.type);
    console.log("Config:", currentExperiment?.config);

    // If Break type, we shouldn't check for config
    if (currentExperiment?.type === "Break") {
      setShowCountdown(true);
      return; // Exit early for Break type
    }

    // Only proceed with config checks for non-Break types
    if (!currentExperiment || !currentExperiment.config) {
      console.log("No experiment or config found");
      return;
    }

    let updatedConfig = { ...currentExperiment.config };

    if (updatedConfig.delay === 0) {
      delete updatedConfig.delay;
    }

    if (updatedConfig.type === "Simultaneous") {
      updatedConfig = transformData(updatedConfig);
    }

    setTransformedConfig(updatedConfig);
  }, [currentExperiment]);

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    handleNext();
  };

  const handleNext = () => {
    if (isProcessing) {
      console.log("Processing... Cannot proceed to the next experiment.");
      return;
    }

    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}:${String(
      now.getMilliseconds()
    ).padStart(3, "0")}`;

    setPressTimeEnd((prevTimes) => {
      const updatedTimes = [...prevTimes, formattedTime];
      localStorage.setItem("pressTimeEnd", JSON.stringify(updatedTimes));
      return updatedTimes;
    });

    setCanPressSpace(true);

    if (currentIndex < experiments.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowContinueLine(false);
    }
  };

  const handleStartNewTrial = async () => {
    if (isProcessing || !canPressSpace) {
      console.log("Cannot start a new trial at the moment.");
      return;
    }

    try {
      const now = new Date();
      const formattedTime = `${String(now.getHours()).padStart(
        2,
        "0"
      )}:${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds()
      ).padStart(2, "0")}:${String(now.getMilliseconds()).padStart(3, "0")}`;

      setPressTimesStart((prevTimes) => {
        const updatedTimes = [...prevTimes, formattedTime];
        localStorage.setItem("pressTimesStart", JSON.stringify(updatedTimes));
        return updatedTimes;
      });

      setCanPressSpace(false);
      const response = await runExp(transformedConfig);
      console.log("API response:", response);
      setActivatePlay(true);

      setTimeout(() => {
        setActivatePlay(false);
        setShowContinueLine(true);
        setCanPressSpace(true);
      }, 1000);
    } catch (error) {
      console.error("Error calling API:", error.message);
      setCanPressSpace(true);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isProcessing) return;

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

  if (!currentExperiment) {
    return <div className="text-lg text-gray-600">Loading...</div>;
  }

  if (isLastBreak) {
    return <ThankYouScreen userID={userID} />;
  }

  if (showCountdown) {
    return (
      <CountdownTimer
        onComplete={handleCountdownComplete}
        currentIndex={currentIndex}
        experimentsLength={experiments.length}
      />
    );
  }

  return (
    <>
      {isSubmitID && (
        <>
          <div className="flex flex-col items-center my-16">
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
