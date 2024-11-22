import React, { useEffect, useState } from "react";
import { Button } from "../commons/Button";

export const MatrixGrid = ({ matrixSize, onUpdateListings }) => {
  const initialOrders = {};
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      initialOrders[`${row}-${col}`] = row * matrixSize + col + 1; // Assign node numbers
    }
  }

  const [orders] = useState(initialOrders); // State to hold node mapping
  const [pressCounts, setPressCounts] = useState({}); // Track the count of presses for each button

  // Reset `pressCounts` when `onUpdateListings` is explicitly set to `null`
  useEffect(() => {
    if (onUpdateListings === null) {
      setPressCounts({});
    }
  }, [onUpdateListings]);

  const toggleButton = (row, col) => {
    const key = `${row}-${col}`;
    const nodeNumber = orders[key];

    // Update press counts
    setPressCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      newCounts[nodeNumber] = (newCounts[nodeNumber] || 0) + 1; // Increment count

      // Generate updated listings
      const updatedListings = Object.entries(newCounts).map(
        ([node, count], index) => ({
          index: index + 1,
          nodeNumber: parseInt(node, 10),
          pressedCount: count,
        })
      );

      // Notify parent component with updated listings
      if (onUpdateListings) {
        onUpdateListings(updatedListings);
      }

      return newCounts;
    });
  };

  return (
    <div
      className={`grid grid-cols-${matrixSize} gap-4 mt-1`}
      style={{
        gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: matrixSize }).map((_, row) =>
        Array.from({ length: matrixSize }).map((_, col) => {
          const key = `${row}-${col}`;
          const nodeNumber = orders[key];
          const isPressed = pressCounts[nodeNumber] > 0; // Check if the button has been pressed at least once

          return (
            <Button
              key={key}
              onClick={() => toggleButton(row, col)}
              className={`w-full h-16 ${
                isPressed ? "bg-blue-500" : "bg-gray-500"
              } rounded-3xl flex items-center justify-center text-2xl font-bold`}
            >
              {nodeNumber}
            </Button>
          );
        })
      )}
    </div>
  );
};
