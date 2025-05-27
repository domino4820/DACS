import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import EdgeTypeSelector from "./EdgeTypeSelector";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Paintbrush,
  Grid,
  Settings2,
  Edit,
  Plus,
  Trash,
  Link as LinkIcon,
} from "lucide-react";

export default function RoadmapEditorPanel({
  onStyleChange,
  onConnectionTypeChange,
  activeEdgeStyle = "arrow",
  editMode,
  onEditModeChange,
  onAddNodeClick,
}) {
  const [activeTab, setActiveTab] = useState("edit");
  const [nodeStyle, setNodeStyle] = useState({
    nodeColor: "#6d28d9",
    nodeBgColor: "#1e1b4b",
    textColor: "#ffffff",
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 8,
  });

  const [edgeStyle, setEdgeStyle] = useState({
    edgeColor: "#6d28d9",
    edgeWidth: 1,
    animated: true,
  });

  const handleNodeStyleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    const newStyle = { ...nodeStyle, [name]: newValue };
    setNodeStyle(newStyle);
    if (onStyleChange) onStyleChange({ nodeStyle: newStyle, edgeStyle });
  };

  const handleEdgeStyleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    const newEdgeStyle = { ...edgeStyle, [name]: newValue };
    setEdgeStyle(newEdgeStyle);
    if (onStyleChange) onStyleChange({ nodeStyle, edgeStyle: newEdgeStyle });
  };

  const handleEdgeAnimatedChange = (checked) => {
    const newEdgeStyle = { ...edgeStyle, animated: checked };
    setEdgeStyle(newEdgeStyle);
    if (onStyleChange) onStyleChange({ nodeStyle, edgeStyle: newEdgeStyle });
  };

  const handleSelectChange = (name, value) => {
    if (name.startsWith("node")) {
      const newStyle = { ...nodeStyle, [name]: value };
      setNodeStyle(newStyle);
      if (onStyleChange) onStyleChange({ nodeStyle: newStyle, edgeStyle });
    } else {
      const newEdgeStyle = { ...edgeStyle, [name]: value };
      setEdgeStyle(newEdgeStyle);
      if (onStyleChange) onStyleChange({ nodeStyle, edgeStyle: newEdgeStyle });
    }
  };

  return (
    <Card className="border-purple-500/30 bg-gradient-to-br from-cyberpunk-darker to-cyberpunk-dark shadow-md w-full">
      <CardHeader className="pb-2 border-b border-purple-500/20">
        <CardTitle className="text-lg font-cyber text-purple-300">
          Editor Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs
          defaultValue="edit"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full mb-4 bg-cyberpunk-darker border border-purple-500/30">
            <TabsTrigger
              value="edit"
              className="flex-1 data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
            >
              <Edit className="h-4 w-4 mr-1" /> Edit Tools
            </TabsTrigger>
            <TabsTrigger
              value="style"
              className="flex-1 data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
            >
              <Paintbrush className="h-4 w-4 mr-1" /> Style
            </TabsTrigger>
            <TabsTrigger
              value="grid"
              className="flex-1 data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
            >
              <Grid className="h-4 w-4 mr-1" /> Layout
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
            >
              <Settings2 className="h-4 w-4 mr-1" /> Settings
            </TabsTrigger>
          </TabsList>

          {activeTab === "edit" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Edit Mode
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    className={`${
                      editMode === "select"
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-cyberpunk-darker border border-purple-500/30 text-purple-300 hover:bg-purple-900/20"
                    }`}
                    onClick={() =>
                      onEditModeChange && onEditModeChange("select")
                    }
                  >
                    Select
                  </Button>
                  <Button
                    size="sm"
                    className={`${
                      editMode === "connect"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-cyberpunk-darker border border-purple-500/30 text-blue-300 hover:bg-blue-900/20"
                    }`}
                    onClick={() =>
                      onEditModeChange && onEditModeChange("connect")
                    }
                  >
                    <LinkIcon className="h-4 w-4 mr-1" /> Connect
                  </Button>
                  <Button
                    size="sm"
                    className={`${
                      editMode === "delete"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-cyberpunk-darker border border-red-500/30 text-red-300 hover:bg-red-900/20"
                    }`}
                    onClick={() =>
                      onEditModeChange && onEditModeChange("delete")
                    }
                  >
                    <Trash className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-500/20">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Node Actions
                </h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onAddNodeClick && onAddNodeClick()}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Node
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "style" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Node Appearance
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="nodeColor" className="text-xs">
                      Border Color
                    </Label>
                    <Input
                      id="nodeColor"
                      name="nodeColor"
                      type="color"
                      value={nodeStyle.nodeColor}
                      onChange={handleNodeStyleChange}
                      className="h-8 border-purple-500/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nodeBgColor" className="text-xs">
                      Background Color
                    </Label>
                    <Input
                      id="nodeBgColor"
                      name="nodeBgColor"
                      type="color"
                      value={nodeStyle.nodeBgColor}
                      onChange={handleNodeStyleChange}
                      className="h-8 border-purple-500/30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="textColor" className="text-xs">
                      Text Color
                    </Label>
                    <Input
                      id="textColor"
                      name="textColor"
                      type="color"
                      value={nodeStyle.textColor}
                      onChange={handleNodeStyleChange}
                      className="h-8 border-purple-500/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fontSize" className="text-xs">
                      Font Size
                    </Label>
                    <Input
                      id="fontSize"
                      name="fontSize"
                      type="number"
                      value={nodeStyle.fontSize}
                      onChange={handleNodeStyleChange}
                      className="border-purple-500/30"
                      min={10}
                      max={24}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-500/20">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Connection Style
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="edgeColor" className="text-xs">
                      Line Color
                    </Label>
                    <Input
                      id="edgeColor"
                      name="edgeColor"
                      type="color"
                      value={edgeStyle.edgeColor}
                      onChange={handleEdgeStyleChange}
                      className="h-8 border-purple-500/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edgeWidth" className="text-xs">
                      Line Width
                    </Label>
                    <Input
                      id="edgeWidth"
                      name="edgeWidth"
                      type="number"
                      value={edgeStyle.edgeWidth}
                      onChange={handleEdgeStyleChange}
                      className="border-purple-500/30"
                      min={1}
                      max={5}
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <Label className="text-xs mb-1 block">Connection Type</Label>
                  <EdgeTypeSelector
                    value={activeEdgeStyle}
                    onChange={(value) => {
                      if (onConnectionTypeChange) onConnectionTypeChange(value);
                    }}
                  />
                </div>

                <div className="flex items-center space-x-2 mt-3">
                  <Switch
                    id="animated"
                    checked={edgeStyle.animated}
                    onCheckedChange={handleEdgeAnimatedChange}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <Label htmlFor="animated">Animated connections</Label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "grid" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Layout Options
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="gridSize" className="text-xs">
                      Grid Size
                    </Label>
                    <Input
                      id="gridSize"
                      name="gridSize"
                      type="number"
                      defaultValue={20}
                      className="border-purple-500/30"
                      min={10}
                      max={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="snapToGrid" className="text-xs">
                      Snap to Grid
                    </Label>
                    <div className="flex items-center h-9 mt-1">
                      <Switch
                        id="snapToGrid"
                        defaultChecked
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                  >
                    Auto Layout Nodes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Editor Settings
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showMinimap">Show Minimap</Label>
                    <Switch
                      id="showMinimap"
                      defaultChecked
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showControls">Show Controls</Label>
                    <Switch
                      id="showControls"
                      defaultChecked
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fitViewOnLoad">Fit View on Load</Label>
                    <Switch
                      id="fitViewOnLoad"
                      defaultChecked
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
