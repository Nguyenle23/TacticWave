import React, { useState } from "react";
import { StatisticsCard } from "./StatisticsCard";
import { Button } from "../../commons/Button";
import { Modal } from "../../commons/Modal";

export const Statistics = () => {
  const [showModal, setShowModal] = useState(false);

  const stats = [
    { title: "Experiment", count: "7" },
    { title: "Creator", count: "5" },
    { title: "Matrix 3x3", count: "2" },
    { title: "Matrix 4x4", count: "2" },
    { title: "Matrix 5x5", count: "3" },
  ];

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium mb-4">Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
        {stats.map((stat, index) => (
          <StatisticsCard key={index} {...stat} />
        ))}
      </div>
      <Button className="w-full mt-4" onClick={openModal}>
        Create new
      </Button>

      {showModal && (
        <Modal
          onClose={closeModal}
          modalTitle="Choose Matrix Size"
          selectField={{
            name: "matrixSize",
            label: "Matrix Size",
            required: true,
            options: [
              { value: "3", label: "Matrix 3x3" },
              { value: "4", label: "Matrix 4x4" },
              { value: "5", label: "Matrix 5x5" },
            ],
          }}
        />
      )}
    </div>
  );
};
