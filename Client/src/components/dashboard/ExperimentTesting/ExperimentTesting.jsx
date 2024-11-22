import React, { useState } from "react";
import { MatrixGrid } from "../../commons/MatrixGrid";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../commons/Button";
import {
  XIcon,
  ArrowBigLeft,
  AlertOctagonIcon,
  WavesIcon,
  Smile,
  Laugh,
  Meh,
  Frown,
  Annoyed,
} from "lucide-react";
import { submitFeedback, runExp } from "../../apis/callAPI";

export const ExperimentTesting = () => {
  const location = useLocation();
  const dataExp = location.state;

  const stageCount = [...new Set(dataExp.config.map((item) => item.Order))];
  const matrixSize = dataExp.matrixSize.split("x")[0];

  const [listingsNode, setListingsNode] = useState([]);
  const [resetGrid, setResetGrid] = useState(false);
  const handleUpdateListings = (updatedListings) => {
    setListingsNode(updatedListings);
    console.log(updatedListings);
  };
  const resetPressedNodes = () => {
    setResetGrid(true); // Trigger reset
    setTimeout(() => setResetGrid(false), 0); // Reset the `resetGrid` state
  };

  // Function to open and close the modal
  const [selectedStage, setSelectedStage] = useState(null);
  const openModal = (stageNumber) => {
    resetPressedNodes();
    setSelectedStage(stageNumber);
    setSelectedLoR(null);
  };
  const closeModal = () => setSelectedStage(null);

  const handleRunExp = async () => {
    try {
      const response = await runExp(dataExp.config);
      setListingsNode(response.data);
    } catch (error) {
      console.error("Error running experiment:", error);
      alert(
        "Add function pyserial vo di roi test signalling"
      );
    }
  };

  const [selectedLoR, setSelectedLoR] = useState(null); // Track selected LoR
  const handleLoRSelect = (level) => {
    setSelectedLoR(level);
  };

  const handleSubmit = async () => {
    if (!selectedLoR || !listingsNode) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const response = await submitFeedback({
        stageNumber: selectedStage,
        matrixGrid: listingsNode,
        levelOfRecognition: selectedLoR,
        experimentName: dataExp.experimentName,
        config: dataExp.config,
        totalNodes: dataExp.totalNodes,
        creator: dataExp.creator,
        matrixSize: dataExp.matrixSize,
      });
      console.log(response)

      if (response.status === 200) {
        alert("LoR submitted successfully!");
        setSelectedLoR(null); // Reset after successful submission
      } else {
        alert("Failed to submit LoR. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting LoR:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    resetPressedNodes();
    setSelectedLoR(null);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-fit bg-gray-100">
      {/* Main content area */}
      <div className="md:w-2/4 p-3">
        {/* Top navigation and action buttons */}
        <div className="flex items-center justify-between mb-2">
          <Link
            to="/"
            className="px-6 py-0.5 bg-gray-300 rounded-full mr-2 hover:bg-gray-400"
          >
            <ArrowBigLeft />
          </Link>
          <h2 className="text-lg font-semibold">
            Experiment Name: {dataExp.experimentName}
          </h2>

          <div className="space-x-2">
            <h2 className="text-lg font-semibold">
              Matrix Size: {dataExp.matrixSize}
            </h2>
          </div>
        </div>

        {/* Data table */}
        <div className="h-full overflow-y-auto block">
          <table className="w-full bg-white border-4 rounded-2xl border-red-500">
            <thead>
              {Array.from({ length: stageCount.length }).map((_, index) => {
                const stageNumber = index + 1; // Stage numbers start from 1
                return (
                  <React.Fragment key={stageNumber}>
                    <tr className="bg-gray-100 sticky top-0">
                      <th className="p-4 border">Stage {stageNumber}</th>
                      <th className="p-4 border">
                        <Button
                          className="w-full p-4 text-white text-lg bg-blue-500 hover:bg-blue-700"
                          onClick={() => openModal(stageNumber)}
                        >
                          Run Experiment
                        </Button>
                      </th>
                    </tr>
                  </React.Fragment>
                );
              })}
            </thead>
          </table>
        </div>
      </div>

      {/* Modal Signalling */}
      {selectedStage && (
        <div className="md:w-2/4 mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-3">
              Experiment Testing - Stage {selectedStage}
            </h1>

            <button
              onClick={closeModal}
              className="p-2 bg-red-500 text-white rounded-full mb-3 mx-3 hover:bg-red-600 hover:cursor-pointer transition-colors duration-200"
            >
              <XIcon size={20} />
            </button>
          </div>
          <div className="flex items-center justify-start mb-3">
            <AlertOctagonIcon size={30} className="text-red-500" />
            <h6 className="text-sm text-red-500 px-2">
              Note: Please press any button that you can feel on the device
            </h6>
          </div>
          <Button
            onClick={handleRunExp}
            className="w-full flex items-center justify-evenly mb-3 text-2xl border-2 rounded-lg border-black text-white rounded-l hover:bg-blue-700 transition-colors duration-200"
          >
            <WavesIcon size={30} />
            Signaling
            <WavesIcon size={30} />
          </Button>

          {/* Matrix Grid */}
          <MatrixGrid
            matrixSize={matrixSize}
            onUpdateListings={resetGrid ? null : handleUpdateListings}
          />

          {/* Level of Recognition */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold mt-3">Level of Recognition (LoR)</h3>
            </div>
            <div className="flex space-x-5">
              <button
                onClick={() => handleLoRSelect("No sensation")}
                className={`flex flex-col items-center justify-center flex-1 px-4 py-2 ${
                  selectedLoR === "No sensation"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                } rounded-l hover:bg-gray-400 transition-colors duration-200`}
              >
                <Annoyed size={20} className="mb-1" />
                No sensation
              </button>
              <button
                onClick={() => handleLoRSelect("Weak")}
                className={`flex flex-col items-center justify-center flex-1 px-4 py-2 ${
                  selectedLoR === "Weak"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                } rounded-l hover:bg-gray-400 transition-colors duration-200`}
              >
                <Frown size={20} className="mb-1" />
                Weak
              </button>
              <button
                onClick={() => handleLoRSelect("Moderate")}
                className={`flex flex-col items-center justify-center flex-1 px-4 py-2 ${
                  selectedLoR === "Moderate"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                } rounded-l hover:bg-gray-400 transition-colors duration-200`}
              >
                <Meh size={20} className="mb-1" />
                Moderate
              </button>
              <button
                onClick={() => handleLoRSelect("Strong")}
                className={`flex flex-col items-center justify-center flex-1 px-4 py-2 ${
                  selectedLoR === "Strong"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                } rounded-l hover:bg-gray-400 transition-colors duration-200`}
              >
                <Smile size={20} className="mb-1" />
                Strong
              </button>
              <button
                onClick={() => handleLoRSelect("Very strong")}
                className={`flex flex-col items-center justify-center flex-1 px-4 py-2 ${
                  selectedLoR === "Very strong"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                } rounded-l hover:bg-gray-400 transition-colors duration-200`}
              >
                <Laugh size={20} className="mb-1" />
                Very strong
              </button>
            </div>
            {/* Action Buttons */}
            <div className="flex space-x-5 pt-1">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-l hover:bg-cyan-600 transition-colors duration-200"
              >
                Reset
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-l hover:bg-green-600 transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
