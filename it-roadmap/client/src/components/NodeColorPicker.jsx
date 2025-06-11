import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export default function NodeColorPicker({ node, onStyleUpdate }) {
  const [nodeBgColor, setNodeBgColor] = useState(
    node.data.nodeBgColor || "#1e1e2f"
  );
  const [nodeColor, setNodeColor] = useState(node.data.nodeColor || "#7c3aed");
  const [textColor, setTextColor] = useState(node.data.textColor || "#ffffff");

  const handleColorChange = (type, value) => {
    switch (type) {
      case "nodeBgColor":
        setNodeBgColor(value);
        break;
      case "nodeColor":
        setNodeColor(value);
        break;
      case "textColor":
        setTextColor(value);
        break;
      default:
        break;
    }
  };

  const applyChanges = () => {
    if (onStyleUpdate) {
      onStyleUpdate(node.id, {
        nodeBgColor,
        nodeColor,
        textColor,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold text-white">Node Appearance</h3>
      <Separator className="my-2 bg-purple-500/30" />

      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Background Color</Label>
          <div className="flex gap-2 items-center">
            <div
              className="w-6 h-6 rounded border border-gray-500"
              style={{ backgroundColor: nodeBgColor }}
            ></div>
            <Input
              type="text"
              value={nodeBgColor}
              onChange={(e) => handleColorChange("nodeBgColor", e.target.value)}
              className="text-xs h-7"
            />
            <Input
              type="color"
              value={nodeBgColor}
              onChange={(e) => handleColorChange("nodeBgColor", e.target.value)}
              className="w-8 h-8 p-0 border-none rounded-full overflow-hidden"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Border Color</Label>
          <div className="flex gap-2 items-center">
            <div
              className="w-6 h-6 rounded border border-gray-500"
              style={{ backgroundColor: nodeColor }}
            ></div>
            <Input
              type="text"
              value={nodeColor}
              onChange={(e) => handleColorChange("nodeColor", e.target.value)}
              className="text-xs h-7"
            />
            <Input
              type="color"
              value={nodeColor}
              onChange={(e) => handleColorChange("nodeColor", e.target.value)}
              className="w-8 h-8 p-0 border-none rounded-full overflow-hidden"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-gray-400">Text Color</Label>
          <div className="flex gap-2 items-center">
            <div
              className="w-6 h-6 rounded border border-gray-500"
              style={{ backgroundColor: textColor }}
            ></div>
            <Input
              type="text"
              value={textColor}
              onChange={(e) => handleColorChange("textColor", e.target.value)}
              className="text-xs h-7"
            />
            <Input
              type="color"
              value={textColor}
              onChange={(e) => handleColorChange("textColor", e.target.value)}
              className="w-8 h-8 p-0 border-none rounded-full overflow-hidden"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          onClick={applyChanges}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          size="sm"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
