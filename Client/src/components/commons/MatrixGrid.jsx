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
  const [pressSequence, setPressSequence] = useState([]); // Store the sequence of presses

  // Reset `pressSequence` when `onUpdateListings` is explicitly set to `null`
  useEffect(() => {
    if (onUpdateListings === null) {
      setPressSequence([]);
    }
  }, [onUpdateListings]);

  const toggleButton = (row, col) => {
    const key = `${row}-${col}`;
    const nodeNumber = orders[key];

    setPressSequence((prevSequence) => {
      // Prevent duplicate entries
      const newSequence = prevSequence.includes(nodeNumber)
        ? prevSequence
        : [...prevSequence, nodeNumber];

      // Generate updated listings
      const updatedListings = newSequence.map((node, index) => ({
        index: index + 1,
        nodeNumber: node,
        pressedCount: 1, // Always 1 since each node is unique in the sequence
      }));

      // Notify parent component with updated listings
      if (onUpdateListings) {
        onUpdateListings(updatedListings);
      }

      return newSequence;
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
          const isPressed = pressSequence.includes(nodeNumber); // Check if the button is in the sequence

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
