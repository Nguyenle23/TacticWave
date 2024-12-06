import React from 'react';

const SwitchButton = ({ isOn, onSwitchChange }) => {
  const handleToggle = () => {
    onSwitchChange(!isOn); // Truyền trạng thái mới lên parent
  };

  return (
    <div className="my-4 flex items-center gap-4">
      <label className="relative inline-block w-14 h-8">
        <input
          type="checkbox"
          checked={isOn}
          onChange={handleToggle}
          className="sr-only peer"
        />
        <span
          className={`absolute inset-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-blue-500`}
        ></span>
        <span
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform transform peer-checked:translate-x-6`}
        ></span>
      </label>
      <span className="text-lg font-bold">{isOn ? 'Overlap ON' : 'Overlap OFF'}</span>
    </div>
  );
};

export default SwitchButton;
