import React from "react";
import InvestmentForm from "./InvestmentForm";
import { useNavigate } from "react-router-dom";

const Plan = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/investment-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      navigate("/results", { state: { planData: data } });
    } catch (error) {
      console.error("Error submitting investment form:", error);
      alert("Failed to submit investment plan. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Create Your Investment Plan
        </h1>
        <InvestmentForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default Plan;
