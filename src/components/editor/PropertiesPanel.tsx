import { useEffect, useState } from "react";
import { Canvas as FabricCanvas, FabricObject, Textbox } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowUp, ArrowDown, 
  AlignLeft, AlignCenter, AlignRight,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  Trash2,
  Move
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  fabricCanvas: FabricCanvas;
};

const PropertiesPanel = ({ fabricCanvas }: Props) => {
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(20);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textAlign, setTextAlign] = useState("left");

  useEffect(() => {
    const updateSelection = () => {
      const active = fabricCanvas.getActiveObject();
      setSelectedObject(active || null);
      
      if (active && (active.type === "textbox" || active.type === "i-text")) {
        const text = active as Textbox;
        setFontFamily(text.fontFamily || "Arial");
        setFontSize(text.fontSize || 20);
        setFontColor(text.fill as string || "#000000");
        setFontWeight(text.fontWeight as string || "normal");
        setFontStyle(text.fontStyle || "normal");
        setTextAlign(text.textAlign || "left");
      }
    };

    fabricCanvas.on("selection:created", updateSelection);
    fabricCanvas.on("selection:updated", updateSelection);
    fabricCanvas.on("selection:cleared", () => setSelectedObject(null));
    fabricCanvas.on("text:changed", updateSelection);
    fabricCanvas.on("text:editing:entered", updateSelection);
    fabricCanvas.on("text:editing:exited", updateSelection);

    return () => {
      fabricCanvas.off("selection:created", updateSelection);
      fabricCanvas.off("selection:updated", updateSelection);
      fabricCanvas.off("selection:cleared");
      fabricCanvas.off("text:changed", updateSelection);
      fabricCanvas.off("text:editing:entered", updateSelection);
      fabricCanvas.off("text:editing:exited", updateSelection);
    };
  }, [fabricCanvas]);

  const updateTextProperty = (property: string, value: any) => {
    if (selectedObject && (selectedObject.type === "textbox" || selectedObject.type === "i-text")) {
      const text = selectedObject as Textbox;
      text.set(property as any, value);
      fabricCanvas.renderAll();
    }
  };

  // Arrange functions
  const bringToFront = () => {
    if (selectedObject) {
      fabricCanvas.bringObjectToFront(selectedObject);
      fabricCanvas.renderAll();
      toast.success("Brought to front");
    }
  };

  const sendToBack = () => {
    if (selectedObject) {
      const objects = fabricCanvas.getObjects();
      const currentIndex = objects.indexOf(selectedObject);
      
      // Prevent going to index 0 (reserve for background layer)
      if (objects.length > 1 && currentIndex > 1) {
        // Remove and re-add at index 1 (above background)
        fabricCanvas.remove(selectedObject);
        fabricCanvas.insertAt(1, selectedObject);
        fabricCanvas.setActiveObject(selectedObject);
      } else if (currentIndex === 1) {
        toast.info("Object is already at the back");
      }
      
      fabricCanvas.renderAll();
      toast.success("Sent to back");
    }
  };

  const bringForward = () => {
    if (selectedObject) {
      fabricCanvas.bringObjectForward(selectedObject);
      fabricCanvas.renderAll();
      toast.success("Brought forward");
    }
  };

  const sendBackward = () => {
    if (selectedObject) {
      const objects = fabricCanvas.getObjects();
      const currentIndex = objects.indexOf(selectedObject);
      
      // Only move backward if not already at index 1 (preserve index 0 for background)
      if (currentIndex > 1) {
        fabricCanvas.sendObjectBackwards(selectedObject);
      } else if (currentIndex === 1) {
        toast.info("Object is already at the back");
      }
      
      fabricCanvas.renderAll();
      toast.success("Sent backward");
    }
  };

  // Delete function
  const deleteObject = () => {
    if (selectedObject) {
      fabricCanvas.remove(selectedObject);
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      toast.success("Object deleted");
    }
  };

  // Alignment functions
  const alignToPage = (alignment: string) => {
    if (!selectedObject) return;

    const canvasWidth = fabricCanvas.width || 0;
    const canvasHeight = fabricCanvas.height || 0;
    const objWidth = (selectedObject.width || 0) * (selectedObject.scaleX || 1);
    const objHeight = (selectedObject.height || 0) * (selectedObject.scaleY || 1);

    switch (alignment) {
      case "left":
        selectedObject.set({ left: 0 });
        break;
      case "center-h":
        selectedObject.set({ left: (canvasWidth - objWidth) / 2 });
        break;
      case "right":
        selectedObject.set({ left: canvasWidth - objWidth });
        break;
      case "top":
        selectedObject.set({ top: 0 });
        break;
      case "center-v":
        selectedObject.set({ top: (canvasHeight - objHeight) / 2 });
        break;
      case "bottom":
        selectedObject.set({ top: canvasHeight - objHeight });
        break;
    }

    selectedObject.setCoords();
    fabricCanvas.renderAll();
    toast.success("Object aligned");
  };

  if (!selectedObject) {
    return (
      <aside className="w-80 bg-[hsl(var(--sidebar-bg))] border-l border-border p-4">
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Select an object to edit properties
        </div>
      </aside>
    );
  }

  const isText = selectedObject.type === "textbox" || selectedObject.type === "i-text";

  return (
    <aside className="w-80 bg-[hsl(var(--sidebar-bg))] border-l border-border overflow-y-auto">
      <Tabs defaultValue={isText ? "properties" : "arrange"} className="w-full">
        <TabsList className={`w-full grid ${isText ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <TabsTrigger value="arrange">Arrange</TabsTrigger>
          {isText && <TabsTrigger value="properties">Properties</TabsTrigger>}
        </TabsList>

        <TabsContent value="arrange" className="p-4 space-y-4">
          {/* Layer Order */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Layer Order</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={bringForward} className="justify-start">
                <ArrowUp className="w-4 h-4 mr-2" />
                Forward
              </Button>
              <Button variant="outline" size="sm" onClick={sendBackward} className="justify-start">
                <ArrowDown className="w-4 h-4 mr-2" />
                Backward
              </Button>
              <Button variant="outline" size="sm" onClick={bringToFront} className="justify-start">
                <ArrowUp className="w-4 h-4 mr-2" />
                To front
              </Button>
              <Button variant="outline" size="sm" onClick={sendToBack} className="justify-start">
                <ArrowDown className="w-4 h-4 mr-2" />
                To back
              </Button>
            </div>
          </div>

          <Separator />

          {/* Align to Page */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Align to page</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => alignToPage("top")} className="justify-start">
                <AlignStartVertical className="w-4 h-4 mr-2" />
                Top
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignToPage("left")} className="justify-start">
                <AlignLeft className="w-4 h-4 mr-2" />
                Left
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignToPage("center-v")} className="justify-start">
                <AlignCenterVertical className="w-4 h-4 mr-2" />
                Middle
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignToPage("center-h")} className="justify-start">
                <AlignCenter className="w-4 h-4 mr-2" />
                Center
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignToPage("bottom")} className="justify-start">
                <AlignEndVertical className="w-4 h-4 mr-2" />
                Bottom
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignToPage("right")} className="justify-start">
                <AlignRight className="w-4 h-4 mr-2" />
                Right
              </Button>
            </div>
          </div>

          <Separator />

          {/* Position */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Position</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">X</Label>
                <Input
                  type="number"
                  value={Math.round(selectedObject.left || 0)}
                  onChange={(e) => {
                    selectedObject.set({ left: Number(e.target.value) });
                    selectedObject.setCoords();
                    fabricCanvas.renderAll();
                  }}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Y</Label>
                <Input
                  type="number"
                  value={Math.round(selectedObject.top || 0)}
                  onChange={(e) => {
                    selectedObject.set({ top: Number(e.target.value) });
                    selectedObject.setCoords();
                    fabricCanvas.renderAll();
                  }}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Delete */}
          <Button variant="destructive" onClick={deleteObject} className="w-full">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Object
          </Button>
        </TabsContent>

        <TabsContent value="properties" className="p-4 space-y-4">
          {isText && (
            <>
              {/* Font Family */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Font Family</Label>
                <Select
                  value={fontFamily}
                  onValueChange={(value) => {
                    setFontFamily(value);
                    updateTextProperty("fontFamily", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                    <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                    <SelectItem value="Impact">Impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Font Size</Label>
                <Input
                  type="number"
                  value={fontSize}
                  onChange={(e) => {
                    const size = Number(e.target.value);
                    setFontSize(size);
                    updateTextProperty("fontSize", size);
                  }}
                  min={8}
                  max={200}
                />
              </div>

              {/* Font Style */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Font Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={fontWeight}
                    onValueChange={(value) => {
                      setFontWeight(value);
                      updateTextProperty("fontWeight", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={fontStyle}
                    onValueChange={(value) => {
                      setFontStyle(value);
                      updateTextProperty("fontStyle", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="italic">Italic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Font Color */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Font Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={fontColor}
                    onChange={(e) => {
                      setFontColor(e.target.value);
                      updateTextProperty("fill", e.target.value);
                    }}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={fontColor}
                    onChange={(e) => {
                      setFontColor(e.target.value);
                      updateTextProperty("fill", e.target.value);
                    }}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Text Alignment</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={textAlign === "left" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setTextAlign("left");
                      updateTextProperty("textAlign", "left");
                    }}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={textAlign === "center" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setTextAlign("center");
                      updateTextProperty("textAlign", "center");
                    }}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={textAlign === "right" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setTextAlign("right");
                      updateTextProperty("textAlign", "right");
                    }}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default PropertiesPanel;
