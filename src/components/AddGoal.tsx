import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CalculateGoalRequest } from "@/types/goal";

interface AddGoalProps {
  onSubmit?: (goalData: any) => void;
}

export default function AddGoal({ onSubmit }: AddGoalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    goalName: "",
    goalType: "",
    goalAmount: "",
    targetDuration: "",
    currentSavings: "",
    expectedReturn: [11],
    sipAffordability: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const goalTypes = [
    "Education",
    "Car",
    "Home",
    "Travel",
    "Wedding",
    "Emergency Fund",
    "Retirement",
    "Other",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestData: CalculateGoalRequest = {
        goal_amount: parseFloat(formData.goalAmount),
        duration_years: parseFloat(formData.targetDuration),
        current_savings: parseFloat(formData.currentSavings) || 0,
        expected_return: formData.expectedReturn[0],
      };

      // Call the calculate goal API
      const response = await fetch("http://127.0.0.1:5000/api/calculate_goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();

        // Store goal data and navigate to insights
        const goalData = {
          ...formData,
          calculationResult: result,
        };

        if (onSubmit) {
          onSubmit(goalData);
        }

        // Navigate to goal insights with the data
        navigate("/goal-insights", {
          state: { goalData, calculationResult: result },
        });
      } else {
        console.error("Failed to calculate goal");
      }
    } catch (error) {
      console.error("Error calculating goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.goalName &&
      formData.goalType &&
      formData.goalAmount &&
      formData.targetDuration
    );
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return "";
    return new Intl.NumberFormat("en-IN").format(parseFloat(amount));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Goal</h1>
            <p className="text-gray-600 mt-1">
              Set up your financial goal and get personalized SIP
              recommendations
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Goal Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Goal Name */}
              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name *</Label>
                <Input
                  id="goalName"
                  placeholder="e.g., Dream Car, Child Education"
                  value={formData.goalName}
                  onChange={(e) =>
                    handleInputChange("goalName", e.target.value)
                  }
                  required
                />
              </div>

              {/* Goal Type */}
              <div className="space-y-2">
                <Label htmlFor="goalType">Goal Type *</Label>
                <Select
                  value={formData.goalType}
                  onValueChange={(value) =>
                    handleInputChange("goalType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Goal Amount */}
              <div className="space-y-2">
                <Label htmlFor="goalAmount">Goal Amount (₹) *</Label>
                <Input
                  id="goalAmount"
                  type="number"
                  placeholder="1000000"
                  value={formData.goalAmount}
                  onChange={(e) =>
                    handleInputChange("goalAmount", e.target.value)
                  }
                  required
                />
                {formData.goalAmount && (
                  <p className="text-sm text-gray-500">
                    ₹{formatCurrency(formData.goalAmount)}
                  </p>
                )}
              </div>

              {/* Target Duration */}
              <div className="space-y-2">
                <Label htmlFor="targetDuration">
                  Target Duration (Years) *
                </Label>
                <Input
                  id="targetDuration"
                  type="number"
                  placeholder="5"
                  min="1"
                  max="30"
                  value={formData.targetDuration}
                  onChange={(e) =>
                    handleInputChange("targetDuration", e.target.value)
                  }
                  required
                />
              </div>

              {/* Current Savings */}
              <div className="space-y-2">
                <Label htmlFor="currentSavings">Current Savings (₹)</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  placeholder="0"
                  value={formData.currentSavings}
                  onChange={(e) =>
                    handleInputChange("currentSavings", e.target.value)
                  }
                />
                {formData.currentSavings && (
                  <p className="text-sm text-gray-500">
                    ₹{formatCurrency(formData.currentSavings)}
                  </p>
                )}
              </div>

              {/* Expected Annual Return */}
              <div className="space-y-4">
                <Label>
                  Expected Annual Return: {formData.expectedReturn[0]}%
                </Label>
                <Slider
                  value={formData.expectedReturn}
                  onValueChange={(value) =>
                    handleInputChange("expectedReturn", value)
                  }
                  max={20}
                  min={6}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>6%</span>
                  <span>Conservative (8-10%)</span>
                  <span>Moderate (10-12%)</span>
                  <span>Aggressive (12%+)</span>
                  <span>20%</span>
                </div>
              </div>

              {/* SIP Affordability Toggle */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base font-medium">
                    Monthly SIP Affordability Check
                  </Label>
                  <p className="text-sm text-gray-600">
                    Enable this to get alternate suggestions if SIP amount is
                    too high
                  </p>
                </div>
                <Switch
                  checked={formData.sipAffordability}
                  onCheckedChange={(checked) =>
                    handleInputChange("sipAffordability", checked)
                  }
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? "Calculating..." : "Calculate SIP & View Insights"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
