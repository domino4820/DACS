import React, { useState, useEffect, useRef } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
  className,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  // Lọc các tùy chọn dựa trên searchTerm
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý khi click bên ngoài để đóng dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Xử lý khi chọn hoặc bỏ chọn một tùy chọn
  const toggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((val) => val !== optionValue)
      : [...value, optionValue];

    onChange(newValue);
  };

  // Xóa một giá trị đã chọn
  const removeValue = (optionValue, e) => {
    e.stopPropagation();
    onChange(value.filter((val) => val !== optionValue));
  };

  // Hiển thị nhãn cho các giá trị đã chọn
  const getSelectedLabels = () => {
    return value.map((val) => {
      const option = options.find((opt) => opt.value === val);
      return option ? option.label : val;
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center rounded-md border border-input bg-background px-3 py-2 text-sm",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2",
          "cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-ring ring-offset-2",
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {getSelectedLabels().map((label, i) => (
              <div
                key={i}
                className="flex items-center gap-1 rounded-sm bg-purple-500/20 px-2 py-1"
              >
                <span className="text-xs">{label}</span>
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={(e) => removeValue(value[i], e)}
                />
              </div>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <div className="ml-auto flex items-center self-stretch pl-1">
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full rounded-md border border-input bg-background shadow-md mt-1">
          <div className="p-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full border border-input rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1"
            />
          </div>
          <ul className="max-h-60 overflow-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <li
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm",
                      isSelected ? "bg-purple-500/20" : "hover:bg-purple-500/10"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option.value);
                    }}
                  >
                    {option.label}
                    {isSelected && <Check className="h-4 w-4" />}
                  </li>
                );
              })
            ) : (
              <li className="px-2 py-1.5 text-sm text-muted-foreground">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
