import React, { useState, useEffect } from "react";
import { ExperimentList } from "./ExperimentList/ExperimentList";
import { Statistics } from "./Statistics/Statistics";
import { getAllRecords } from "../apis/callAPI";

export const Dashboard = () => {
  const [experiments, setExperiments] = useState([]);

  const fetchExperiments = async () => {
    try {
      const response = await getAllRecords();
      if (response.length === 0) {
        return;
      }
      setExperiments(response.data.result);
    } catch (error) {
      console.error("Network Error:", error.message);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
    }
  };
  useEffect(() => {
    fetchExperiments();
  }, []);

  return (
    <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-auto">
      <div className="flex-1">
        {experiments.length === 0 ? (
          <div className="text-center text-lg font-semibold text-gray-500">
            No experiments found
          </div>
        ) : (
          <div className="flex-1">
            <ExperimentList experiments={experiments} />
          </div>
        )}
      </div>
      <div className="w-full lg:w-80">
        <Statistics />
      </div>
    </div>
  );
};
