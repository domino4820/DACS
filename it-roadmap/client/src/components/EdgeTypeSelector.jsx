import React from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ArrowRight, Minus } from "lucide-react";

export default function EdgeTypeSelector({ value, onChange }) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="flex gap-4 items-center"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="arrow" id="arrow" />
        <Label htmlFor="arrow" className="flex items-center cursor-pointer">
          <ArrowRight className="h-4 w-4 mr-1" /> With Arrow
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem value="none" id="none" />
        <Label htmlFor="none" className="flex items-center cursor-pointer">
          <Minus className="h-4 w-4 mr-1" /> No Arrow
        </Label>
      </div>
    </RadioGroup>
  );
}
