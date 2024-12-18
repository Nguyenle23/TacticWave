import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowBigLeft, Send } from "lucide-react";
import { Button } from "../../commons/Button";
import { NodeConfiguration } from "../../commons/NodeConfiguration";
import { runExp } from "../../apis/callAPI";
import SwitchButton from "../../commons/Switch";

export const ExperimentSetup = () => {
  const [matrixSize, setMatrixSize] = useState(3);
  const [buttonProperty, setButtonProperty] = useState(1); // Initialize to default node
  const [intensity, setIntensity] = useState(0);
  const [duration, setDuration] = useState(0);
  const [order, setOrder] = useState(1);
  const [listings, setListings] = useState([]); // Tracks saved nodes
  const [error, setError] = useState("");
  const [type, setType] = useState(null); // State for Sequential/Simultaneous
  const [openSeq, setOpenSeq] = useState(false);
  const [openSerial, setOpenSerial] = useState(false);
  const [delay, setDelay] = useState(undefined);
  const [delayPerNode, setDelayPerNode] = useState(undefined);

  // Update buttonProperty when matrixSize changes
  useEffect(() => {
    setButtonProperty(null);
  }, [matrixSize]);

  const getSliderBackground = (value, max) => {
    const percentage = (value / max) * 100;
    return `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
  };

  const handleSwitchChange = (newState) => {
    setType(newState ? "Overlap" : "Serial");
  };

  const saveAndOut = () => {
    if (!openSerial && (!intensity || !duration)) {
      setError("Please fill out all required fields!");
      return;
    }

    const newListing = {
      node: buttonProperty,
      intensity: parseInt(intensity, 10) || 0, // Default to 0 if empty
      duration: parseFloat(duration, 10) || 0, // Default to 0 if empty
      order: order,
    };

    // Update listings to highlight saved nodes
    setListings((prevListings) => {
      const updatedListings = [...prevListings];
      const existingIndex = updatedListings.findIndex(
        (item) => item.node === buttonProperty
      );
      if (existingIndex >= 0) {
        updatedListings[existingIndex] = newListing; // Update existing entry
      } else {
        updatedListings.push(newListing); // Add new entry
      }
      return updatedListings;
    });

    // Reset fields after saving
    setButtonProperty(0); // Reset to default node if needed
    setIntensity(0);
    setDuration(0);
    setOrder(order);
  };

  // Initialize matrix orders
  const initialOrders = {};
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      initialOrders[`${row}-${col}`] = row * matrixSize + col + 1;
    }
  }
  const [orders, setOrders] = useState(initialOrders);

  const handleMatrixSizeChange = (event) => {
    setListings([]);
    const size = parseInt(event.target.value, 10);
    setMatrixSize(size);
    setOrders(() => {
      const newOrders = {};
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          newOrders[`${row}-${col}`] = row * size + col + 1;
        }
      }
      return newOrders;
    });
  };

  const handleClick = (row, col) => {
    const order = orders[`${row}-${col}`];
    setButtonProperty(order);
    setIntensity(0);
    setDuration(0);
  };

  const handleSimultaneous = () => {
    setOpenSeq(false);
    setOpenSerial(false);
    setDelay(undefined);
    setType("Simultaneous");
  };

  const handleSerial = () => {
    setOpenSeq(false);
    setDelay(undefined);
    setOpenSerial(true);
    setType("Serial");
  };

  const isNodeSaved = (node) => listings.some((item) => item.node === node);

  // Handle Submit button click
  const handleSubmit = async () => {
    try {
      const payload = {
        listings,
        type,
      };

      // Add delay if it is not undefined
      if (delay !== undefined) {
        payload.delay = delay;
      }

      if (type !== null && delayPerNode !== undefined) {
        // Transform listings to only include node values
        const transformedListings = listings.map((item) => item.node);
        const transformedDurations = listings.map((item) => item.duration);
        const transformedIntensities = listings.map((item) => item.intensity);

        payload.listings = transformedListings; // Replace listings with transformed array
        payload.duration = transformedDurations; // Ensure it's a number
        payload.intensity = transformedIntensities; // Ensure it's a number
        payload.delay = parseFloat(delayPerNode); // Ensure it's a number
        payload.type = type;
      }
      console.log("Payload:", payload);
      const response = await runExp(payload);
      // console.log("Response:", response.data);
      // setListingsNode(response.data);
    } catch (error) {
      console.error("Error running experiment:", error);
    }
  };

  return (
    <div className="flex flex-row md:flex-col w-full h-fit bg-gray-10 gap-8 my-4 px-4">
      {/* Setup demographic*/}
      <div className="md:w-2/5 w-full">
        {/* Top navigation and action buttons */}
        <div className="flex items-center justify-between mb-2">
          <Link
            to="/"
            className="px-6 py-0.5 bg-gray-300 rounded-full mr-2 hover:bg-gray-400"
          >
            <ArrowBigLeft />
          </Link>
        </div>

        <div className="mb-4">
          <label htmlFor="matrix-size" className="mr-2 text-lg font-medium">
            Select Matrix Size:
          </label>
          <select
            id="matrix-size"
            value={matrixSize}
            onChange={handleMatrixSizeChange}
            className="p-2 border rounded"
          >
            <option value="3">3x3</option>
            <option value="4">4x4</option>
            <option value="5">5x5</option>
          </select>
        </div>
        {/* <p>{JSON.stringify(type)}</p> */}

        {/* Matrix Display */}
        <div
          className={`grid grid-cols-${matrixSize} gap-4 mt-1`}
          style={{
            gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: matrixSize }).map((_, row) =>
            Array.from({ length: matrixSize }).map((_, col) => {
              const node = orders[`${row}-${col}`];
              return (
                <Button
                  key={`${row}-${col}`}
                  onClick={() => handleClick(row, col)}
                  className={`w-full h-16 rounded-3xl flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
                    buttonProperty === node || isNodeSaved(node)
                      ? "bg-blue-800 text-white shadow-md"
                      : "bg-white text-black hover:bg-gray-300 border-2 border-solid border-black"
                  }`}
                >
                  {node}
                </Button>
              );
            })
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex items-center justify-center w-full">
          <Button
            onClick={handleSubmit}
            className="w-full px-8 py-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white text-2xl font-bold rounded-full shadow-md hover:shadow-lg hover:from-green-500 hover:to-green-700 flex items-center justify-center transition-all duration-300"
          >
            <Send size={30} className="mr-3" />
            Activating Vibration Motor
          </Button>
        </div>
        {/* Sequential and Simultaneous Buttons */}
      </div>

      <div className="md:w-3/5 w-full flex flex-col">
        <div className="flex justify-between items-start p-6">
          {/* Phần "hello" bên trái */}
          <div className="w-4/12">
            <h1 className="text-2xl font-bold mb-2">Demographic</h1>
            <p className="text-gray-700">
              Select the type of signal that you wish to receive.
            </p>
          </div>

          {/* Phần bên phải theo cột */}
          <div className="w-6/12 flex flex-col space-y-4">
            {/* Nhóm Nút "Serial" và "Simultaneous" */}
            <h1 className="text-xl font-bold mb-2">Tactile</h1>
            <div className="flex space-x-2">
              <Button
                onClick={handleSerial}
                className={`w-1/2 py-2 rounded transition-all duration-200 ${
                  type === "Serial" || type === "Overlap"
                    ? "bg-blue-800 text-white shadow-md"
                    : "bg-white border-2 border-solid border-black  hover:bg-gray-300 hover:text-black"
                }`}
              >
                Serial
              </Button>
              <Button
                onClick={handleSimultaneous}
                className={`w-1/2 py-2 rounded transition-all duration-200 ${
                  type === "Simultaneous"
                    ? "bg-blue-800 text-white shadow-md"
                    : "bg-white border-2 border-solid border-black  hover:bg-gray-300 hover:text-black"
                }`}
              >
                Simultaneous
              </Button>
            </div>

            {/* Các thành phần điều kiện khi chọn Serial hoặc Overlap */}
            {(openSeq || openSerial) && (
              <div className="flex flex-col space-y-4">
                {openSeq && (
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Duration (0 - 15): {delay}
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="15"
                        value={delay}
                        onChange={(e) => setDelay(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                               focus:outline-none focus:ring-0
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                               [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 
                               [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                               [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150
                               [&::-webkit-slider-thumb]:hover:scale-110
                               [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 
                               [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-500 
                               [&::-moz-range-thumb]:border-0 
                               [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer
                               [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150
                               [&::-moz-range-thumb]:hover:scale-110
                               [&::-moz-range-progress]:bg-blue-500 [&::-moz-range-progress]:rounded-l-lg
                               [&::-moz-range-track]:bg-gray-200 [&::-moz-range-track]:rounded-lg"
                        style={{
                          background: getSliderBackground(delay, 15),
                        }}
                      />
                    </div>
                  </div>
                )}

                {openSerial && (
                  <>
                    <SwitchButton
                      isOn={type === "Overlap"}
                      onSwitchChange={handleSwitchChange}
                    />

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Delay between nodes (0 - 15): {delayPerNode}
                      </label>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="15"
                          step="0.1"
                          value={delayPerNode}
                          onChange={(e) => setDelayPerNode(e.target.value)}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                                 focus:outline-none focus:ring-0
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                                 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 
                                 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                                 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150
                                 [&::-webkit-slider-thumb]:hover:scale-110
                                 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 
                                 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-500 
                                 [&::-moz-range-thumb]:border-0 
                                 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer
                                 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-150
                                 [&::-moz-range-thumb]:hover:scale-110
                                 [&::-moz-range-progress]:bg-blue-500 [&::-moz-range-progress]:rounded-l-lg
                                 [&::-moz-range-track]:bg-gray-200 [&::-moz-range-track]:rounded-lg"
                          style={{
                            background: getSliderBackground(delayPerNode, 15),
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Slider Controls */}

        {buttonProperty && (
          <div className="flex justify-between items-start p-6">
            <NodeConfiguration
              isSerial={openSerial}
              isEdit={false}
              nodeNumber={buttonProperty}
              intensity={intensity}
              setIntensity={setIntensity}
              duration={duration}
              setDuration={setDuration}
              order={order}
              setOrder={setOrder}
              listings={listings}
              onClose={() => setButtonProperty(1)} // Reset to default node on close
              onSave={saveAndOut}
              error={error}
            />
          </div>
        )}
      </div>
    </div>
  );
};
