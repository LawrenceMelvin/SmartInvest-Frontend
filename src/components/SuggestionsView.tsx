import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  TrendingDown,
  Wallet,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SuggestionsViewProps {
  goalData?: any;
  adjustmentResult?: any;
  maxAffordableSip?: number;
}

export default function SuggestionsView({
  goalData: propGoalData,
  adjustmentResult: propAdjustmentResult,
  maxAffordableSip: propMaxAffordableSip,
}: SuggestionsViewProps) {
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

  const adjustmentResult = propAdjustmentResult ||
    location.state?.adjustmentResult || {
      suggestion:
        "You may not meet your goal in 3 years with ₹8000/month. Consider increasing goal duration to 5 years, or make a ₹200000 down payment now.",
      suggested_duration_years: 5,
      suggested_down_payment: 200000,
      new_sip: 8000,
    };

  const maxAffordableSip =
    propMaxAffordableSip || location.state?.maxAffordableSip || 8000;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const suggestions = [
    {
      id: 1,
      title: "Extend Timeline",
      icon: Clock,
      description: `Increase your goal duration to ${adjustmentResult.suggested_duration_years} years`,
      benefit: "Lower monthly SIP with same goal amount",
      newSip: adjustmentResult.new_sip,
      newDuration: adjustmentResult.suggested_duration_years,
      pros: [
        "Affordable monthly payments",
        "Same goal amount",
        "More time for wealth building",
      ],
      cons: ["Delayed goal achievement", "More total interest paid"],
      recommended: true,
    },
    {
      id: 2,
      title: "Make Down Payment",
      icon: Wallet,
      description: `Make an upfront payment of ${formatCurrency(adjustmentResult.suggested_down_payment)}`,
      benefit: "Reduce monthly SIP burden significantly",
      newSip: adjustmentResult.new_sip,
      downPayment: adjustmentResult.suggested_down_payment,
      pros: [
        "Keep original timeline",
        "Lower monthly SIP",
        "Immediate progress",
      ],
      cons: ["Requires large upfront amount", "Reduces current liquidity"],
      recommended: false,
    },
    {
      id: 3,
      title: "Reduce Goal Amount",
      icon: TrendingDown,
      description: `Consider a goal of ${formatCurrency(parseFloat(goalData.goalAmount) * 0.8)} instead`,
      benefit: "Achieve 80% of your goal with affordable SIP",
      newSip: Math.round(adjustmentResult.new_sip * 0.8),
      newGoalAmount: parseFloat(goalData.goalAmount) * 0.8,
      pros: [
        "Affordable monthly payments",
        "Same timeline",
        "Still substantial goal",
      ],
      cons: ["Lower goal achievement", "May need additional funding later"],
      recommended: false,
    },
    {
      id: 4,
      title: "Step-Up SIP Plan",
      icon: TrendingUp,
      description: "Start with lower SIP and increase by 10% annually",
      benefit: "Begin with affordable amount, grow with income",
      newSip: Math.round(adjustmentResult.new_sip * 0.7),
      stepUpRate: 10,
      pros: [
        "Start with very low SIP",
        "Grows with salary increments",
        "Disciplined approach",
      ],
      cons: [
        "Complex planning",
        "Requires consistent increases",
        "May still fall short",
      ],
      recommended: true,
    },
  ];

  const handleSelectSuggestion = (suggestion: any) => {
    // In a real app, this would update the goal with the selected suggestion
    console.log("Selected suggestion:", suggestion);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/smart-sip-adjuster")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Smart Suggestions
            </h1>
            <p className="text-gray-600 mt-1">
              Choose the best approach for {goalData.goalName}
            </p>
          </div>
        </div>

        {/* Current Situation Summary */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Your Budget: {formatCurrency(maxAffordableSip)}/month
                </p>
                <p className="text-sm mt-1">{adjustmentResult.suggestion}</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestions.map((suggestion) => {
            const IconComponent = suggestion.icon;
            return (
              <Card
                key={suggestion.id}
                className={`bg-white hover:shadow-lg transition-shadow ${suggestion.recommended ? "ring-2 ring-green-200" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      {suggestion.title}
                    </CardTitle>
                    {suggestion.recommended && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{suggestion.description}</p>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      {suggestion.benefit}
                    </p>
                  </div>

                  {/* Key Numbers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">Monthly SIP</p>
                      <p className="font-bold text-gray-900">
                        {formatCurrency(suggestion.newSip)}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">
                        {suggestion.newDuration
                          ? "Duration"
                          : suggestion.downPayment
                            ? "Down Payment"
                            : suggestion.newGoalAmount
                              ? "New Goal"
                              : "Step-Up Rate"}
                      </p>
                      <p className="font-bold text-gray-900">
                        {suggestion.newDuration
                          ? `${suggestion.newDuration} years`
                          : suggestion.downPayment
                            ? formatCurrency(suggestion.downPayment)
                            : suggestion.newGoalAmount
                              ? formatCurrency(suggestion.newGoalAmount)
                              : `${suggestion.stepUpRate}% annually`}
                      </p>
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">
                        Pros:
                      </p>
                      <ul className="text-xs text-green-600 space-y-1">
                        {suggestion.pros.map((pro, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-red-700 mb-1">
                        Cons:
                      </p>
                      <ul className="text-xs text-red-600 space-y-1">
                        {suggestion.cons.map((con, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="h-3 w-3 text-red-500">•</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className={`w-full ${suggestion.recommended ? "bg-green-600 hover:bg-green-700" : ""}`}
                    variant={suggestion.recommended ? "default" : "outline"}
                  >
                    {suggestion.recommended
                      ? "Choose This Plan"
                      : "Select This Option"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-4 justify-center pt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/smart-sip-adjuster")}
          >
            Try Different Budget
          </Button>
          <Button variant="outline" onClick={() => navigate("/add-goal")}>
            Modify Goal
          </Button>
          <Button onClick={() => navigate("/dashboard")}>
            Save & Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
