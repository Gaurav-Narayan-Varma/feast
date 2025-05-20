import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";

/**
 * Props for the FilterableBadgeList component
 */
interface FilterableBadgeListProps<T extends string> {
  /** Label to display next to the select button */
  label: string;
  /** Array of selected items */
  selectedItems: T[];
  /** Function to handle when the select button is clicked */
  onOpenSelector: () => void;
  /** Function to remove an item from the selection */
  onRemoveItem: (item: T) => void;
  /** Optional CSS class for the badge */
  badgeClassName?: string;
  /** Optional CSS class for the remove button */
  removeButtonClassName?: string;
}

/**
 * A reusable component that displays a list of badges with a filter button
 * Used for cuisines, dietary tags, and allergens
 */
function FilterableBadgeList<T extends string>({
  label,
  selectedItems,
  onOpenSelector,
  onRemoveItem,
  badgeClassName = "flex items-center gap-1",
  removeButtonClassName = "rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors",
}: FilterableBadgeListProps<T>) {
  return (
    <div className="flex-1 min-w-[200px]">
      <div className="flex items-center gap-2 mb-2 justify-between">
        <Label>{label}</Label>
        <Button
          label="Select"
          variant="outline"
          size="sm"
          type="button"
          onClick={onOpenSelector}
          className="flex items-center gap-1"
          leftIcon={<Filter />}
        ></Button>
      </div>
      <div>
        {selectedItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <Badge key={item} variant="secondary" className={badgeClassName}>
                {item}
                <button
                  type="button"
                  className={removeButtonClassName}
                  onClick={() => onRemoveItem(item)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No {label.toLowerCase()} selected
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterableBadgeList;
