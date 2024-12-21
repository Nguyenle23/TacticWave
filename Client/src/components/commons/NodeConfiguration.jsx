//node
import React from "react";
import { XIcon } from "lucide-react";

export const NodeConfiguration = ({
  isSerial,
  isEdit = false,
  nodeNumber,
  intensity,
  setIntensity,
  duration,
  setDuration,
  order,
  setOrder,
  listings,
  onClose,
  onSave,
  error,
}) => {
  const getSliderBackground = (value, max) => {
    const percentage = (value / max) * 100;
    return `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
  };

  return (
    <>
      <div className="w-4/12 flex flex-col gap-2 ">
          <h1 className="text-2xl font-bold mb-2">Configuration</h1>
          <p className="text-gray-700">
            Select the type of signal that you wish to receive.
          </p>
          <div className="bg-gray-100 px-4 py-2 mb-8 inline-block">
            <span className="text-blue-500 font-medium inline-flex justify-center items-center w-full">
              Node Number {nodeNumber}
            </span>
          </div>
      </div>

      <div className="w-6/12 flex flex-col space-y-4">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Intensity (0 - 255): {intensity}
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="255"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer
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
                background: getSliderBackground(intensity, 255),
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Duration (0 - 15 seconds): {duration}
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="15"
              value={duration}
              step={isSerial ? 0.1 : 1}
              onChange={(e) => setDuration(e.target.value)}
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
                background: getSliderBackground(duration, 15),
              }}
            />
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-l hover:bg-blue-600 transition-colors duration-200"
          >
            {isEdit ? "Adjust" : "Save"}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>
      </>
  );
};
