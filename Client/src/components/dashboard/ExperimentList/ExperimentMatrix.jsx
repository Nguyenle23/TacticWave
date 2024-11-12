import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowBigLeft, ArrowBigRight, XIcon } from "lucide-react";
import { Button } from "../../commons/Button";

export const ExperimentMatrix = ({}) => {
  const [intensity, setIntensity] = useState(85);
  const [duration, setDuration] = useState(85);
  const [type, setType] = useState("Together");

  const [listings, setListings] = useState([
    { order: 1, name: "Testing 1", node: 3 },
    { order: 2, name: "Testing 2", node: 1 },
    { order: 3, name: "Testing 3", node: 4 },
    { order: 4, name: "Testing 4", node: 4 },
    { order: 4, name: "Testing 4", node: 4 },
    { order: 4, name: "Testing 4", node: 4 },
  ]);

  const location = useLocation();
  const { name, matrixSize } = location.state || {};
  console.log(name, matrixSize);

  const handleSave = () => {
    // Add save functionality here
    console.log("Settings saved");
  };

  // const [orders, setOrders] = useState({}); // Store cell orders in an object

  // const handleClick = (row, col) => {
  //   setOrders((prevOrders) => ({
  //     ...prevOrders,
  //     [`${row}-${col}`]: row * matrixSize + col + 1, // Calculate order based on position
  //   }));
  // };

  // Initialize orders with the order number for each cell
  const initialOrders = {};
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      initialOrders[`${row}-${col}`] = row * matrixSize + col + 1;
    }
  }

  const [orders, setOrders] = useState(initialOrders);
  const [buttonProperty, setButtonProperty] = useState("");

  const handleClick = (row, col) => {
    const order = orders[`${row}-${col}`];
    setButtonProperty((prevProperty) => (prevProperty === order ? "" : order));
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
            Experiment Name: {name} - Matrix: {matrixSize}x{matrixSize}
          </h2>
          <div className="space-x-2">
            <button className="p-2 bg-blue-500 text-white rounded">
              Create
            </button>
            <button className="p-2 bg-gray-500 rounded">Download</button>
            <button className="p-2 bg-red-500 text-white rounded">
              Delete
            </button>
          </div>
        </div>

        <div className="h-60 overflow-y-auto block">
          <table className="w-full bg-white border-4 rounded">
            <thead>
              <tr className="bg-gray-100 sticky top-0">
                <th className="p-2 border">Order</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Number of nodes</th>
                <th className="p-2 border">Save</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border">{listing.order}</td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={listing.name}
                      onChange={(e) => {
                        const newList = [...listings];
                        newList[index].name = e.target.value;
                        setListings(newList);
                      }}
                      className="border p-1 w-full rounded"
                    />
                  </td>
                  <td className="p-2 border">{listing.node}</td>
                  <td className="p-2 border">
                    <button className="p-2 bg-blue-500 text-white rounded">
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`grid grid-cols-${matrixSize} gap-4 mt-4`}>
          {Array.from({ length: matrixSize }).map((_, row) =>
            Array.from({ length: matrixSize }).map((_, col) => (
              <button
                key={`${row}-${col}`}
                onClick={() => handleClick(row, col)}
                className="w-full h-16 bg-gray-300 rounded flex items-center justify-center text-2xl font-bold"
              >
                {orders[`${row}-${col}`]}
              </button>
            ))
          )}
        </div>

        {/* <div className={`grid grid-cols-${matrixSize} gap-4 mt-4`}>
          {Array.from({ length: matrixSize }).map((_, row) =>
            Array.from({ length: matrixSize }).map((_, col) => (
              // <button
              //   key={`${row}-${col}`}
              //   onClick={() => handleClick(row, col)}
              //   className="w-full h-16 bg-gray-300 rounded flex items-center justify-center text-2xl font-bold"
              // >
              //   {orders[`${row}-${col}`] || ""}
              // </button>
              <Button key={`${row}-${col}`}
              onClick={() => handleClick(row, col)}
              className="w-full h-16 bg-gray-300 rounded flex items-center justify-center text-2xl font-bold"
              >
                {orders[`${row}-${col}`] || ""}
              </Button>
            ))
          )}
        </div> */}
      </div>

      {buttonProperty && (
        <div className="md:w-1/3 bg-white p-4 border-r">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Node Configuration</h2>
            <Button
              className="px-6 py-0.5 bg-white text-blue-500 rounded-full hover:bg-blue-500 hover:text-white"
              onClick={() => setButtonProperty("")}
            >
              <XIcon />
            </Button>
          </div>

          <div className="flex items-center mb-4">
            <button className="px-6 py-0.5 bg-gray-200 text-blue-500 rounded-full mr-2 hover:bg-gray-300">
              Node Number <strong>{buttonProperty}</strong>
            </button>
            <button className="px-6 py-0.5 bg-gray-200 text-blue-500 rounded-full mr-2 hover:bg-gray-300">
              Permissions
            </button>
          </div>

          <hr className="border mb-2 border-black rounded-lg" />

          <div className="flex items-center mb-3 space-x-2 py-2">
            <button className="px-6 py-0.5 bg-gray-200 rounded-full mr-2 hover:bg-gray-300">
              &#x2716;
            </button>
            <button className="px-6 py-0.5 bg-gray-200 rounded-full mr-2 hover:bg-gray-300">
              <ArrowBigLeft color="black" />
            </button>
            <button className="px-6 py-0.5 bg-gray-200 rounded-full mr-2 hover:bg-gray-300">
              <ArrowBigRight color="black" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Intensity
              </label>
              <input
                type="number"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="Together">Together</option>
                <option value="Separate">Separate</option>
              </select>
            </div>

            <hr className="border border-black rounded-lg" />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleSave}
                className="flex-grow p-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
              <button className="flex-grow p-2 bg-blue-500 text-white rounded">
                Save & Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
