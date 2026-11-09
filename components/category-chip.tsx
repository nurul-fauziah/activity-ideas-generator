import React from "react";
import { CategoryMeta } from "@/types/activity";
import { CategoryIcon } from "./category-icon";
import { Check } from "lucide-react";

interface CategoryChipProps {
  category: CategoryMeta;
  isSelected: boolean;
  onToggle: (id: CategoryMeta["id"]) => void;
}

export function CategoryChip({
  category,
  isSelected,
  onToggle,
}: CategoryChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      onClick={() => onToggle(category.id)}
      className={`min-h-[44px] px-4 py-2 rounded-pill flex items-center gap-2.5 transition-all text-sm font-semibold cursor-pointer border select-none ${
        isSelected
          ? "border-transparent text-white shadow-sm"
          : "bg-surface text-text border-border hover:bg-surface-2 hover:border-primary/40"
      }`}
      style={{
        backgroundColor: isSelected ? category.color : undefined,
      }}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
          isSelected ? "bg-white/20 text-white" : "text-text"
        }`}
      >
        {isSelected ? (
          <Check size={15} strokeWidth={2.8} />
        ) : (
          <CategoryIcon categoryId={category.id} size={16} strokeWidth={2.2} />
        )}
      </div>
      <span className="truncate">{category.label}</span>
    </button>
  );
}
