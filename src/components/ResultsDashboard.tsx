import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Download, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import AllocationChart from "./AllocationChart";

interface Fund {
  name: string;
  ticker: string;
  expense: number;
  description: string;
}

interface CategoryData {
  name: string;
  percentage: number;
  amount: number;
  color: string;
  funds: Fund[];
}

interface FinancialHygieneWarning {
  type: string;
  title: string;
  description: string;
  severity: "warning" | "error" | "success";
}

interface ResultsDashboardProps {
  totalAmount: number;
  investmentType: "SIP" | "Lump Sum";
  riskLevel: "Low" | "Medium" | "High";
  hasHealthInsurance: boolean;
  hasTermInsurance: boolean;
  hasEmergencyFund: boolean;
  allocationData?: CategoryData[];
  onRecalculate?: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  totalAmount = 10000,
  investmentType = "SIP",
  riskLevel = "Medium",
  hasHealthInsurance = false,
  hasTermInsurance = false,
  hasEmergencyFund = false,
  allocationData = [
    {
      name: "Index Funds",
      percentage: 40,
      amount: 4000,
      color: "#4F46E5",
      funds: [
        {
          name: "UTI Nifty 50 Index Fund",
          ticker: "UTI-NIFTY",
          expense: 0.18,
          description: "Low-cost index fund tracking the Nifty 50 index.",
        },
        {
          name: "HDFC Nifty 50 Index Fund",
          ticker: "HDFC-NIFTY",
          expense: 0.2,
          description: "Index fund with good tracking error and liquidity.",
        },
      ],
    },
    {
      name: "Large Cap",
      percentage: 20,
      amount: 2000,
      color: "#10B981",
      funds: [
        {
          name: "Axis Bluechip Fund",
          ticker: "AXIS-BLUE",
          expense: 0.45,
          description:
            "Focuses on large stable companies with growth potential.",
        },
      ],
    },
    {
      name: "Debt",
      percentage: 20,
      amount: 2000,
      color: "#F59E0B",
      funds: [
        {
          name: "ICICI Prudential Short Term Fund",
          ticker: "ICICI-ST",
          expense: 0.35,
          description: "Short-term debt fund with moderate risk and returns.",
        },
      ],
    },
    {
      name: "Gold",
      percentage: 10,
      amount: 1000,
      color: "#FBBF24",
      funds: [
        {
          name: "SBI Gold Fund",
          ticker: "SBI-GOLD",
          expense: 0.52,
          description:
            "Fund that invests in physical gold and gold-related instruments.",
        },
      ],
    },
    {
      name: "REITs",
      percentage: 10,
      amount: 1000,
      color: "#EC4899",
      funds: [
        {
          name: "Embassy Office Parks REIT",
          ticker: "EMBASSY",
          expense: 0.58,
          description:
            "India's first publicly listed REIT with premium office properties.",
        },
      ],
    },
  ],
  onRecalculate = () => {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Generate financial hygiene warnings based on user inputs
  const generateWarnings = (): FinancialHygieneWarning[] => {
    const warnings: FinancialHygieneWarning[] = [];

    if (!hasEmergencyFund) {
      warnings.push({
        type: "emergency",
        title: "Emergency Fund Missing",
        description:
          "We recommend building an emergency fund of 3-6 months of expenses before investing.",
        severity: "error",
      });
    } else {
      warnings.push({
        type: "emergency",
        title: "Emergency Fund Ready",
        description: "Great job having an emergency fund in place!",
        severity: "success",
      });
    }

    if (!hasHealthInsurance) {
      warnings.push({
        type: "health",
        title: "Health Insurance Missing",
        description:
          "Consider getting health insurance before investing to protect against medical emergencies.",
        severity: "warning",
      });
    } else {
      warnings.push({
        type: "health",
        title: "Health Insurance Ready",
        description: "You're protected with health insurance. Good planning!",
        severity: "success",
      });
    }

    if (!hasTermInsurance) {
      warnings.push({
        type: "term",
        title: "Term Insurance Missing",
        description:
          "If you have dependents, consider getting term insurance for financial protection.",
        severity: "warning",
      });
    } else {
      warnings.push({
        type: "term",
        title: "Term Insurance Ready",
        description:
          "Your dependents are protected with term insurance. Well done!",
        severity: "success",
      });
    }

    return warnings;
  };

  const warnings = generateWarnings();

  // Handle download plan (placeholder function)
  const handleDownloadPlan = () => {
    console.log("Downloading plan...");
    // Implementation would go here
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-background">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Investment Plan</h1>
        <p className="text-muted-foreground">
          {investmentType} investment of ₹{totalAmount.toLocaleString()} with{" "}
          {riskLevel} risk profile
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Allocation Chart */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Investment Allocation</CardTitle>
              <CardDescription>
                How your {investmentType === "SIP" ? "monthly" : "one-time"}{" "}
                investment will be distributed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AllocationChart
                data={allocationData}
                onSegmentClick={(category) => setSelectedCategory(category)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right column - Fund Recommendations and Warnings */}
        <div className="lg:col-span-2">
          {/* Fund Recommendations */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recommended Funds</CardTitle>
              <CardDescription>
                Suggested mutual funds for each investment category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {allocationData.map((category, index) => (
                  <AccordionItem key={index} value={category.name}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">
                            ₹{category.amount.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            ({category.percentage}%)
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pl-5">
                        {category.funds.map((fund, fundIndex) => (
                          <div key={fundIndex} className="border-l-2 pl-4 py-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{fund.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {fund.ticker} • Expense: {fund.expense}%
                                </p>
                              </div>
                            </div>
                            <p className="text-sm mt-1">{fund.description}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Financial Hygiene Warnings */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Hygiene Check</CardTitle>
              <CardDescription>
                Important considerations for your financial health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {warnings.map((warning, index) => (
                  <Alert
                    key={index}
                    variant={
                      warning.severity === "error" ? "destructive" : "default"
                    }
                    className={
                      warning.severity === "success" ? "border-green-500" : ""
                    }
                  >
                    {warning.severity === "error" && (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    {warning.severity === "warning" && (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    {warning.severity === "success" && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <AlertTitle>{warning.title}</AlertTitle>
                    <AlertDescription>{warning.description}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onRecalculate}>
                <RefreshCw className="mr-2 h-4 w-4" /> Recalculate
              </Button>
              <Button onClick={handleDownloadPlan}>
                <Download className="mr-2 h-4 w-4" /> Download Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
