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
  List,
  ListOrdered,
  Save,
} from "lucide-react";
import { Canvas as FabricCanvas, FabricImage, IText } from "fabric";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ExportDialog from "./ExportDialog";
import type { TemplateSize } from "@/pages/Editor";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

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
  
  // History management for undo/redo
  const historyRef = useRef<string[]>([]);
  const historyStepRef = useRef<number>(-1);
  const isProcessingRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const isModifyingRef = useRef(false);
  const eventHandlersRef = useRef<{
    saveState: () => void;
    debouncedSaveState: () => void;
  } | null>(null);

  // Initialize history
  useEffect(() => {
    const saveState = () => {
      if (isProcessingRef.current || !isInitializedRef.current || isModifyingRef.current) return;
      
      const json = JSON.stringify(fabricCanvas.toJSON());
      
      // Avoid duplicate states
      const lastState = historyRef.current[historyStepRef.current];
      if (lastState === json) return;
      
      // Remove any future states if we're not at the end
      if (historyStepRef.current < historyRef.current.length - 1) {
        historyRef.current = historyRef.current.slice(0, historyStepRef.current + 1);
      }
      
      historyRef.current.push(json);
      historyStepRef.current++;
      
      // Limit history to 50 states to prevent memory issues
      if (historyRef.current.length > 50) {
        historyRef.current.shift();
        historyStepRef.current--;
      }
    };

    // Track when object modification starts (drag, scale, rotate)
    const handleModifyStart = () => {
      isModifyingRef.current = true;
    };

    // Track when object modification ends
    const handleModifyEnd = () => {
      isModifyingRef.current = false;
      // Save state after modification completes
      if (!isProcessingRef.current && isInitializedRef.current) {
        saveState();
      }
    };

    // Store handlers in ref so we can remove them during undo/redo
    eventHandlersRef.current = { saveState, debouncedSaveState: handleModifyEnd };

    // Wait a bit for canvas to fully initialize before tracking history
    const initTimeout = setTimeout(() => {
      if (!isInitializedRef.current) {
        const initialState = JSON.stringify(fabricCanvas.toJSON());
        historyRef.current = [initialState];
        historyStepRef.current = 0;
        isInitializedRef.current = true;
      }
    }, 500);

    // Track meaningful changes
    fabricCanvas.on("object:added", saveState);
    fabricCanvas.on("object:removed", saveState);
    
    // Track modification start events
    fabricCanvas.on("object:moving", handleModifyStart);
    fabricCanvas.on("object:scaling", handleModifyStart);
    fabricCanvas.on("object:rotating", handleModifyStart);
    fabricCanvas.on("object:skewing", handleModifyStart);
    
    // Track modification end - only save once when done
    fabricCanvas.on("object:modified", handleModifyEnd);
    
    // For text changes, save immediately
    fabricCanvas.on("text:changed", saveState);

    // Handle auto-continuation of lists when Enter is pressed
    const handleTextInput = (e: any) => {
      const activeObject = e.target;
      if (activeObject && (activeObject.type === "textbox" || activeObject.type === "i-text")) {
        const text = activeObject.text || "";
        const lines = text.split("\n");
        const cursorPosition = activeObject.selectionStart;
        
        // Find which line the cursor is on
        let charCount = 0;
        let currentLineIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          charCount += lines[i].length + 1; // +1 for newline
          if (charCount > cursorPosition) {
            currentLineIndex = i;
            break;
          }
        }
        
        // Check if we just added a new line (previous line has list formatting)
        if (currentLineIndex > 0 && lines[currentLineIndex] === "") {
          const previousLine = lines[currentLineIndex - 1];
          
          // Check for bullet list
          if (previousLine.trim().startsWith("•")) {
            lines[currentLineIndex] = "• ";
            activeObject.set("text", lines.join("\n"));
            activeObject.selectionStart = activeObject.selectionEnd = charCount + 2;
            fabricCanvas.renderAll();
            return;
          }
          
          // Check for numbered list
          const numberMatch = previousLine.trim().match(/^(\d+)\.\s/);
          if (numberMatch) {
            const nextNumber = parseInt(numberMatch[1]) + 1;
            lines[currentLineIndex] = `${nextNumber}. `;
            activeObject.set("text", lines.join("\n"));
            activeObject.selectionStart = activeObject.selectionEnd = charCount + `${nextNumber}. `.length;
            fabricCanvas.renderAll();
            return;
          }
        }
      }
    };

    fabricCanvas.on("text:changed", handleTextInput);

    return () => {
      clearTimeout(initTimeout);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      fabricCanvas.off("object:added", saveState);
      fabricCanvas.off("object:removed", saveState);
      fabricCanvas.off("object:moving", handleModifyStart);
      fabricCanvas.off("object:scaling", handleModifyStart);
      fabricCanvas.off("object:rotating", handleModifyStart);
      fabricCanvas.off("object:skewing", handleModifyStart);
      fabricCanvas.off("object:modified", handleModifyEnd);
      fabricCanvas.off("text:changed", saveState);
      fabricCanvas.off("text:changed", handleTextInput);
    };
  }, [fabricCanvas]);

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
      saveStateToHistory(); // Save text style change
    }
  };

  const handleBulletList = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && (activeObject.type === "textbox" || activeObject.type === "i-text")) {
      const textObj = activeObject as IText;
      const text = textObj.text || "";
      const lines = text.split("\n");
      
      // Remove any existing list formatting first
      const cleanLines = lines.map(line => 
        line.replace(/^•\s*/, "").replace(/^\d+\.\s*/, "").trim()
      );
      
      // Check if already has bullets
      const hasBullets = lines.every(line => line.trim().startsWith("•") || line.trim() === "");
      
      if (hasBullets) {
        // Remove bullets
        const newText = cleanLines.join("\n");
        textObj.set("text", newText);
      } else {
        // Add bullets
        const newText = cleanLines.map(line => line ? `• ${line}` : "").join("\n");
        textObj.set("text", newText);
      }
      
      fabricCanvas.renderAll();
      saveStateToHistory();
    }
  };

  const handleNumberedList = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && (activeObject.type === "textbox" || activeObject.type === "i-text")) {
      const textObj = activeObject as IText;
      const text = textObj.text || "";
      const lines = text.split("\n");
      
      // Remove any existing list formatting first
      const cleanLines = lines.map(line => 
        line.replace(/^•\s*/, "").replace(/^\d+\.\s*/, "").trim()
      );
      
      // Check if already has numbers
      const hasNumbers = lines.every(line => /^\d+\.\s/.test(line.trim()) || line.trim() === "");
      
      if (hasNumbers) {
        // Remove numbers
        const newText = cleanLines.join("\n");
        textObj.set("text", newText);
      } else {
        // Add numbers
        let counter = 1;
        const newText = cleanLines.map(line => {
          if (line) {
            return `${counter++}. ${line}`;
          }
          return "";
        }).join("\n");
        textObj.set("text", newText);
      }
      
      fabricCanvas.renderAll();
      saveStateToHistory();
    }
  };

  const handleAlignment = (alignment: "left" | "center" | "right") => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      if (alignment === "left") {
        activeObject.set({ 
          left: 50,
          originX: "left"
        });
      } else if (alignment === "center") {
        activeObject.set({ 
          left: currentTemplate.width / 2,
          originX: "center"
        });
      } else {
        activeObject.set({ 
          left: currentTemplate.width - 50,
          originX: "right"
        });
      }
      activeObject.setCoords();
      fabricCanvas.renderAll();
    }
  };

  const handleVerticalAlignment = (alignment: "top" | "middle" | "bottom") => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      if (alignment === "top") {
        activeObject.set({ 
          top: 50,
          originY: "top"
        });
      } else if (alignment === "middle") {
        activeObject.set({ 
          top: currentTemplate.height / 2,
          originY: "center"
        });
      } else {
        activeObject.set({ 
          top: currentTemplate.height - 50,
          originY: "bottom"
        });
      }
      activeObject.setCoords();
      fabricCanvas.renderAll();
    }
  };

  const saveStateToHistory = () => {
    if (isProcessingRef.current || !isInitializedRef.current) return;
    
    const json = JSON.stringify(fabricCanvas.toJSON());
    const lastState = historyRef.current[historyStepRef.current];
    if (lastState === json) return;
    
    // Remove any future states if we're not at the end
    historyStepRef.current++;
    historyRef.current = historyRef.current.slice(0, historyStepRef.current);
    historyRef.current.push(json);
    
    // Limit history to 50 states
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyStepRef.current--;
    }
  };

  const handleBringForward = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.bringObjectForward(activeObject);
      fabricCanvas.renderAll();
      saveStateToHistory(); // Save layer change
    }
  };

  const handleSendBackward = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.sendObjectBackwards(activeObject);
      fabricCanvas.renderAll();
      saveStateToHistory(); // Save layer change
    }
  };

  const handleBringToFront = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.bringObjectToFront(activeObject);
      fabricCanvas.renderAll();
      saveStateToHistory(); // Save layer change
    }
  };

  const handleSendToBack = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.sendObjectToBack(activeObject);
      fabricCanvas.renderAll();
      saveStateToHistory(); // Save layer change
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
    saveStateToHistory();
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
          saveStateToHistory(); // Save background image change
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
      saveStateToHistory(); // Save text color change
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fontSize", parseInt(size));
      fabricCanvas.renderAll();
      saveStateToHistory(); // Save font size change
    }
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fontFamily", family);
      fabricCanvas.renderAll();
      saveStateToHistory(); // Save font family change
    }
  };

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.set("fill", color);
      fabricCanvas.renderAll();
      saveStateToHistory(); // Save fill color change
    }
  };

  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.set("stroke", color);
      fabricCanvas.renderAll();
      saveStateToHistory(); // Save stroke color change
    }
  };

  const handleStrokeWidthChange = (width: string) => {
    setStrokeWidth(width);
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.set("strokeWidth", parseInt(width));
      fabricCanvas.renderAll();
      saveStateToHistory(); // Save stroke width change
    }
  };

  const handleDelete = () => {
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach((obj) => fabricCanvas.remove(obj));
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      toast({
        title: "Deleted",
        description: "Selected objects removed",
      });
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

  const handleUndo = async () => {
    if (historyStepRef.current > 0 && !isProcessingRef.current && eventHandlersRef.current) {
      isProcessingRef.current = true;
      
      // Temporarily remove event listeners to prevent saving new states
      const { saveState, debouncedSaveState } = eventHandlersRef.current;
      fabricCanvas.off("object:added", saveState);
      fabricCanvas.off("object:removed", saveState);
      fabricCanvas.off("object:modified", debouncedSaveState);
      fabricCanvas.off("text:changed", debouncedSaveState);
      
      historyStepRef.current--;
      const state = historyRef.current[historyStepRef.current];
      
      try {
        await fabricCanvas.loadFromJSON(JSON.parse(state));
        
        // Ensure all objects are properly rendered
        fabricCanvas.getObjects().forEach((obj) => {
          obj.setCoords();
        });
        
        fabricCanvas.renderAll();
        
        toast({
          title: "Undo",
          description: "Action undone",
        });
      } catch (error) {
        console.error("Undo failed:", error);
        historyStepRef.current++; // Restore position on error
      } finally {
        // Re-attach event listeners after a delay
        setTimeout(() => {
          if (eventHandlersRef.current) {
            const { saveState, debouncedSaveState } = eventHandlersRef.current;
            fabricCanvas.on("object:added", saveState);
            fabricCanvas.on("object:removed", saveState);
            fabricCanvas.on("object:modified", debouncedSaveState);
            fabricCanvas.on("text:changed", debouncedSaveState);
          }
          isProcessingRef.current = false;
        }, 100);
      }
    }
  };

  const handleRedo = async () => {
    if (historyStepRef.current < historyRef.current.length - 1 && !isProcessingRef.current && eventHandlersRef.current) {
      isProcessingRef.current = true;
      
      // Temporarily remove event listeners to prevent saving new states
      const { saveState, debouncedSaveState } = eventHandlersRef.current;
      fabricCanvas.off("object:added", saveState);
      fabricCanvas.off("object:removed", saveState);
      fabricCanvas.off("object:modified", debouncedSaveState);
      fabricCanvas.off("text:changed", debouncedSaveState);
      
      historyStepRef.current++;
      const state = historyRef.current[historyStepRef.current];
      
      try {
        await fabricCanvas.loadFromJSON(JSON.parse(state));
        
        // Ensure all objects are properly rendered
        fabricCanvas.getObjects().forEach((obj) => {
          obj.setCoords();
        });
        
        fabricCanvas.renderAll();
        
        toast({
          title: "Redo",
          description: "Action redone",
        });
      } catch (error) {
        console.error("Redo failed:", error);
        historyStepRef.current--; // Restore position on error
      } finally {
        // Re-attach event listeners after a delay
        setTimeout(() => {
          if (eventHandlersRef.current) {
            const { saveState, debouncedSaveState } = eventHandlersRef.current;
            fabricCanvas.on("object:added", saveState);
            fabricCanvas.on("object:removed", saveState);
            fabricCanvas.on("object:modified", debouncedSaveState);
            fabricCanvas.on("text:changed", debouncedSaveState);
          }
          isProcessingRef.current = false;
        }, 100);
      }
    }
  };

  const handleSaveDesign = () => {
    const designData = JSON.stringify(fabricCanvas.toJSON());
    const thumbnail = fabricCanvas.toDataURL({ format: 'png', quality: 0.5, multiplier: 0.2 });
    
    const design = {
      id: Date.now().toString(),
      name: currentTemplate.name,
      thumbnail,
      data: designData,
      width: currentTemplate.width,
      height: currentTemplate.height,
      createdAt: Date.now(),
    };

    const saved = localStorage.getItem("posterCreatorDesigns");
    const designs = saved ? JSON.parse(saved) : [];
    designs.push(design);
    localStorage.setItem("posterCreatorDesigns", JSON.stringify(designs));

    toast({
      title: "Saved",
      description: "Design saved successfully",
    });
  };

  const handleLoadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonString = event.target?.result as string;
        try {
          const json = JSON.parse(jsonString);
          
          // Clear current canvas
          fabricCanvas.clear();
          
          // Load the JSON data
          fabricCanvas.loadFromJSON(json).then(() => {
            // Restore background color if present
            if (json.background) {
              fabricCanvas.backgroundColor = json.background;
              setBackgroundColor(json.background);
            }
            
            // Restore background image if present
            if (json.backgroundImage) {
              fabricCanvas.backgroundImage = json.backgroundImage;
            }
            
            // Ensure all objects are marked for rendering
            fabricCanvas.getObjects().forEach((obj) => {
              obj.setCoords();
            });
            
            // Force canvas refresh
            fabricCanvas.requestRenderAll();
            
            // Additional render to ensure visibility
            setTimeout(() => {
              fabricCanvas.renderAll();
            }, 0);
            
            // Save to history
            const state = JSON.stringify(fabricCanvas.toJSON());
            historyStepRef.current++;
            historyRef.current[historyStepRef.current] = state;
            historyRef.current = historyRef.current.slice(0, historyStepRef.current + 1);
            
            toast({
              title: "Loaded",
              description: "Design loaded successfully",
            });
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid JSON file",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    e.target.value = "";
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBulletList}
            title="Bullet list"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNumberedList}
            title="Numbered list"
          >
            <ListOrdered className="w-4 h-4" />
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

          {/* Delete */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            title="Delete selected"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          {/* Undo/Redo */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleUndo}
            disabled={historyStepRef.current <= 0}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRedo}
            disabled={historyStepRef.current >= historyRef.current.length - 1}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </Button>

          <div className="flex-1" />

          {/* Load JSON */}
          <label htmlFor="load-json">
            <Button variant="outline" asChild>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Load
              </span>
            </Button>
          </label>
          <input
            id="load-json"
            type="file"
            accept=".json"
            onChange={handleLoadJSON}
            className="hidden"
          />

          {/* Save */}
          <Button onClick={handleSaveDesign} variant="secondary">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

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
