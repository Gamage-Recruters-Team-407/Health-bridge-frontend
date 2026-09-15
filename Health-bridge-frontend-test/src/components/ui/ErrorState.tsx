"use client";

import React from "react";
import { AlertOctagon, RefreshCw, ShieldAlert, WifiOff, FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type ErrorType = "api" | "404" | "500" | "network" | "permission" | "empty";

export interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = "api",
  title,
  description,
  onRetry,
  onGoBack,
  className,
}) => {
  const configs: Record<ErrorType, { icon: React.ElementType; defaultTitle: string; defaultDesc: string; color: string }> = {
    api: {
      icon: AlertOctagon,
      defaultTitle: "API Request Failed",
      defaultDesc: "Unable to load data from HealthBridge backend servers. Please check your connection and retry.",
      color: "text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50",
    },
    "404": {
      icon: FileQuestion,
      defaultTitle: "Resource Not Found",
      defaultDesc: "The page or clinical record you requested could not be located in the system.",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50",
    },
    "500": {
      icon: AlertOctagon,
      defaultTitle: "Internal System Error",
      defaultDesc: "A server error occurred. Global error monitoring has logged this incident.",
      color: "text-red-600 bg-red-100 dark:bg-red-950/60 border-red-300 dark:border-red-800",
    },
    network: {
      icon: WifiOff,
      defaultTitle: "Network Disconnected",
      defaultDesc: "Internet or intranet network connectivity lost. Retrying backend sync...",
      color: "text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700",
    },
    permission: {
      icon: ShieldAlert,
      defaultTitle: "Access Denied",
      defaultDesc: "Your user role does not have authorization to view this medical module.",
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/50",
    },
    empty: {
      icon: FileQuestion,
      defaultTitle: "No Records Found",
      defaultDesc: "There are no entries available to display under this criteria.",
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50",
    },
  };

  const current = configs[type];
  const Icon = current.icon;

  return (
    <Card className={cn("p-8 text-center max-w-lg mx-auto my-6 shadow-xl border", className)}>
      <div className="flex flex-col items-center">
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border mb-4 shadow-sm", current.color)}>
          <Icon className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {title || current.defaultTitle}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md leading-relaxed">
          {description || current.defaultDesc}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {onGoBack && (
            <Button variant="outline" size="sm" onClick={onGoBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Go Back
            </Button>
          )}

          {onRetry && (
            <Button variant="primary" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4" />}>
              Retry Action
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ErrorState;
