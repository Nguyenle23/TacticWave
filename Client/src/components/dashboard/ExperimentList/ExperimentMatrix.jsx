import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  ArrowBigLeft,
  ArrowBigRight,
  XIcon,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../../commons/Button";
import { Modal } from "../../commons/Modal";
import { ModalAction } from "../../commons/ModalAction";
import { createRecord } from "../../apis/callAPI";

export const ExperimentMatrix = ({}) => {
  //ui slider
  const getSliderBackground = (value, max) => {
    const percentage = (value / max) * 100;
    return `linear-gradient(to right, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%)`;
  };

  //data matrix size
  const location = useLocation();
  const matrixSize = location.state.matrixSize;
  console.log(matrixSize);

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const [editingListing, setEditingListing] = useState(null);
  //options menu: edit and delete
  const [showOptions, setShowOptions] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const optionsRef = useRef(null);
  const buttonRef = useRef(null);
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
  // Function to handle the 'Edit' button click
  const handleEditClick = (listing) => {
    setEditingListing(listing);
    setEditButtonProperty(listing.node);
    setIntensity(listing.intensity);
    setDuration(listing.duration);
    setType(listing.type);
  };

  // Function to save changes and update the listings array
  // const saveEditAndOut = () => {
  //   console.log("editButtonProperty:", editButtonProperty);
  //   console.log("intensity:", intensity);
  //   console.log("duration:", duration);
  //   console.log("type:", type);
  
  //   // Update the listing with the matching order
  //   setListings((prevListings) =>
  //     prevListings.map((item) =>
  //       item.order === editButtonProperty
  //         ? { ...item, intensity, duration, type } // Update only the matched item
  //         : item
  //     )
  //   );
  
  //   // Reset the edit form and close the configuration panel
  //   setEditButtonProperty(null);
  //   setError(""); // Reset any error messages if needed
  // };
  const saveEditAndOut = () => {
    if (!editingListing) return;

    setListings((prevListings) =>
      prevListings.map((item) =>
        item.order === editingListing.order
          ? {
              ...item,
              intensity: parseInt(intensity),
              duration: parseInt(duration),
              type: type,
            }
          : item
      )
    );

    // Reset the edit state
    setEditingListing(null);
    setEditButtonProperty(null);
    setIntensity(0);
    setDuration(0);
    setType("");
    setError("");
  };


  // data matrix properties
  const initialOrders = {};
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      initialOrders[`${row}-${col}`] = row * matrixSize + col + 1;
    }
  }
  const [orders, setOrders] = useState(initialOrders);
  const [editButtonProperty, setEditButtonProperty] = useState("");
  const [buttonProperty, setButtonProperty] = useState("");
  const handleClick = (row, col) => {
    const order = orders[`${row}-${col}`];
    setButtonProperty(order);
    setIntensity(0);
    setDuration(0);
    setType("");
  };

  const [error, setError] = useState("");
  const [intensity, setIntensity] = useState(0);
  const [duration, setDuration] = useState(0);
  const [type, setType] = useState("");
  const [nameExperiment, setNameExperiment] = useState("");
  const [creator, setCreator] = useState("");
  const [listings, setListings] = useState([]);
  // const [listings, setListings] = useState([
  //   { order: 1, node: 3, intensity: 56, duration: 5, type: "Continue" },
  //   { order: 2, node: 3, intensity: 158, duration: 12, type: "Discrete" },
  //   {
  //     order: 3,
  //     node: 6,
  //     intensity: 175,
  //     duration: 3,
  //     type: "Continue - Node 3",
  //   },
  //   {
  //     order: 4,
  //     node: 9,
  //     intensity: 175,
  //     duration: 3,
  //     type: "Continue - Node 6",
  //   },
  //   { order: 5, node: 9, intensity: 175, duration: 3, type: "Discrete" },
  //   { order: 6, node: 12, intensity: 175, duration: 3, type: "Continue" },
  // ]);

  const saveAndOut = () => {
    if (!intensity || !duration || !type) {
      setError("Please fill out all required fields!");
      return;
    }

    const newListing = {
      order: listings.length + 1,
      node: buttonProperty,
      intensity: parseInt(intensity, 10),
      duration: parseInt(duration, 10),
      type: type,
    };

    setListings((prevListings) => [...prevListings, newListing]);
    setButtonProperty("");
    setIntensity(0);
    setDuration(0);
    setType("");
  };

  const dataObject = {
    experimentName: nameExperiment,
    matrixSize: matrixSize,
    records: listings,
    creator: creator,
  };
  console.log(dataObject);

  const createRecordHandler = async () => {
    try {
      //check if all field in dataObject is filled
      if (
        !dataObject.experimentName ||
        !dataObject.creator ||
        dataObject.records.length === 0
      ) {
        setError("Please fill out all required fields!");
        return;
      } else {
        const data = await createRecord(dataObject);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const deleteRecordHandler = async () => {
    //set listing empty
    setListings([]);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-fit bg-gray-100">
      <div className="md:w-2/3 p-3">
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
              className="p-2 bg-red-500 text-white rounded hover:bg-red-700 hover:cursor-pointer"
            >
              Delete All Records
            </Button>
          </div>
        </div>

        <div className="h-64 overflow-y-auto block">
          <table className="w-full bg-white border-4 rounded">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="p-2 border">Order</th>
                <th className="p-2 border">Node Number</th>
                <th className="p-2 border">Intensity</th>
                <th className="p-2 border">Duration(s)</th>
                <th className="p-2 border">Type</th>
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
                  const isSimultaneous =
                    listing.type === "Continue" &&
                    index !== 0 &&
                    listings[index - 1].type !== "Discrete";
                  const displayType = isSimultaneous
                    ? `${listing.type} - Node ${listings[index - 1].node}`
                    : listing.type;

                  return (
                    <tr key={index} className="text-center">
                      <td className="p-2 border">{listing.order}</td>
                      <td className="p-2 border">{listing.node}</td>
                      <td className="p-2 border">{listing.intensity}</td>
                      <td className="p-2 border">{listing.duration}</td>
                      <td className="p-2 border">{displayType}</td>
                      <td className="p-2 border relative">
                        <button
                          className="p-2 rounded bg-white text-black hover:bg-white hover:text-blue-500"
                          onClick={() => handleToggleOptions(index)}
                        >
                          <MoreVertical size={20} className="text-gray-600" />
                        </button>

                        {showOptions === index && (
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

            {showDeleteModal && (
              <ModalAction
                onSubmit={handleDeleteConfirm}
                onClose={() => setShowDeleteModal(false)}
              />
            )}
          </table>
        </div>

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

        {nameExperiment && (
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
                className="p-2 bg-green-500 text-white rounded"
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
                  <button
                    key={`${row}-${col}`}
                    onClick={() => handleClick(row, col)}
                    className={`w-full h-16 bg-blue-500 rounded flex items-center justify-center text-2xl font-bold ${
                      buttonProperty === orders[`${row}-${col}`]
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                  >
                    {orders[`${row}-${col}`]}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {buttonProperty && (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-6">Node Configuration</h1>
            <button
              onClick={() => setButtonProperty("")}
              className="p-2 bg-red-500 text-white rounded-full mb-6 mx-3 hover:bg-red-600 transition-colors duration-200"
            >
              <XIcon size={10} />
            </button>
          </div>

          <div className="bg-gray-100 rounded-full px-4 py-2 mb-8 inline-block">
            <span className="text-blue-500 font-medium">
              Node Number {buttonProperty}
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

            {/* Type Radio Buttons */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    value="Continue"
                    checked={type === "Continue"}
                    onChange={() => setType("Continue")}
                    className="hidden"
                  />
                  <div
                    className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2 flex items-center justify-center
                            group-hover:border-blue-500 transition-colors duration-200"
                  >
                    {type === "Continue" && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-500">
                    Continue
                  </span>
                </label>

                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    value="Discrete"
                    checked={type === "Discrete"}
                    onChange={() => setType("Discrete")}
                    className="hidden"
                  />
                  <div
                    className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2 flex items-center justify-center
                            group-hover:border-blue-500 transition-colors duration-200"
                  >
                    {type === "Discrete" && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-500">
                    Discrete
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-l hover:bg-green-600 transition-colors duration-200">
                Test Node
              </button>
              <button
                onClick={saveAndOut}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-l hover:bg-blue-600 transition-colors duration-200"
              >
                Save
              </button>
              {/* <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Save & Next Node
              </button> */}
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
          </div>
        </div>
      )}

      {editButtonProperty && (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-6">Node Configuration</h1>
            <button
              onClick={() => setEditButtonProperty(null)}
              className="p-2 bg-red-500 text-white rounded-full mb-6 mx-3 hover:bg-red-600 transition-colors duration-200"
            >
              <XIcon size={10} />
            </button>
          </div>

          <div className="bg-gray-100 rounded-full px-4 py-2 mb-8 inline-block">
            <span className="text-blue-500 font-medium">
              Node Number {editButtonProperty}
            </span>
          </div>

          {/* Rest of your configuration panel code */}
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
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-0"
                  style={{ background: getSliderBackground(intensity, 255) }}
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-0"
                  style={{ background: getSliderBackground(duration, 15) }}
                />
              </div>
            </div>

            {/* Type Radio Buttons */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    value="Continue"
                    checked={type === "Continue"}
                    onChange={() => setType("Continue")}
                    className="hidden"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2 flex items-center justify-center group-hover:border-blue-500 transition-colors duration-200">
                    {type === "Continue" && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-500">
                    Continue
                  </span>
                </label>

                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    value="Discrete"
                    checked={type === "Discrete"}
                    onChange={() => setType("Discrete")}
                    className="hidden"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2 flex items-center justify-center group-hover:border-blue-500 transition-colors duration-200">
                    {type === "Discrete" && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-blue-500">
                    Discrete
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-l hover:bg-green-600 transition-colors duration-200">
                Test Node
              </button>
              <button
                onClick={() => saveEditAndOut(editButtonProperty)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-l hover:bg-blue-600 transition-colors duration-200"
              >
                Adjust
              </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
