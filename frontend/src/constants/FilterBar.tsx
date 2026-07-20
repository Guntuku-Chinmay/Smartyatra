import { DESTINATION_CATEGORIES } from "@/constants/destinationCategories";

interface FilterBarProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function FilterBar({
  selected,
  onSelect,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {DESTINATION_CATEGORIES.map((filter) => (
        <button
          key={filter}
          onClick={() => onSelect(filter)}
          className={`rounded-full px-4 py-2 transition ${
            selected === filter
              ? "bg-blue-600 text-white"
              : "bg-slate-200 hover:bg-slate-300"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}