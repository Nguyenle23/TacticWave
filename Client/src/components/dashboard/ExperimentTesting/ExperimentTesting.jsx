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
  Radio,
  Send
} from "lucide-react";
import { submitFeedback, runExp } from "../../apis/callAPI";

export const ExperimentTesting = () => {
  const location = useLocation();
  const dataExp = location.state;

  const stageCount = [...new Set(dataExp.config.map((item) => item.Order))];
  const matrixSize = dataExp.matrixSize.split("x")[0];

  const [listingsNode, setListingsNode] = useState([]);
  const [resetGrid, setResetGrid] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedLoR, setSelectedLoR] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  const handleUpdateListings = (updatedListings) => {
    setListingsNode(updatedListings);
    console.log(updatedListings);
  };

  const resetPressedNodes = () => {
    setResetGrid(true);
    setTimeout(() => setResetGrid(false), 0);
  };

  const openModal = (stageNumber) => {
    resetPressedNodes();
    setSelectedStage(stageNumber);
    setSelectedLoR(null);
  };

  const closeModal = () => setSelectedStage(null);

  const handleRunExp = async () => {
    try {
      const response = await runExp(dataExp.config);
      console.log(response.data)
      // setListingsNode(response.data);
    } catch (error) {
      console.error("Error running experiment:", error);
      alert("Add function pyserial vo di roi test signalling");
    }
  };

  const handleLoRSelect = (level) => {
    setSelectedLoR(level);
  };

  const handleSubmit = () => {
    if (!selectedLoR || listingsNode.length === 0) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const feedback = {
      stageNumber: selectedStage,
      matrixGrid: listingsNode,
      levelOfRecognition: selectedLoR,
      experimentName: dataExp.experimentName,
      config: dataExp.config,
      totalNodes: dataExp.totalNodes,
      creator: dataExp.creator,
      matrixSize: dataExp.matrixSize,
    };

    setFeedbackList((prevList) => [...prevList, feedback]);
    alert(`Feedback for Stage ${selectedStage} saved locally.`);
    closeModal();
  };

  const handleSubmitAll = async () => {
    if (feedbackList.length === 0) {
      alert("No feedback to submit.");
      return;
    }

    try {
      const response = await submitFeedback(feedbackList);
      if (response.status === 200) {
        alert("All feedback submitted successfully!");
        setFeedbackList([]);
      } else {
        alert("Failed to submit feedback. Please try again.");
        console.error("Failed response:", response);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback. Please try again.");
    }
  };

  const handleReset = () => {
    resetPressedNodes();
    setSelectedLoR(null);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-fit bg-gray-100">
      <div className="md:w-2/4 p-3">
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

        <div className="overflow-y-auto block">
          <table className="w-full bg-white border-4 rounded-2xl border-red-500">
            <thead>
              {Array.from({ length: stageCount.length }).map((_, index) => {
                const stageNumber = index + 1;
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

        <div className="mt-4 flex items-center justify-center w-full">
          <Button
            onClick={handleRunExp}
            className="w-full px-8 py-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white text-2xl font-bold rounded-full shadow-md hover:shadow-lg hover:from-blue-500 hover:to-blue-700 flex items-center justify-center transition-all duration-300"
          >
            <Radio size={30} className="mr-3" />
            Signaling
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-center w-full">
          <Button
            onClick={handleSubmitAll}
            className="w-full px-8 py-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white text-2xl font-bold rounded-full shadow-md hover:shadow-lg hover:from-green-500 hover:to-green-700 flex items-center justify-center transition-all duration-300"
          >
            <Send size={30} className="mr-3" />
            Submit All Feedback
          </Button>
        </div>
      </div>

      {selectedStage && (
        <div className="md:w-2/4 mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-3">
              Experiment Testing - Stage {selectedStage}
            </h1>
            <button
              onClick={closeModal}
              className="p-2 bg-red-500 text-white rounded-full mb-3 mx-3 hover:bg-red-600 transition-colors duration-200"
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
          <MatrixGrid
            matrixSize={matrixSize}
            onUpdateListings={resetGrid ? null : handleUpdateListings}
          />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold mt-3">Level of Recognition (LoR)</h3>
            </div>
            <div className="flex space-x-5">
              {["No sensation", "Weak", "Moderate", "Strong", "Very strong"].map(
                (level, index) => (
                  <button
                    key={index}
                    onClick={() => handleLoRSelect(level)}
                    className={`flex flex-col items-center justify-center flex-1 px-4 py-2 ${
                      selectedLoR === level
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    } rounded-l hover:bg-gray-400 transition-colors duration-300`}
                  >
                    <Smile size={20} className="mb-1" />
                    {level}
                  </button>
                )
              )}
            </div>
            <div className="flex space-x-5 pt-1">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-l hover:bg-cyan-600 transition-all duration-300"
              >
                Reset
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-l hover:bg-green-600 transition-all duration-300"
              >
                Save Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
