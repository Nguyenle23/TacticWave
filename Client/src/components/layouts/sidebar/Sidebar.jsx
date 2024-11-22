import React, { useState } from "react";
import {
  NAVIGATION_ITEMS,
  MANAGE_ITEMS,
  OPTION_ITEMS,
} from "../../../constants/navigation";
import { SidebarItem } from "./SidebarItem";
import { Modal } from "../../commons/Modal";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="hidden lg:block w-64 bg-white border-r h-screen p-4 relative">
      <div className="mb-8">
        <Link to="/dashboard">
          <h1 className="text-3xl font-bold text-blue-700 text-left cursor-pointer">
            TacticWave
          </h1>
        </Link>
      </div>

      <div className="space-y-2">
        {NAVIGATION_ITEMS.map((item) => (
          <SidebarItem
            key={item.path}
            {...item}
            onClick={item.label === "Create Experiment" ? openModal : undefined}
          />
        ))}

        {/* Create experiment */}
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

      <div className="mt-8">
        <div className="text-sm text-gray-500 mb-2">MANAGE</div>
        <div className="space-y-2">
          {MANAGE_ITEMS.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 left-3.5">
        <div className="text-sm text-gray-500 mb-2">OPTIONS</div>
        <div className="space-y-2">
          {OPTION_ITEMS.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};
