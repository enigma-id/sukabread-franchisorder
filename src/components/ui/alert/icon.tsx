import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { AlertVariant } from "./types";

export const getDefaultIcon = (variant?: AlertVariant) => {
  const iconMap: Record<AlertVariant, React.ReactNode> = {
    default: <Info className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle2 className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
  };
  return iconMap[variant ?? "default"];
};
