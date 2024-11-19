// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const Modal = ({ onClose }) => {
//   // const [name, setName] = useState("");
//   const [matrixSize, setMatrix] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!matrixSize) {
//       setError("Please fill out both the Matrix Size fields.");
//       return;
//     } else {
//       setError("");
//       console.log({ name, matrixSize });

//       // Navigate to the next page and pass data
//       navigate("/matrix", { state: { name, matrixSize } });
//     }

//     onClose();
//   };

//   return (
//     <div className="fixed z-10 inset-0 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
//         <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
//         &#8203;
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//           <form onSubmit={handleSubmit}>
//             <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//               <h2 className="text-lg leading-6 font-medium text-gray-900">
//                 Create new experiment
//               </h2>
//               <hr className="mt-4" />
//               <div className="mt-4">
//                 {error && <p className="text-red-500 mb-4">{error}</p>}
//                 <div className="mb-4">
//                   {/* <label
//                     htmlFor="name"
//                     className="block text-gray-700 font-bold mb-2"
//                   >
//                     Name:
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   /> */}
//                 </div>
//                 <div className="mb-4">
//                   <label
//                     htmlFor="matrix"
//                     className="block text-gray-700 font-bold mb-2"
//                   >
//                     Choose matrix size:
//                   </label>
//                   <select
//                     id="matrix"
//                     name="matrix"
//                     value={matrixSize}
//                     onChange={(e) => setMatrix(e.target.value)}
//                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   >
//                     <option value="">Select a matrix</option>
//                     <option value="3">Matrix 3x3</option>
//                     <option value="4">Matrix 4x4</option>
//                     <option value="5">Matrix 5x5</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//               <button
//                 type="submit"
//                 className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//               >
//                 Continue
//               </button>
//               <button
//                 type="button"
//                 className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Modal = ({
  onClose,
  modalTitle,
  inputField,
  additionalField,
  selectField,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e, fieldName) => {
    setFormValues({ ...formValues, [fieldName]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      (inputField?.required && !formValues[inputField.name]) ||
      (additionalField?.required && !formValues[additionalField.name]) ||
      (selectField?.required && !formValues[selectField.name])
    ) {
      setError("Please fill out all required fields.");
      return;
    } else {
      setError("");
      console.log(formValues);

      // If onSubmit is provided, call it; otherwise, navigate
      if (onSubmit) {
        onSubmit(formValues); // Use the custom submit handler
      } else {
        navigate("/matrix", { state: formValues }); // Default navigation
      }
    }

    onClose();
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                {modalTitle || "Create new experiment"}
              </h2>
              <hr className="mt-4" />
              <div className="mt-4">
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Render input field if provided */}
                {inputField && (
                  <div className="mb-4">
                    <label
                      htmlFor={inputField.name}
                      className="block text-gray-700 font-bold mb-2"
                    >
                      {inputField.label}
                    </label>
                    <input
                      type="text"
                      id={inputField.name}
                      name={inputField.name}
                      value={formValues[inputField.name] || ""}
                      onChange={(e) => handleChange(e, inputField.name)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={inputField.placeholder || ""}
                      required={inputField.required}
                    />
                  </div>
                )}

                {/* Render additional input field if provided */}
                {additionalField && (
                  <div className="mb-4">
                    <label
                      htmlFor={additionalField.name}
                      className="block text-gray-700 font-bold mb-2"
                    >
                      {additionalField.label}
                    </label>
                    <input
                      type="text"
                      id={additionalField.name}
                      name={additionalField.name}
                      value={formValues[additionalField.name] || ""}
                      onChange={(e) => handleChange(e, additionalField.name)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder={additionalField.placeholder || ""}
                      required={additionalField.required}
                    />
                  </div>
                )}

                {/* Render select field if provided */}
                {selectField && (
                  <div className="mb-4">
                    <label
                      htmlFor={selectField.name}
                      className="block text-gray-700 font-bold mb-2"
                    >
                      {selectField.label}
                    </label>
                    <select
                      id={selectField.name}
                      name={selectField.name}
                      value={formValues[selectField.name] || ""}
                      onChange={(e) => handleChange(e, selectField.name)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required={selectField.required}
                    >
                      <option value="">Select an option</option>
                      {selectField.options?.map((option, idx) => (
                        <option key={idx} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Continue
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
