import React from "react";
import {
  Smile,
  Sprout,
  Terminal,
  Brain,
  Calculator,
  Gamepad2,
  Palette,
  Activity as ActivityIcon,
  Users,
  LucideProps,
} from "lucide-react";
import { CategoryId } from "@/types/activity";

interface CategoryIconProps extends LucideProps {
  categoryId: CategoryId;
}

export function CategoryIcon({
  categoryId,
  size = 20,
  strokeWidth = 2.2,
  className = "",
  ...props
}: CategoryIconProps) {
  switch (categoryId) {
    case "senang-senang":
      return <Smile size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case "self-improvement":
      return <Sprout size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case "tech":
      return <Terminal size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case "psikologi":
      return <Brain size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case "matematika":
      return <Calculator size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case "game":
      return <Gamepad2 size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case "kreatif":
      return <Palette size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case "fisik":
      return <ActivityIcon size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case "sosial":
      return <Users size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    default:
      return <Smile size={size} strokeWidth={strokeWidth} className={className} {...props} />;
  }
}
