import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  ArrowBigLeft,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../../commons/Button";
import { Modal } from "../../commons/Modal";
import { ModalAction } from "../../commons/ModalAction";
import { createRecord } from "../../apis/callAPI";
import { NodeConfiguration } from "../../commons/NodeConfiguration";

export const ExperimentMatrix = ({}) => {
  // Edit state management
  const [editingListing, setEditingListing] = useState(null);
  const [editButtonProperty, setEditButtonProperty] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const optionsRef = useRef(null);
  const buttonRef = useRef(null);
  // Data input properties state
  const [showModal, setShowModal] = useState(false);
  const [buttonProperty, setButtonProperty] = useState("");
  const [intensity, setIntensity] = useState(0);
  const [duration, setDuration] = useState(0);
  const [order, setOrder] = useState(1);
  const [nameExperiment, setNameExperiment] = useState("");
  const [creator, setCreator] = useState("");
  const [listings, setListings] = useState([]);
  // Error state
  const [error, setError] = useState("");
  // Matrix variables
  const initialOrders = {};
  const [orders, setOrders] = useState(initialOrders);
  // Location and navigation hooks
  const location = useLocation();
  const matrixSize = location.state.matrixSize;
  const navigate = useNavigate();
  // Data object to be sent to the server
  const dataObject = {
    experimentName: nameExperiment,
    matrixSize: matrixSize,
    records: listings,
    creator: creator,
  };

  // Initial orders for the matrix
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      initialOrders[`${row}-${col}`] = row * matrixSize + col + 1;
    }
  }
  const handleClick = (row, col) => {
    const order = orders[`${row}-${col}`];
    setButtonProperty(order);
    setIntensity(0);
    setDuration(0);
  };

  // Function to get the background of the slider
  const getSliderBackground = (value, max) => {
    const percentage = (value / max) * 100;
    return `linear-gradient(to right, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%)`;
  };

  // Function to open and close the modal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Function to handle "Edit" button click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setShowOptions(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleToggleOptions = (index) => {
    setShowOptions(showOptions === index ? null : index);
  };
  const handleEditClick = (listing) => {
    setEditingListing(listing);
    setEditButtonProperty(listing.node);
    setIntensity(listing.intensity);
    setDuration(listing.duration);
    setOrder(listing.order);
  };

  // Function to handle "Save Edit" button click
  const saveEditAndOut = () => {
    if (!editingListing) return;

    setListings((prevListings) =>
      prevListings.map((item) =>
        item.order === editingListing.order
          ? {
              ...item,
              intensity: parseInt(intensity),
              duration: parseInt(duration),
              order: parseInt(order),
            }
          : item
      )
    );

    // Reset the edit state
    setEditingListing(null);
    setEditButtonProperty(null);
    setIntensity(0);
    setDuration(0);
    setOrder(order);
    setError("");
  };

  // Function to handle "Delete" button click
  const handleDeleteClick = (listing) => {
    setSelectedRecord(listing);
    setShowDeleteModal(true);
    setShowOptions(null);
  };
  const handleDeleteConfirm = () => {
    setListings((prevListings) =>
      prevListings.filter((listing) => listing !== selectedRecord)
    );
    setShowDeleteModal(false);
    setShowOptions(null);
    setSelectedRecord(null);
  };
  const deleteRecordHandler = async () => {
    setListings([]);
  };

  // Function to handle "Save Record" button click
  const saveAndOut = () => {
    if (!intensity || !duration) {
      setError("Please fill out all required fields!");
      return;
    }

    const newListing = {
      index: listings.length + 1,
      node: buttonProperty,
      intensity: parseInt(intensity, 10),
      duration: parseInt(duration, 10),
      order: order,
    };

    setListings((prevListings) => [...prevListings, newListing]);
    setButtonProperty("");
    setIntensity(0);
    setDuration(0);
    setOrder(order);
  };
  // Function to handle "Submit Record" button click
  const createRecordHandler = async () => {
    try {
      if (
        !dataObject.experimentName ||
        !dataObject.creator ||
        dataObject.records.length === 0
      ) {
        setError("Please fill out all required fields!");
        return;
      } else {
        await createRecord(dataObject).then(async (data) => {
          if (data.status === 200) {
            navigate("/");
          } else {
            setError("Error creating record");
          }
        });
      }
    } catch (error) {
      console.error(error);
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
          <div className="space-x-2">
            {/* <Button className="p-2 bg-gray-500 rounded">Download</Button> */}
            <Button
              className="p-2 bg-blue-500 text-white rounded hover:cursor-pointer"
              onClick={openModal}
            >
              Create Record
            </Button>
            <Button
              onClick={deleteRecordHandler}
              className="p-2 bg-red-600 text-white rounded hover:bg-red-800 hover:cursor-pointer"
            >
              Delete All Records
            </Button>
          </div>
        </div>

        {/* Data table */}
        <div className="h-64 overflow-y-auto block">
          <table className="w-full bg-white border-4 rounded">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="p-2 border">Index</th>
                <th className="p-2 border">Node Number</th>
                <th className="p-2 border">Intensity</th>
                <th className="p-2 border">Duration(s)</th>
                <th className="p-2 border">Order</th>
                <th className="p-2 border">Options</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 || error === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-red">
                    Please create a record
                  </td>
                </tr>
              ) : (
                listings.map((listing, index) => {
                  return (
                    <tr key={index} className="text-center">
                      <td className="p-2 border">{listing.index}</td>
                      <td className="p-2 border">{listing.node}</td>
                      <td className="p-2 border">{listing.intensity}</td>
                      <td className="p-2 border">{listing.duration}</td>
                      {/* <td className="p-2 border">{displayType}</td> */}
                      <td className="p-2 border">{listing.order}</td>

                      <td className="p-2 border relative">
                        <button
                          className="p-2 rounded bg-white text-black hover:bg-white hover:text-blue-500"
                          onClick={() => handleToggleOptions(listing.index)}
                        >
                          <MoreVertical size={20} className="text-gray-600" />
                        </button>

                        {showOptions === listing.index && (
                          <div
                            ref={optionsRef}
                            className="absolute right-1 top-10 z-50 w-24 py-2 bg-white border rounded-lg shadow-lg transform transition-all duration-200 ease-out"
                          >
                            <button
                              className="flex bg-white text-black items-center w-full px-4 py-2 text-sm hover:bg-white hover:text-blue-600"
                              onClick={() => handleEditClick(listing)}
                            >
                              <Edit
                                size={16}
                                className="mr-2 text-gray-400 group-hover:text-blue-500"
                              />
                              Edit
                            </button>

                            <button
                              className="flex bg-white text-black items-center w-full px-4 py-2 text-sm hover:bg-white hover:text-blue-600"
                              onClick={() => handleDeleteClick(listing)}
                            >
                              <Trash2
                                size={18}
                                className="mr-2 text-gray-400 group-hover:text-red-500"
                              />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Delete modal */}
            {showDeleteModal && (
              <ModalAction
                onSubmit={handleDeleteConfirm}
                onClose={() => setShowDeleteModal(false)}
              />
            )}
          </table>
        </div>

        {/* Create record modal: name experiment and creator */}
        {showModal && (
          <Modal
            onClose={closeModal}
            modalTitle="Create name of experiment"
            inputField={{
              name: "experimentName",
              label: "Experiment Name",
              placeholder: "Enter experiment name",
              required: true,
            }}
            additionalField={{
              name: "creator",
              label: "Creator",
              placeholder: "Enter your name",
              required: true,
            }}
            onSubmit={(e) => {
              setNameExperiment(e.experimentName);
              setCreator(e.creator);
              closeModal();
            }}
          />
        )}

        {/* Matrix and Submission*/}
        {nameExperiment && creator && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Experiment Name: {nameExperiment} -- Creator: {creator}
              </h2>

              {error && (
                <div className="bg-red-500 text-white p-2 rounded">{error}</div>
              )}

              <Button
                onClick={createRecordHandler}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Submit Experiment
              </Button>
            </div>
            <div
              className={`grid grid-cols-${matrixSize} gap-4 mt-1`}
              style={{
                gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: matrixSize }).map((_, row) =>
                Array.from({ length: matrixSize }).map((_, col) => (
                  <Button
                    key={`${row}-${col}`}
                    onClick={() => handleClick(row, col)}
                    className={`w-full h-16 bg-blue-500 rounded-3xl flex items-center justify-center text-2xl font-bold ${
                      buttonProperty === orders[`${row}-${col}`]
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                  >
                    {orders[`${row}-${col}`]}
                  </Button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Node Configuration Modal */}
      {buttonProperty && (
        <NodeConfiguration 
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

      {/* Edit Node Configuration Modal */}
      {editButtonProperty && (
        <NodeConfiguration 
          isEdit={true}
          nodeNumber={editButtonProperty}
          intensity={intensity}
          setIntensity={setIntensity}
          duration={duration}
          setDuration={setDuration}
          order={order}
          setOrder={setOrder}
          listings={listings}
          onClose={() => setEditButtonProperty(null)}
          onSave={() => saveEditAndOut(editButtonProperty)}
          error={error}
        />
      )}
    </div>
  );
};
