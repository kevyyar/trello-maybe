import { twMerge } from "tailwind-merge";

interface PillCategoryProps {
  category: string;
  bgColor: string;
}

export const PillCategory = ({ category, bgColor }: PillCategoryProps) => {
  return (
    <div className="flex items-center gap-2 p-2">
      <p className={twMerge("text-xs font-semibold rounded-full px-2 py-1.5", bgColor)}>{category}</p> 
    </div>
  );
};