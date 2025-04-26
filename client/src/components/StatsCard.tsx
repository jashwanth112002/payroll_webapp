import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  className?: string;
  trend?: "up" | "down";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  className,
  trend,
}) => {
  return (
    <Card className={cn("bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex items-start justify-between", className)}>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className={cn(
            "text-xs mt-1 flex items-center",
            trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
          )}>
            {trend === "up" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            )}
            {trend === "down" && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
              </svg>
            )}
            {description}
          </p>
        )}
      </div>
      <div className={cn(
        "p-3 rounded-lg",
        className || "bg-primary-50"
      )}>
        {icon}
      </div>
    </Card>
  );
};

export default StatsCard;
