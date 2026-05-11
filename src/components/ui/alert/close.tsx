import { X } from "lucide-react";
import { Button } from "../button";

export const AlertCloseButton = ({ onClick }: { onClick?: () => void }) => (
  <Button onClick={onClick} size="xs" shape="circle" styleType="link">
    <X className="w-4 h-4 text-base-content" />
  </Button>
);
