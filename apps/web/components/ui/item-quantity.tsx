import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface ItemQuantityProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

const ItemQuantity = ({
  quantity,
  onIncrease,
  onDecrease,
  onChange,
  disabled = false,
}: ItemQuantityProps) => {
  const [inputValue, setInputValue] = useState<string>(quantity.toString());

  // Update input field when quantity prop changes
  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);
  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onDecrease}
        disabled={quantity <= 0 || disabled}
        leftIcon={<Minus />}
      />
      <Input
        type="number"
        value={inputValue}
        onChange={(e) => {
          const val = e.target.value;
          setInputValue(val);

          const numVal = parseInt(val);
          if (!isNaN(numVal) && numVal >= 0 && onChange) {
            onChange(numVal);
          }
        }}
        onBlur={() => {
          // Reset to current quantity if input is empty or invalid
          if (inputValue === "" || isNaN(parseInt(inputValue))) {
            setInputValue(quantity.toString());
          } else {
            // Update with validated value
            const numVal = Math.max(0, parseInt(inputValue));
            if (onChange) {
              onChange(numVal);
            }
            setInputValue(numVal.toString());
          }
        }}
        className="w-16 h-8 text-center px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min="0"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onIncrease}
        disabled={disabled}
        leftIcon={<Plus />}
      />
    </div>
  );
};

export { ItemQuantity };
