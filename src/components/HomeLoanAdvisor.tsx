import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calculator,
  IndianRupee,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Info,
  Home,
  Clock,
  Percent,
  User,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const apiBaseUrl = process.env.VITE_APP_API_URL;

const formSchema = z.object({
  monthlyIncome: z.coerce.number().min(1, "Monthly income is required"),
  existingEmis: z.coerce.number().min(0, "Existing EMIs cannot be negative"),
  age: z.coerce
    .number()
    .min(18, "Age must be at least 18")
    .max(80, "Age must be less than 80"),
  desiredLoanAmount: z.coerce.number().min(1, "Loan amount is required"),
  interestRate: z.coerce
    .number()
    .min(1, "Interest rate must be at least 1%")
    .max(20, "Interest rate cannot exceed 20%"),
  tenure: z.coerce
    .number()
    .min(5, "Minimum tenure is 5 years")
    .max(30, "Maximum tenure is 30 years"),
});

type FormValues = z.infer<typeof formSchema>;

interface LoanAdviceResponse {
  status: string;
  monthly_emi: number;
  total_monthly_emi_with_existing: number;
  max_safe_emi: number;
  suggestions: string[];
}

const HomeLoanAdvisor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  type LoanAdviceTransformed = {
    eligible: boolean;
    calculatedEmi: number;
    totalEmi: number;
    safeEmiLimit: number;
    suggestions: string[];
    eligibilityReason?: string;
  };
  
  const [results, setResults] = useState<LoanAdviceTransformed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyIncome: 50000,
      existingEmis: 0,
      age: 30,
      desiredLoanAmount: 2500000,
      interestRate: 8.5,
      tenure: 20,
    },
  });

  const watchedValues = watch();

  const handleInterestRateChange = (value: number[]) => {
    const newRate = value[0];
    setInterestRate(newRate);
    setValue("interestRate", newRate);
  };

  const handleTenureChange = (value: number[]) => {
    const newTenure = value[0];
    setTenure(newTenure);
    setValue("tenure", newTenure);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["monthlyIncome", "existingEmis", "age"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["desiredLoanAmount", "interestRate", "tenure"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/home-loan/advice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      // Transform the backend response to match our component's expected format
      const transformedResult = {
        eligible: result.status === "Eligible",
        calculatedEmi: Math.round(result.monthly_emi),
        totalEmi: Math.round(result.total_monthly_emi_with_existing),
        safeEmiLimit: Math.round(result.max_safe_emi),
        suggestions: result.suggestions || [],
        eligibilityReason:
          result.status !== "Eligible" ? `Status: ${result.status}` : undefined,
      };
      setResults(transformedResult);
      setCurrentStep(3);
    } catch (err) {
      setError("Failed to get loan advice. Please try again.");
      console.error("Error submitting loan form:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setResults(null);
    setError(null);
  };

  const calculatePreviewEmi = () => {
    const principal = watchedValues.desiredLoanAmount || 0;
    const rate = (watchedValues.interestRate || 8.5) / 12 / 100;
    const months = (watchedValues.tenure || 20) * 12;

    if (principal && rate && months) {
      const emi =
        (principal * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1);
      return Math.round(emi);
    }
    return 0;
  };

  const previewEmi = calculatePreviewEmi();
  const safeEmiLimit = (watchedValues.monthlyIncome || 0) * 0.4;
  const totalEmiWithExisting = previewEmi + (watchedValues.existingEmis || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Home className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              Home Loan Advisor
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Get personalized home loan advice based on your financial profile
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Personal Financial Info */}
          {currentStep === 1 && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Financial Information
                </CardTitle>
                <CardDescription>
                  Tell us about your current financial situation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your total monthly income after taxes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="monthlyIncome"
                      type="number"
                      className="pl-10"
                      {...register("monthlyIncome")}
                    />
                  </div>
                  {errors.monthlyIncome && (
                    <p className="text-sm text-red-500">
                      {errors.monthlyIncome.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="existingEmis">
                      Existing EMIs / Loan Commitments (₹)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total monthly EMI payments for existing loans</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="existingEmis"
                      type="number"
                      className="pl-10"
                      {...register("existingEmis")}
                    />
                  </div>
                  {errors.existingEmis && (
                    <p className="text-sm text-red-500">
                      {errors.existingEmis.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" {...register("age")} />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Loan Requirements */}
          {currentStep === 2 && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Loan Requirements
                </CardTitle>
                <CardDescription>
                  Specify your home loan requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="desiredLoanAmount">
                    Desired Loan Amount (₹)
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="desiredLoanAmount"
                      type="number"
                      className="pl-10"
                      {...register("desiredLoanAmount")}
                    />
                  </div>
                  {errors.desiredLoanAmount && (
                    <p className="text-sm text-red-500">
                      {errors.desiredLoanAmount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Label>Interest Rate (%)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Annual interest rate offered by the bank</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm font-medium flex items-center">
                      <Percent className="h-4 w-4 mr-1" />
                      {interestRate}%
                    </span>
                  </div>
                  <Slider
                    value={[interestRate]}
                    min={6}
                    max={15}
                    step={0.1}
                    onValueChange={handleInterestRateChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>6%</span>
                    <span>15%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Label>Tenure (Years)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Loan repayment period in years</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {tenure} years
                    </span>
                  </div>
                  <Slider
                    value={[tenure]}
                    min={5}
                    max={30}
                    step={1}
                    onValueChange={handleTenureChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5 years</span>
                    <span>30 years</span>
                  </div>
                </div>

                {/* EMI Preview */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">EMI Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Estimated EMI</p>
                      <p className="font-semibold text-lg">
                        ₹{previewEmi.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total EMI (with existing)</p>
                      <p
                        className={`font-semibold text-lg ${
                          totalEmiWithExisting > safeEmiLimit
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        ₹{totalEmiWithExisting.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Safe EMI limit (40% of income): ₹
                    {safeEmiLimit.toLocaleString()}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Analyzing..." : "Get Loan Advice"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Results */}
          {currentStep === 3 && results && (
            <div className="space-y-6">
              {/* Eligibility Status */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {results.eligible ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                    )}
                    Loan Eligibility Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-center p-6 rounded-lg ${
                      results.eligible
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <h3
                      className={`text-2xl font-bold mb-2 ${
                        results.eligible ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {results.eligible ? "Eligible" : "Not Eligible"}
                    </h3>
                    {results.eligibilityReason && (
                      <p
                        className={`text-sm ${
                          results.eligible ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {results.eligibilityReason}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* EMI Details */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>EMI Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Calculated EMI
                      </p>
                      <p className="text-2xl font-bold text-blue-800">
                        ₹{results.calculatedEmi.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Total EMI (with existing)
                      </p>
                      <p className="text-2xl font-bold text-orange-800">
                        ₹{results.totalEmi.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingDown className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Safe EMI Limit
                      </p>
                      <p className="text-2xl font-bold text-green-800">
                        ₹{results.safeEmiLimit.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* EMI vs Safe Limit Indicator */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>EMI vs Safe Limit</span>
                      <span>
                        {(
                          (results.totalEmi / results.safeEmiLimit) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          results.totalEmi > results.safeEmiLimit
                            ? "bg-red-500"
                            : results.totalEmi > results.safeEmiLimit * 0.8
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min((results.totalEmi / results.safeEmiLimit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Suggestions */}
              {results.suggestions && results.suggestions.length > 0 && (
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Recommendations & Tips</CardTitle>
                    <CardDescription>
                      Personalized suggestions to improve your loan eligibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="suggestions">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                            View Detailed Suggestions
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {results.suggestions.map((suggestion, index) => (
                              <Alert
                                key={index}
                                className="border-l-4 border-l-blue-500"
                              >
                                <AlertDescription className="ml-2">
                                  {suggestion}
                                </AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={resetForm}>
                  Start Over
                </Button>
                <Button onClick={() => window.print()}>Print Report</Button>
              </div>
            </div>
          )}
        </form>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default HomeLoanAdvisor;
