import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";

function FilterableBadgeList<T extends string>({
  label,
  selectedItems = [],
  onOpenSelector,
  onRemoveItem,
  badgeClassName = "flex items-center gap-1",
  removeButtonClassName = "rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors",
}: {
  label: string;
  selectedItems: T[];
  onOpenSelector: () => void;
  onRemoveItem: (item: T) => void;
  badgeClassName?: string;
  removeButtonClassName?: string;
}) {

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
