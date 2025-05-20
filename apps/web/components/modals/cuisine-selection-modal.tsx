import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchBar } from "@/components/ui/searchbar";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CuisineSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableCuisines: string[];
  selectedCuisines: string[];
  onConfirm: (cuisines: string[]) => void;
  title?: string;
  description?: string;
}

const CuisineSelectionModal = ({
  open,
  onOpenChange,
  availableCuisines,
  selectedCuisines,
  onConfirm,
  title = "Select Items",
  description = "Choose items from the list below",
}: CuisineSelectionModalProps) => {
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  // Reset temp selections whenever the modal opens
  useEffect(() => {
    if (open) {
      setTempSelected([...selectedCuisines]);
      setSearch("");
    }
  }, [open, selectedCuisines]);

  // Filter cuisines based on search
  const filteredCuisines = availableCuisines.filter((cuisine) =>
    cuisine.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCuisine = (cuisine: string) => {
    setTempSelected((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleConfirm = () => {
    onConfirm(tempSelected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search cuisines..."
          />

          {/* Selected cuisines */}
          {tempSelected.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected cuisines:</h4>
              <div className="flex flex-wrap gap-2">
                {tempSelected.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {cuisine}
                    <button
                      type="button"
                      className="rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors"
                      onClick={() => toggleCuisine(cuisine)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Cuisine list */}
          <div className="h-64 overflow-y-auto border rounded-md p-2">
            {filteredCuisines.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {filteredCuisines.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 transition-colors",
                      tempSelected.includes(cuisine) && "bg-primary/10"
                    )}
                    onClick={() => toggleCuisine(cuisine)}
                  >
                    {cuisine}
                    {tempSelected.includes(cuisine) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No cuisines found
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            label="Cancel"
            variant="outline"
            onClick={() => onOpenChange(false)}
          />
          <Button
            label="Confirm"
            onClick={handleConfirm}
            disabled={tempSelected.length === 0}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CuisineSelectionModal;
