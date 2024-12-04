import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowBigLeft, Send } from "lucide-react";
import { Button } from "../../commons/Button";
import { NodeConfiguration } from "../../commons/NodeConfiguration";
import { runExp } from "../../apis/callAPI";

export const ExperimentSetup = () => {
  const [matrixSize, setMatrixSize] = useState(3);
  const [buttonProperty, setButtonProperty] = useState("");
  const [intensity, setIntensity] = useState(0);
  const [duration, setDuration] = useState(0);
  const [order, setOrder] = useState(1);
  const [listings, setListings] = useState([]); // Tracks saved nodes
  const [error, setError] = useState("");
  const [type, setType] = useState(null); // State for Sequential/Simultaneous
  const [openSeq, setOpenSeq] = useState(false);
  const [openSerial, setOpenSerial] = useState(false);
  const [delay, setDelay] = useState(undefined);
  const [delaySerial, setDelaySerial] = useState(undefined);
  const [delayPerNode, setDelayPerNode] = useState(undefined);

  const getSliderBackground = (value, max) => {
    const percentage = (value / max) * 100;
    return `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
  };


  const saveAndOut = () => {
    if (!openSerial && (!intensity || !duration)) {
      setError("Please fill out all required fields!");
      return;
    }
  
    const newListing = {
      node: buttonProperty,
      intensity: parseInt(intensity, 10) || 0, // Default to 0 if empty
      duration: parseInt(duration, 10) || 0, // Default to 0 if empty
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
  
    setButtonProperty("");
    setIntensity(0);
    setDuration(0);
    setOrder(order);
  };
  

  // Matrix orders state
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

  const handleSequential = () => {
    setOpenSeq(true);
    setOpenSerial(false);
    setType("Sequential");
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
  
      // Add `delay` if it is not undefined
      if (delay !== undefined) {
        payload.delay = delay;
      }
  
      if (type !== null && delayPerNode !== undefined && delaySerial !== undefined) {
        // Transform `listings` to only include `node` values
        const transformedListings = listings.map(item => item.node);
  
        payload.listings = transformedListings; // Replace listings with transformed array
        payload.duration = parseFloat(delaySerial); // Ensure it's a number
        payload.delay = parseFloat(delayPerNode);   // Ensure it's a number
        payload.type = type;
      }
  
      const response = await runExp(payload);
      console.log(response.data);
      // setListingsNode(response.data);
    } catch (error) {
      console.error("Error running experiment:", error);
    }
  };
  
  
  return (
    <div className="flex flex-col md:flex-row w-full h-fit bg-gray-100">
      {/* Main content area */}
      <div className="md:w-3/4 p-3">
        {/* Top navigation and action buttons */}
        <div className="flex items-center justify-between mb-2">
          <Link
            to="/"
            className="px-6 py-0.5 bg-gray-300 rounded-full mr-2 hover:bg-gray-400"
          >
            <ArrowBigLeft />
          </Link>
          <h2 className="text-lg font-semibold">
            Matrix Size: {matrixSize}x{matrixSize}
          </h2>
        </div>

        {/* Dropdown for matrix size */}
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
        {/* <p>{JSON.stringify(listings)}</p> */}
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
                      : "bg-gray-400 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {node}
                </Button>
              );
            })
          )}
        </div>

        {/* Sequential and Simultaneous Buttons */}
        <div className="flex justify-between mt-4">
          <Button
            onClick={handleSequential}
            className={`w-1/2 py-2 mr-2 rounded transition-all duration-200 ${
              type === "Sequential"
                ? "bg-blue-800 text-white shadow-md"
                : "bg-gray-400 text-gray-700 hover:bg-gray-300 hover:text-white"
            }`}
          >
            Sequential
          </Button>
          <Button
            onClick={handleSimultaneous}
            className={`w-1/2 py-2 ml-2 rounded transition-all duration-200 ${
              type === "Simultaneous"
                ? "bg-blue-800 text-white shadow-md"
                : "bg-gray-400 text-gray-700 hover:bg-gray-300 hover:text-white"
            }`}
          >
            Simultaneous
          </Button>
          <Button
            onClick={handleSerial}
            className={`w-1/2 py-2 ml-2 rounded transition-all duration-200 ${
              type === "Serial"
                ? "bg-blue-800 text-white shadow-md"
                : "bg-gray-400 text-gray-700 hover:bg-gray-300 hover:text-white"
            }`}
          >
            Serial
          </Button>
        </div>

        {openSeq ? (
  <div className="my-4">
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
) : openSerial ? (
  <>
    <div className="my-4">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Duration (0 - 15): {delaySerial}
      </label>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="15"
          step="0.1"
          value={delaySerial}
          onChange={(e) => setDelaySerial(e.target.value)}
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
            background: getSliderBackground(delaySerial, 15),
          }}
        />
      </div>
    </div>
    <div className="my-4">
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
) : null}



        {/* Submit Button */}
        <div className="mt-4 flex items-center justify-center w-full">
          <Button
            onClick={handleSubmit}
            className="w-full px-8 py-6 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white text-2xl font-bold rounded-full shadow-md hover:shadow-lg hover:from-green-500 hover:to-green-700 flex items-center justify-center transition-all duration-300"
          >
            <Send size={30} className="mr-3" />
            Submit All Feedback
          </Button>
        </div>
      </div>

      {/* Node Configuration Modal */}
      {buttonProperty &&  (
        <NodeConfiguration
          isSerial = {openSerial}
          isEdit={false}
          nodeNumber={buttonProperty}
          intensity={intensity}
          setIntensity={setIntensity}
          duration={duration}
          setDuration={setDuration}
          order={order}
          setOrder={setOrder}
          listings={listings}
          onClose={() => setButtonProperty(null)}
          onSave={saveAndOut}
          error={error}
        />
      )}
    </div>
  );
};
