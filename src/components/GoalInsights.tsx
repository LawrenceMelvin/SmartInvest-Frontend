import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calculator,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { CalculateGoalResponse } from "@/types/goal";

interface GoalInsightsProps {
  goalData?: any;
  calculationResult?: CalculateGoalResponse;
}

export default function GoalInsights({
  goalData: propGoalData,
  calculationResult: propCalculationResult,
}: GoalInsightsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdjuster, setShowAdjuster] = useState(false);

  // Get data from props or location state
  const goalData = propGoalData ||
    location.state?.goalData || {
      goalName: "Dream Car",
      goalType: "Car",
      goalAmount: "800000",
      targetDuration: "3",
      currentSavings: "50000",
      expectedReturn: [11],
      sipAffordability: true,
    };

  const calculationResult = propCalculationResult ||
    location.state?.calculationResult || {
      monthly_sip_required: 18500,
      total_investment: 666000,
      total_interest_earned: 134000,
      on_track: false,
    };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isHighSip = calculationResult.monthly_sip_required > 15000; // Threshold for "high" SIP
  const sipStatus = calculationResult.on_track ? "Affordable" : "High";

  const handleSipTooHigh = () => {
    navigate("/smart-sip-adjuster", {
      state: {
        goalData,
        calculationResult,
      },
    });
  };

  const handleSaveGoal = () => {
    // In a real app, this would save to backend/localStorage
    console.log("Saving goal:", { goalData, calculationResult });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/add-goal")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goal Insights</h1>
            <p className="text-gray-600 mt-1">
              Analysis for {goalData.goalName}
            </p>
          </div>
        </div>

        {/* Goal Summary Card */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                {goalData.goalName}
              </span>
              <Badge
                variant={calculationResult.on_track ? "default" : "destructive"}
              >
                {sipStatus} SIP
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Goal Amount</p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(parseFloat(goalData.goalAmount))}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-bold text-green-900">
                  {goalData.targetDuration} years
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Current Savings</p>
                <p className="text-lg font-bold text-purple-900">
                  {formatCurrency(parseFloat(goalData.currentSavings) || 0)}
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Expected Return</p>
                <p className="text-lg font-bold text-orange-900">
                  {goalData.expectedReturn[0]}% p.a.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SIP Calculation Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className={`${isHighSip ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {isHighSip ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                Monthly SIP Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold ${isHighSip ? "text-red-900" : "text-green-900"}`}
              >
                {formatCurrency(calculationResult.monthly_sip_required)}
              </div>
              <p
                className={`text-sm mt-2 ${isHighSip ? "text-red-600" : "text-green-600"}`}
              >
                {isHighSip
                  ? "This might be too high for your budget"
                  : "This looks affordable"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Total Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                {formatCurrency(calculationResult.total_investment)}
              </div>
              <p className="text-sm text-blue-600 mt-2">
                Amount you'll invest over {goalData.targetDuration} years
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Interest Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                {formatCurrency(calculationResult.total_interest_earned)}
              </div>
              <p className="text-sm text-purple-600 mt-2">
                Power of compounding at {goalData.expectedReturn[0]}% return
              </p>
            </CardContent>
          </Card>
        </div>

        {/* High SIP Alert */}
        {isHighSip && (
          <Alert className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    SIP amount seems high for most budgets
                  </p>
                  <p className="text-sm mt-1">
                    Don't worry! We can suggest alternate plans to make this
                    goal achievable.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100 ml-4"
                  onClick={handleSipTooHigh}
                >
                  SIP too high? Get suggestions
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message for Affordable SIP */}
        {!isHighSip && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <p className="font-medium">
                Great! This SIP amount looks manageable
              </p>
              <p className="text-sm mt-1">
                You're on track to achieve your {goalData.goalName} goal in{" "}
                {goalData.targetDuration} years.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate("/add-goal")}>
            Modify Goal
          </Button>
          <Button onClick={handleSaveGoal} className="px-8">
            Save Goal & Continue
          </Button>
        </div>

        {/* Breakdown Section */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Investment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Monthly SIP</span>
                <span className="font-medium">
                  {formatCurrency(calculationResult.monthly_sip_required)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Investment Period</span>
                <span className="font-medium">
                  {goalData.targetDuration} years (
                  {parseFloat(goalData.targetDuration) * 12} months)
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Amount Invested</span>
                <span className="font-medium">
                  {formatCurrency(calculationResult.total_investment)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Expected Returns</span>
                <span className="font-medium text-green-600">
                  +{formatCurrency(calculationResult.total_interest_earned)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 pt-4 text-lg font-bold">
                <span>Final Corpus</span>
                <span className="text-blue-600">
                  {formatCurrency(parseFloat(goalData.goalAmount))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
