import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import ResultsDashboard from "./ResultsDashboard";

const Results = () => {
  const location = useLocation();
  const { planData } = location.state || {};

  if (!planData) {
    return <Navigate to="/plan" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Your Investment Plan
        </h1>
        <ResultsDashboard {...planData} />
      </div>
    </div>
  );
};

export default Results;
