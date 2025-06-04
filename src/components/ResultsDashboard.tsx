import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
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
import { useNavigate } from "react-router-dom";

// Types for backend response
interface Fund {
  name: string;
  ticker: string;
  expense: number;
  description: string;
}
interface BreakdownCategory {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}
interface ResultsDashboardProps {
  advice: string | string[];
  breakdown: BreakdownCategory[];
  funds: Record<string, Fund[]>;
  onRecalculate?: () => void;
  // Optionally, you can keep the hygiene booleans if needed
  hasHealthInsurance?: boolean;
  hasTermInsurance?: boolean;
  hasEmergencyFund?: boolean;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  advice,
  breakdown,
  funds,
  onRecalculate = () => {},
  hasHealthInsurance = false,
  hasTermInsurance = false,
  hasEmergencyFund = false,
}) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // Add this line
  const [data, setData] = useState({
    advice: [],
    breakdown: [],
    funds: {},
  });

  // Hygiene warnings logic can stay if you want
  const generateWarnings = () => {
    const warnings = [];
    if (hasEmergencyFund !== undefined) {
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
    }
    if (hasHealthInsurance !== undefined) {
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
    }
    if (hasTermInsurance !== undefined) {
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
    }
    return warnings;
  };

  const warnings = generateWarnings();

  const handleDownloadPlan = () => {
    if (dashboardRef.current) {
      html2pdf().from(dashboardRef.current).save("investment-plan.pdf");
    }
  };

  // Update the recalculate handler to navigate
  const handleRecalculate = () => {
    navigate("/plan"); // Change "/plan" to your actual plan page route if different
  };

  // Calculate total amount for display
  const totalAmount = Array.isArray(breakdown)
    ? breakdown.reduce((sum, cat) => sum + cat.amount, 0)
    : 0;

  console.log("Advice prop:", advice);

  if (!advice) return <div>Loading...</div>;

  return (
    <div ref={dashboardRef} className="w-full max-w-7xl mx-auto p-4 bg-background">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Investment Plan</h1>
        <p className="text-muted-foreground">
          Total investment: ₹{totalAmount.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Allocation Chart */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Investment Allocation</CardTitle>
              <CardDescription>
                How your investment will be distributed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AllocationChart
                data={(Array.isArray(breakdown) ? breakdown : []).map((cat) => ({
                  ...cat,
                  value: cat.percentage, // or cat.amount, depending on what 'value' should represent
                }))}
                onSegmentClick={() => {}}
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
                {(Array.isArray(breakdown) ? breakdown : []).map((category, index) => {
                  // Normalize the category name to match the funds key
                  const fundsKey = category.name
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                    .replace(/[^\w]/g, ""); // Remove non-word chars if needed

                  // funds[fundsKey] is now the correct array
                  return (
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
                          {(funds[fundsKey] || []).map((fund, fundIndex) => (
                            <div key={fundIndex} className="border-l-2 pl-4 py-2">
                              {/* If fund is a string, just show the name */}
                              {typeof fund === "string" ? (
                                <div>
                                  <h4 className="font-medium">{fund}</h4>
                                </div>
                              ) : (
                                <div>
                                  <h4 className="font-medium">{fund.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {fund.ticker} • Expense: {fund.expense}%
                                  </p>
                                  <p className="text-sm mt-1">{fund.description}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>

          {/* Advice Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Advisor's Note</CardTitle>
              <CardDescription>
                Personalized advice for your investment plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(advice) ? (
                <ul className="list-disc pl-5">
                  {advice.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{advice}</p>
              )}
            </CardContent>
          </Card>

          {/* Financial Hygiene Warnings */}
          {warnings.length > 0 && (
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
                <Button variant="outline" onClick={handleRecalculate}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Recalculate
                </Button>
                <Button onClick={handleDownloadPlan}>
                  <Download className="mr-2 h-4 w-4" /> Download Plan
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
