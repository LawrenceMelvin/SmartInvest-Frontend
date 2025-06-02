import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DollarSign, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  investmentAmount: z.coerce.number().min(1, "Investment amount is required"),
  investmentType: z.enum(["sip", "lumpsum"]),
  riskLevel: z.number().min(1).max(3),
  hasHealthInsurance: z.boolean(),
  hasTermInsurance: z.boolean(),
  hasEmergencyFund: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface InvestmentFormProps {
  onSubmit?: (data: FormValues) => void;
}

const InvestmentForm = ({ onSubmit = () => {} }: InvestmentFormProps) => {
  const [riskLevel, setRiskLevel] = useState<number>(2); // Default to medium risk (2)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: 10000,
      investmentType: "sip",
      riskLevel: 2,
      hasHealthInsurance: false,
      hasTermInsurance: false,
      hasEmergencyFund: false,
    },
  });

  const watchedValues = watch();

  const handleRiskLevelChange = (value: number[]) => {
    const newRiskLevel = value[0];
    setRiskLevel(newRiskLevel);
    setValue("riskLevel", newRiskLevel);
  };

  const getRiskLevelText = (level: number) => {
    switch (level) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      default:
        return "Medium";
    }
  };

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  const hasFinancialHygieneIssues =
    !watchedValues.hasHealthInsurance ||
    !watchedValues.hasTermInsurance ||
    !watchedValues.hasEmergencyFund;

  return (
    <Card className="w-full max-w-lg mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Investment Plan</CardTitle>
        <CardDescription>
          Fill in your details to get a personalized investment plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="investmentAmount">Investment Amount (₹)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="investmentAmount"
                type="number"
                className="pl-10"
                {...register("investmentAmount")}
              />
            </div>
            {errors.investmentAmount && (
              <p className="text-sm text-red-500">
                {errors.investmentAmount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Investment Type</Label>
            <RadioGroup
              defaultValue="sip"
              onValueChange={(value) =>
                setValue("investmentType", value as "sip" | "lumpsum")
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sip" id="sip" />
                <Label htmlFor="sip">SIP (Monthly)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lumpsum" id="lumpsum" />
                <Label htmlFor="lumpsum">Lump Sum</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Risk Level</Label>
              <span className="text-sm font-medium">
                {getRiskLevelText(riskLevel)}
              </span>
            </div>
            <Slider
              defaultValue={[2]}
              min={1}
              max={3}
              step={1}
              onValueChange={handleRiskLevelChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-medium">Financial Hygiene Checkpoints</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="healthInsurance" className="cursor-pointer">
                Do you have Health Insurance?
              </Label>
              <Switch
                id="healthInsurance"
                checked={watchedValues.hasHealthInsurance}
                onCheckedChange={(checked) =>
                  setValue("hasHealthInsurance", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="termInsurance" className="cursor-pointer">
                Do you have Term Insurance?
              </Label>
              <Switch
                id="termInsurance"
                checked={watchedValues.hasTermInsurance}
                onCheckedChange={(checked) =>
                  setValue("hasTermInsurance", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emergencyFund" className="cursor-pointer">
                Do you have an Emergency Fund?
              </Label>
              <Switch
                id="emergencyFund"
                checked={watchedValues.hasEmergencyFund}
                onCheckedChange={(checked) =>
                  setValue("hasEmergencyFund", checked)
                }
              />
            </div>
          </div>

          {hasFinancialHygieneIssues && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Financial Hygiene Warning</AlertTitle>
              <AlertDescription>
                We recommend addressing your financial hygiene gaps before
                investing. Your plan will include recommendations.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            Generate Investment Plan
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        All recommendations are for educational purposes only.
      </CardFooter>
    </Card>
  );
};

export default InvestmentForm;
