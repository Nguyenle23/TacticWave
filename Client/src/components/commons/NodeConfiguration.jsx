import React from 'react';
import { XIcon } from 'lucide-react';

export const NodeConfiguration = ({
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
  error
}) => {
  const getSliderBackground = (value, max) => {
    const percentage = (value / max) * 100;
    return `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
  };

  return (
    <div className="md:w-1/3 mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">Node Configuration</h1>
        <button
          onClick={onClose}
          className="p-2 bg-red-500 text-white rounded-full mb-6 mx-3 hover:bg-red-600 transition-colors duration-200"
        >
          <XIcon size={10} />
        </button>
      </div>

      <div className="bg-gray-100 rounded-full px-4 py-2 mb-8 inline-block">
        <span className="text-blue-500 font-medium">
          Node Number {nodeNumber}
        </span>
      </div>

      <div className="space-y-6">
        {/* Intensity Slider */}
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

        {/* Duration Slider */}
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

        {/* Order Dropdown */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Order
          </label>
          <select
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
          >
            {listings.length === 0 ? (
              <option value="1">1</option>
            ) : (
              Array.from({ length: listings.length + 1 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-l hover:bg-green-600 transition-colors duration-200">
            Test Node
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-l hover:bg-blue-600 transition-colors duration-200"
          >
            {isEdit ? 'Adjust' : 'Save'}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>
    </div>
  );
};