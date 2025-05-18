"use client"

import { Panel } from "reactflow"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BackgroundVariant } from "reactflow"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface StyleOptionsPanelProps {
  bgColor: string
  setBgColor: (color: string) => void
  bgVariant: BackgroundVariant
  setBgVariant: (variant: BackgroundVariant) => void
  edgeStyle: string
  setEdgeStyle: (style: "default" | "straight" | "step" | "smoothstep") => void
  edgeType: "solid" | "dashed"
  setEdgeType: (type: "solid" | "dashed") => void
  edgeColor: string
  setEdgeColor: (color: string) => void
  edgeAnimated: boolean
  setEdgeAnimated: (animated: boolean) => void
  showQuickToggle: boolean
  setShowQuickToggle: (show: boolean) => void
  onClose: () => void
}

export function StyleOptionsPanel({
  bgColor,
  setBgColor,
  bgVariant,
  setBgVariant,
  edgeStyle,
  setEdgeStyle,
  edgeType,
  setEdgeType,
  edgeColor,
  setEdgeColor,
  edgeAnimated,
  setEdgeAnimated,
  showQuickToggle,
  setShowQuickToggle,
  onClose,
}: StyleOptionsPanelProps) {
  const backgroundColors = [
    { name: "White", value: "#ffffff" },
    { name: "Light Gray", value: "#f8fafc" },
    { name: "Light Blue", value: "#f0f9ff" },
    { name: "Light Green", value: "#f0fdf4" },
    { name: "Light Yellow", value: "#fefce8" },
    { name: "Light Pink", value: "#fdf2f8" },
    { name: "Dark Blue", value: "#0f172a" },
    { name: "Dark Green", value: "#14532d" },
  ]

  const edgeColors = [
    { name: "Gray", value: "#b1b1b7" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Orange", value: "#f59e0b" },
    { name: "Pink", value: "#ec4899" },
  ]

  return (
    <Panel position="top-center" className="z-20 mt-16">
      <div className="bg-background/95 p-4 rounded-md shadow-lg border w-[350px] backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Style Options</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="background">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
          </TabsList>

          {/* Background Tab */}
          <TabsContent value="background" className="space-y-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex flex-wrap gap-2">
                {backgroundColors.map((color) => (
                  <div
                    key={color.value}
                    className={`w-6 h-6 rounded-full cursor-pointer border ${
                      bgColor === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setBgColor(color.value)}
                    title={color.name}
                  />
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className="w-6 h-6 rounded-full cursor-pointer border flex items-center justify-center bg-white"
                      title="Custom Color"
                    >
                      +
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <Label htmlFor="custom-bg-color">Custom Background Color</Label>
                      <input
                        id="custom-bg-color"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full h-8"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bg-variant">Background Pattern</Label>
              <Select value={bgVariant} onValueChange={(value) => setBgVariant(value as BackgroundVariant)}>
                <SelectTrigger id="bg-variant">
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="lines">Lines</SelectItem>
                  <SelectItem value="cross">Cross</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edge-style">Connection Style</Label>
              <Select value={edgeStyle} onValueChange={(value) => setEdgeStyle(value as any)}>
                <SelectTrigger id="edge-style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="straight">Straight</SelectItem>
                  <SelectItem value="step">Step</SelectItem>
                  <SelectItem value="smoothstep">Smooth Step</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edge-type">Line Type</Label>
              <Select value={edgeType} onValueChange={(value) => setEdgeType(value as "solid" | "dashed")}>
                <SelectTrigger id="edge-type">
                  <SelectValue placeholder="Select line type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Line Color</Label>
              <div className="flex flex-wrap gap-2">
                {edgeColors.map((color) => (
                  <div
                    key={color.value}
                    className={`w-6 h-6 rounded-full cursor-pointer border ${
                      edgeColor === color.value ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setEdgeColor(color.value)}
                    title={color.name}
                  />
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className="w-6 h-6 rounded-full cursor-pointer border flex items-center justify-center bg-white"
                      title="Custom Color"
                    >
                      +
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <Label htmlFor="custom-edge-color">Custom Line Color</Label>
                      <input
                        id="custom-edge-color"
                        type="color"
                        value={edgeColor}
                        onChange={(e) => setEdgeColor(e.target.value)}
                        className="w-full h-8"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="animated-edges" checked={edgeAnimated} onCheckedChange={setEdgeAnimated} />
              <Label htmlFor="animated-edges">Animated Connections</Label>
            </div>
          </TabsContent>

          {/* Interface Tab */}
          <TabsContent value="interface" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="quick-toggle" checked={showQuickToggle} onCheckedChange={setShowQuickToggle} />
              <Label htmlFor="quick-toggle">Show Quick Completion Toggle</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              When enabled, a button will appear on each node allowing you to quickly mark courses as completed without
              opening the details panel.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </Panel>
  )
}
