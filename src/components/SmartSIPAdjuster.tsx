import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Calculator, Lightbulb } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdjustGoalRequest, AdjustGoalResponse } from "@/types/goal";

interface SmartSIPAdjusterProps {
  goalData?: any;
  calculationResult?: any;
}

export default function SmartSIPAdjuster({
  goalData: propGoalData,
  calculationResult: propCalculationResult,
}: SmartSIPAdjusterProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from props or location state
  const goalData = propGoalData ||
    location.state?.goalData || {
      goalName: "Dream Car",
      goalType: "Car",
      goalAmount: "800000",
      targetDuration: "3",
      expectedReturn: [11],
    };

  const calculationResult = propCalculationResult ||
    location.state?.calculationResult || {
      monthly_sip_required: 18500,
    };

  const [maxAffordableSip, setMaxAffordableSip] = useState("");
  const [adjustmentResult, setAdjustmentResult] =
    useState<AdjustGoalResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleGetSuggestions = async () => {
    if (!maxAffordableSip) return;

    setIsLoading(true);

    try {
      const requestData: AdjustGoalRequest = {
        goal_amount: parseFloat(goalData.goalAmount),
        duration_years: parseFloat(goalData.targetDuration),
        expected_return: goalData.expectedReturn[0],
        max_affordable_sip: parseFloat(maxAffordableSip),
      };

      const response = await fetch("http://127.0.0.1:5000/api/adjust_goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        setAdjustmentResult(result);
        setShowSuggestions(true);
      } else {
        console.error("Failed to get adjustment suggestions");
      }
    } catch (error) {
      console.error("Error getting suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetailedSuggestions = () => {
    navigate("/suggestions", {
      state: {
        goalData,
        calculationResult,
        adjustmentResult,
        maxAffordableSip: parseFloat(maxAffordableSip),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/goal-insights")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Smart SIP Adjuster
            </h1>
            <p className="text-gray-600 mt-1">
              Let's find an affordable plan for {goalData.goalName}
            </p>
          </div>
        </div>

        {/* Current Situation */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">Current Situation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-red-600">Required SIP</p>
                <p className="text-2xl font-bold text-red-900">
                  {formatCurrency(calculationResult.monthly_sip_required)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-red-600">Goal Amount</p>
                <p className="text-2xl font-bold text-red-900">
                  {formatCurrency(parseFloat(goalData.goalAmount))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-red-600">Duration</p>
                <p className="text-2xl font-bold text-red-900">
                  {goalData.targetDuration} years
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affordability Input */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              What's Your Maximum Affordable SIP?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxSip">Maximum Monthly SIP Amount (₹)</Label>
              <Input
                id="maxSip"
                type="number"
                placeholder="8000"
                value={maxAffordableSip}
                onChange={(e) => setMaxAffordableSip(e.target.value)}
              />
              {maxAffordableSip && (
                <p className="text-sm text-gray-500">
                  ₹
                  {new Intl.NumberFormat("en-IN").format(
                    parseFloat(maxAffordableSip),
                  )}
                </p>
              )}
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <p className="font-medium">Tip: Consider your monthly budget</p>
                <p className="text-sm mt-1">
                  A good rule of thumb is to invest 10-20% of your monthly
                  income in SIPs.
                </p>
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleGetSuggestions}
              disabled={!maxAffordableSip || isLoading}
              className="w-full"
            >
              {isLoading ? "Getting Suggestions..." : "Get Smart Suggestions"}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Suggestion Preview */}
        {showSuggestions && adjustmentResult && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Quick Suggestion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-white border-green-300">
                <AlertDescription className="text-gray-800">
                  {adjustmentResult.suggestion}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-sm text-green-600">Your Affordable SIP</p>
                  <p className="text-lg font-bold text-green-900">
                    {formatCurrency(adjustmentResult.new_sip)}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-sm text-green-600">Suggested Duration</p>
                  <p className="text-lg font-bold text-green-900">
                    {adjustmentResult.suggested_duration_years} years
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-sm text-green-600">Down Payment Option</p>
                  <p className="text-lg font-bold text-green-900">
                    {formatCurrency(adjustmentResult.suggested_down_payment)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSuggestions(false)}
                  className="flex-1"
                >
                  Try Different Amount
                </Button>
                <Button
                  onClick={handleViewDetailedSuggestions}
                  className="flex-1"
                >
                  View Detailed Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Common SIP Ranges */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Common SIP Ranges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[2000, 5000, 8000, 10000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setMaxAffordableSip(amount.toString())}
                  className="h-16 flex flex-col"
                >
                  <span className="text-lg font-bold">
                    {formatCurrency(amount)}
                  </span>
                  <span className="text-xs text-gray-500">per month</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
