import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface AllocationChartProps {
  data?: AllocationData[];
  onSegmentClick?: (category: string) => void;
}

export interface AllocationData {
  name: string;
  value: number;
  amount: number;
  color: string;
}

const defaultData: AllocationData[] = [
  { name: "Index Funds", value: 40, amount: 4000, color: "#0088FE" },
  { name: "Large Cap", value: 25, amount: 2500, color: "#00C49F" },
  { name: "Debt", value: 15, amount: 1500, color: "#FFBB28" },
  { name: "Gold", value: 10, amount: 1000, color: "#FF8042" },
  { name: "REITs", value: 10, amount: 1000, color: "#8884d8" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-md shadow-md border border-gray-200">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">{`${data.value}% (₹${data.amount.toLocaleString()})`}</p>
      </div>
    );
  }
  return null;
};

const AllocationChart: React.FC<AllocationChartProps> = ({
  data = defaultData,
  onSegmentClick = () => {},
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Investment Allocation
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onClick={(entry) => onSegmentClick(entry.name)}
                className="cursor-pointer"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div
              key={`legend-${index}`}
              className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => onSegmentClick(item.name)}
            >
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">{`${item.value}% (₹${item.amount.toLocaleString()})`}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationChart;
