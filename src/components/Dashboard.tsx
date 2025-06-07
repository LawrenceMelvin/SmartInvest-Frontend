import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingUp, Target, AlertTriangle } from "lucide-react";
import { Goal, DashboardSummary } from "@/types/goal";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  goals?: Goal[];
  summary?: DashboardSummary;
}

export default function Dashboard({
  goals = [
    {
      id: "1",
      name: "Dream Car",
      type: "Car",
      amount: 800000,
      durationYears: 3,
      currentSavings: 50000,
      expectedReturn: 11,
      monthlySipRequired: 18500,
      onTrack: false,
      status: "Needs Attention",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Child Education",
      type: "Education",
      amount: 1500000,
      durationYears: 8,
      currentSavings: 100000,
      expectedReturn: 11,
      monthlySipRequired: 12000,
      onTrack: true,
      status: "On Track",
      createdAt: new Date(),
    },
  ],
  summary = {
    totalSips: 30500,
    activeGoals: 2,
    projectedCorpus: 2300000,
  },
}: DashboardProps) {
  const navigate = useNavigate();
  const [needsAttentionGoals, setNeedsAttentionGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setNeedsAttentionGoals(
      goals.filter((goal) => goal.status === "Needs Attention"),
    );
  }, [goals]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (goal: Goal) => {
    const timeElapsed = 1; // Assuming 1 year has passed for demo
    return Math.min((timeElapsed / goal.durationYears) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goal Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Track and manage your financial goals
            </p>
          </div>
          <Button
            onClick={() => navigate("/add-goal")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Monthly SIPs
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalSips)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Goals
              </CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {summary.activeGoals}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Projected Corpus
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.projectedCorpus)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attention Alert */}
        {needsAttentionGoals.length > 0 && (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-orange-800 font-medium">
                    {needsAttentionGoals.length} goal
                    {needsAttentionGoals.length > 1 ? "s" : ""} need
                    {needsAttentionGoals.length === 1 ? "s" : ""} attention
                  </p>
                  <p className="text-orange-600 text-sm">
                    SIP amounts may be too high for your budget
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  onClick={() => navigate("/suggestions")}
                >
                  View Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              className="bg-white hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/goal-insights/${goal.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {goal.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{goal.type}</p>
                  </div>
                  <Badge
                    variant={
                      goal.status === "On Track" ? "default" : "destructive"
                    }
                    className={
                      goal.status === "On Track"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {goal.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Amount</span>
                    <span className="font-medium">
                      {formatCurrency(goal.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly SIP</span>
                    <span className="font-medium">
                      {formatCurrency(goal.monthlySipRequired || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">
                      {goal.durationYears} years
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {getProgressPercentage(goal).toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={getProgressPercentage(goal)}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
