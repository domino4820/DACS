import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X } from "lucide-react";

export default function NodeActions({ node, onUpdate, onDelete, onClose }) {
  const [label, setLabel] = useState(node.data.label || "");
  const [code, setCode] = useState(node.data.code || "");
  const [description, setDescription] = useState(node.data.description || "");
  const [difficulty, setDifficulty] = useState(node.data.difficulty || "");
  const [category, setCategory] = useState(node.data.category || "");
  const [completed, setCompleted] = useState(node.data.completed || false);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(node.id, {
        label,
        code,
        description,
        difficulty,
        category,
        completed,
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(node.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold text-white">Edit Node</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Label</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Node Label"
            className="bg-cyberpunk-dark/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Code</Label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code or identifier"
            className="bg-cyberpunk-dark/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Node description"
            rows={3}
            className="bg-cyberpunk-dark/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Difficulty</Label>
          <Select
            value={difficulty}
            onValueChange={(value) => setDifficulty(value)}
          >
            <SelectTrigger className="bg-cyberpunk-dark/50">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-cyberpunk-darker border-purple-500/30">
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Category</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="bg-cyberpunk-dark/50"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="rounded-sm bg-cyberpunk-dark/50 border-purple-500/30"
          />
          <Label htmlFor="completed" className="text-xs text-gray-400">
            Mark as completed
          </Label>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="destructive"
            onClick={handleDelete}
            size="sm"
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
