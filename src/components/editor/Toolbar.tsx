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
  Undo,
  Redo,
  Download,
  Image as ImageIcon,
  Home,
} from "lucide-react";
import { Canvas as FabricCanvas, FabricImage } from "fabric";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExportDialog from "./ExportDialog";

type Props = {
  fabricCanvas: FabricCanvas;
};

const Toolbar = ({ fabricCanvas }: Props) => {
  const navigate = useNavigate();
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("24");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [showExport, setShowExport] = useState(false);

  const handleTextStyle = (style: "bold" | "italic" | "underline") => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "text") {
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
    if (activeObject && activeObject.type === "text") {
      activeObject.set("fill", color);
      fabricCanvas.renderAll();
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "text") {
      activeObject.set("fontSize", parseInt(size));
      fabricCanvas.renderAll();
    }
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "text") {
      activeObject.set("fontFamily", family);
      fabricCanvas.renderAll();
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
              </div>
            </PopoverContent>
          </Popover>

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
          <Button variant="ghost" size="icon" onClick={handleBringForward}>
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSendBackward}>
            <ArrowDown className="w-4 h-4" />
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
