import React from "react";
import { Layout } from "../components/layouts/Layout";
import { ExperimentMatrix } from "../components/dashboard/ExperimentList/ExperimentMatrix";

const MatrixPage = () => {
  return (
    <Layout>
      <ExperimentMatrix />
    </Layout>
  );
};

export default MatrixPage;
