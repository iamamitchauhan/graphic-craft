import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Undo,
  Redo,
  Download,
  Image as ImageIcon,
  Home,
  Palette,
  MoveVertical,
  Maximize2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Smartphone,
  Trash2,
} from "lucide-react";
import { Canvas as FabricCanvas, FabricImage, IText } from "fabric";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExportDialog from "./ExportDialog";
import type { TemplateSize } from "@/pages/Editor";
import { toast } from "@/hooks/use-toast";

type TemplateOption = {
  name: string;
  width: number;
  height: number;
  platform: string;
};

const templates: TemplateOption[] = [
  { name: "Instagram Post", width: 1080, height: 1080, platform: "Instagram" },
  { name: "Instagram Story", width: 1080, height: 1920, platform: "Instagram" },
  { name: "Facebook Post", width: 1200, height: 630, platform: "Facebook" },
  { name: "Facebook Story", width: 1080, height: 1920, platform: "Facebook" },
  { name: "WhatsApp Status", width: 1080, height: 1920, platform: "WhatsApp" },
  { name: "Twitter Post", width: 1600, height: 900, platform: "Twitter" },
  { name: "Twitter Header", width: 1500, height: 500, platform: "Twitter" },
  { name: "LinkedIn Post", width: 1200, height: 627, platform: "LinkedIn" },
  { name: "LinkedIn Cover", width: 1584, height: 396, platform: "LinkedIn" },
  { name: "YouTube Thumbnail", width: 1280, height: 720, platform: "YouTube" },
  { name: "Pinterest Pin", width: 1000, height: 1500, platform: "Pinterest" },
  { name: "Threads Post", width: 1080, height: 1350, platform: "Threads" },
];

type Props = {
  fabricCanvas: FabricCanvas;
  currentTemplate: TemplateSize;
  onTemplateChange: (template: TemplateSize) => void;
};

const Toolbar = ({ fabricCanvas, currentTemplate, onTemplateChange }: Props) => {
  const navigate = useNavigate();
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("24");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [showExport, setShowExport] = useState(false);
  const [fillColor, setFillColor] = useState("#3b82f6");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState("0");

  // Update controls when selection changes
  useEffect(() => {
    const updateControls = () => {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        const textObj = activeObject as IText;
        setTextColor((textObj.fill as string) || "#000000");
        setFontSize(String(textObj.fontSize || 24));
        setFontFamily(textObj.fontFamily || "Arial");
      }
      if (activeObject) {
        setFillColor((activeObject.fill as string) || "#3b82f6");
        setStrokeColor((activeObject.stroke as string) || "#000000");
        setStrokeWidth(String(activeObject.strokeWidth || 0));
      }
    };

    fabricCanvas.on("selection:created", updateControls);
    fabricCanvas.on("selection:updated", updateControls);

    return () => {
      fabricCanvas.off("selection:created", updateControls);
      fabricCanvas.off("selection:updated", updateControls);
    };
  }, [fabricCanvas]);

  const handleTextStyle = (style: "bold" | "italic" | "underline") => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      const currentValue = activeObject.get(style === "underline" ? "underline" : style === "bold" ? "fontWeight" : "fontStyle");
      
      if (style === "bold") {
        activeObject.set("fontWeight", currentValue === "bold" ? "normal" : "bold");
      } else if (style === "italic") {
        activeObject.set("fontStyle", currentValue === "italic" ? "normal" : "italic");
      } else {
        activeObject.set("underline", !currentValue);
      }
      
      fabricCanvas.renderAll();
    }
  };

  const handleAlignment = (alignment: "left" | "center" | "right") => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      if (alignment === "left") {
        activeObject.set({ left: 50 });
      } else if (alignment === "center") {
        activeObject.set({ left: (fabricCanvas.width || 0) / 2 });
        activeObject.setCoords();
      } else {
        activeObject.set({ left: (fabricCanvas.width || 0) - 50 });
      }
      fabricCanvas.renderAll();
    }
  };

  const handleVerticalAlignment = (alignment: "top" | "middle" | "bottom") => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      if (alignment === "top") {
        activeObject.set({ top: 50 });
      } else if (alignment === "middle") {
        activeObject.set({ top: (fabricCanvas.height || 0) / 2 });
      } else {
        activeObject.set({ top: (fabricCanvas.height || 0) - 50 });
      }
      activeObject.setCoords();
      fabricCanvas.renderAll();
    }
  };

  const handleBringForward = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.bringObjectForward(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const handleSendBackward = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.sendObjectBackwards(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const handleBringToFront = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.bringObjectToFront(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const handleSendToBack = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.sendObjectToBack(activeObject);
      fabricCanvas.renderAll();
    }
  };

  const handleClearBackground = () => {
    fabricCanvas.backgroundImage = undefined;
    fabricCanvas.backgroundColor = "#ffffff";
    setBackgroundColor("#ffffff");
    fabricCanvas.renderAll();
    toast({
      title: "Background cleared",
      description: "Canvas background has been reset",
    });
  };

  const handleBackgroundColor = (color: string) => {
    setBackgroundColor(color);
    fabricCanvas.backgroundColor = color;
    fabricCanvas.renderAll();
  };

  const handleBackgroundImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        const imgElement = new Image();
        imgElement.src = imgUrl;
        imgElement.onload = () => {
          const fabricImage = new FabricImage(imgElement, {
            scaleX: (fabricCanvas.width || 0) / imgElement.width,
            scaleY: (fabricCanvas.height || 0) / imgElement.height,
          });
          fabricCanvas.backgroundImage = fabricImage;
          fabricCanvas.renderAll();
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fill", color);
      fabricCanvas.renderAll();
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fontSize", parseInt(size));
      fabricCanvas.renderAll();
    }
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fontFamily", family);
      fabricCanvas.renderAll();
    }
  };

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.set("fill", color);
      fabricCanvas.renderAll();
    }
  };

  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.set("stroke", color);
      fabricCanvas.renderAll();
    }
  };

  const handleStrokeWidthChange = (width: string) => {
    setStrokeWidth(width);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.set("strokeWidth", parseInt(width));
      fabricCanvas.renderAll();
    }
  };

  const handleCenterTextOnShape = () => {
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length === 2) {
      const textObj = activeObjects.find(obj => obj.type === "i-text");
      const shapeObj = activeObjects.find(obj => obj.type !== "i-text");
      
      if (textObj && shapeObj) {
        const shapeCenter = shapeObj.getCenterPoint();
        textObj.set({
          left: shapeCenter.x,
          top: shapeCenter.y,
          originX: "center",
          originY: "center",
        });
        textObj.setCoords();
        fabricCanvas.renderAll();
      }
    }
  };

  return (
    <>
      <div className="bg-[hsl(var(--toolbar-bg))] border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Home Button */}
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <Home className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          {/* Canvas Size Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Maximize2 className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">
                  {currentTemplate.width} × {currentTemplate.height}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <Label>Canvas Size</Label>
                <Select 
                  value={`${currentTemplate.width}x${currentTemplate.height}`}
                  onValueChange={(value) => {
                    const template = templates.find(
                      t => `${t.width}x${t.height}` === value
                    );
                    if (template) {
                      onTemplateChange(template);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem 
                        key={template.name} 
                        value={`${template.width}x${template.height}`}
                      >
                        {template.name} ({template.width} × {template.height})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-px h-6 bg-border" />

          {/* Text Controls */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Type className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <Label>Font Family</Label>
                  <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Font Size</Label>
                  <Input
                    type="number"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                    min="8"
                    max="200"
                  />
                </div>
                <div>
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" onClick={() => handleTextStyle("bold")}>
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleTextStyle("italic")}>
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleTextStyle("underline")}>
            <Underline className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          {/* Background Controls */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-4">
                <div>
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => handleBackgroundColor(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Background Image</Label>
                  <Input type="file" accept="image/*" onChange={handleBackgroundImage} />
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleClearBackground}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Background
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-px h-6 bg-border" />

          {/* Shape Styling */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <Label>Fill Color</Label>
                  <Input
                    type="color"
                    value={fillColor}
                    onChange={(e) => handleFillColorChange(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Stroke Color</Label>
                  <Input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => handleStrokeColorChange(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Stroke Width</Label>
                  <Input
                    type="number"
                    value={strokeWidth}
                    onChange={(e) => handleStrokeWidthChange(e.target.value)}
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCenterTextOnShape}
            title="Center text on shape (select both)"
          >
            <MoveVertical className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          {/* Alignment */}
          <Button variant="ghost" size="icon" onClick={() => handleAlignment("left")}>
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleAlignment("center")}>
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleAlignment("right")}>
            <AlignRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleVerticalAlignment("middle")}>
            <AlignVerticalJustifyCenter className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          {/* Layers */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBringToFront}
            title="Bring to front"
          >
            <ChevronsUp className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBringForward}
            title="Bring forward"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSendBackward}
            title="Send backward"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSendToBack}
            title="Send to back"
          >
            <ChevronsDown className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          {/* Undo/Redo - Basic implementation */}
          <Button variant="ghost" size="icon">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Redo className="w-4 h-4" />
          </Button>

          <div className="flex-1" />

          {/* Export */}
          <Button onClick={() => setShowExport(true)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        fabricCanvas={fabricCanvas}
      />
    </>
  );
};

export default Toolbar;
