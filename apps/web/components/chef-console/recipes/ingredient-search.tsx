import React, { useState, useEffect, useRef } from 'react';
import { Ingredients } from '@/lib/types';
import { Input } from '@/components/ui/input';

interface IngredientSearchProps {
  onSelect: (ingredientName: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

export const IngredientSearch: React.FC<IngredientSearchProps> = ({
  onSelect,
  placeholder = 'Search ingredients...',
  initialValue = '',
  className = ''
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(initialValue);
  const [matches, setMatches] = useState<string[]>([]);
  
  // Create an array of ingredient display names from the enum
  const ingredientOptions = Object.values(Ingredients);
  
  // Function to filter ingredients based on search input
  const filterIngredients = (input: string) => {
    if (!input) return [];
    
    const lowerInput = input.toLowerCase();
    
    // Score and rank the matches
    const scoredMatches = ingredientOptions
      .map(ingredient => {
        const lowerIngredient = ingredient.toLowerCase();
        let score = 0;
        
        // Exact match gets the highest score
        if (lowerIngredient === lowerInput) {
          score = 1000;
        }
        // Starts with the search term
        else if (lowerIngredient.startsWith(lowerInput)) {
          score = 500;
        }
        // Contains the search term as a whole word
        else if (lowerIngredient.includes(` ${lowerInput}`) || lowerIngredient.includes(`${lowerInput} `)) {
          score = 200;
        }
        // Contains the search term anywhere
        else if (lowerIngredient.includes(lowerInput)) {
          score = 100;
        }
        // No match
        else {
          score = 0;
        }
        
        return { ingredient, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.ingredient);
    
    return scoredMatches;
  };
  
  // Update matches when search value changes
  useEffect(() => {
    if (searchValue) {
      setMatches(filterIngredients(searchValue));
    } else {
      setMatches([]);
    }
  }, [searchValue]);
  
  // Update searchValue when initialValue prop changes
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value === '') {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };
  
  // Handle selecting an item from the dropdown
  const handleSelect = (selectedValue: string) => {
    setSearchValue(selectedValue);
    onSelect(selectedValue);
    setOpen(false);
  };
  
  // Handle direct input submission
  const handleInputSubmit = () => {
    if (searchValue) {
      onSelect(searchValue);
      setOpen(false);
    }
  };
  
  // Close dropdown on outside click and handle keyboard interactions
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Function to highlight matching text
  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    if (!lowerText.includes(lowerQuery)) return text;
    
    const parts = [];
    let lastIndex = 0;
    
    // Find all occurrences of the query
    let index = lowerText.indexOf(lowerQuery, lastIndex);
    while (index !== -1) {
      // Add non-matching text
      if (index > lastIndex) {
        parts.push(text.substring(lastIndex, index));
      }
      
      // Add highlighted matching text
      parts.push(
        <span key={index} className="bg-yellow-200 font-medium">
          {text.substring(index, index + query.length)}
        </span>
      );
      
      lastIndex = index + query.length;
      index = lowerText.indexOf(lowerQuery, lastIndex);
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return <>{parts}</>;
  };
  
  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex">
        <Input
          ref={inputRef}
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleInputSubmit();
            }
          }}
          onFocus={() => {
            if (searchValue) {
              setOpen(true);
            }
          }}
          onBlur={() => {
            // Delay closing to allow for click events on dropdown items
            setTimeout(() => setOpen(false), 200);
          }}
        />
      </div>
      
      {open && matches.length > 0 && (
        <div className="absolute z-50 w-full bg-white mt-1 rounded-md border border-input shadow-md max-h-60 overflow-y-auto">
          <ul className="py-1 px-0 m-0">
            {matches.map((ingredient) => (
              <li
                key={ingredient}
                onClick={() => handleSelect(ingredient)}
                className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
              >
                {highlightMatch(ingredient, searchValue)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;
