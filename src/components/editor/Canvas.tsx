import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Line, FabricObject, IText, FabricImage } from "fabric";
import type { TemplateSize } from "@/pages/Editor";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { X } from "lucide-react";

type Props = {
  template: TemplateSize;
  onCanvasReady: (canvas: FabricCanvas) => void;
};

const Canvas = ({ template, onCanvasReady }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBackgroundPopover, setShowBackgroundPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Calculate scale to fit canvas in viewport
    const container = containerRef.current;
    if (!container) return;

    const maxWidth = container.clientWidth - 40;
    const maxHeight = container.clientHeight - 40;
    const scale = Math.min(maxWidth / template.width, maxHeight / template.height, 1);

    const canvas = new FabricCanvas(canvasRef.current, {
      width: template.width,
      height: template.height,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = "#000000";
      canvas.freeDrawingBrush.width = 2;
    }

    // Enable object controls
    canvas.selection = true;

    // Snapping guides
    const snapThreshold = 10;
    let verticalLines: Line[] = [];
    let horizontalLines: Line[] = [];

    const createGuideLine = (coords: [number, number, number, number], isVertical: boolean): Line => {
      return new Line(coords, {
        stroke: "#ff6b6b",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
      });
    };

    const clearGuideLines = () => {
      verticalLines.forEach((line) => canvas.remove(line));
      horizontalLines.forEach((line) => canvas.remove(line));
      verticalLines = [];
      horizontalLines = [];
    };

    // Magnetic alignment on object moving
    canvas.on("object:moving", (e) => {
      const obj = e.target as FabricObject;
      if (!obj) return;

      clearGuideLines();

      const objCenter = obj.getCenterPoint();
      const objLeft = obj.left || 0;
      const objTop = obj.top || 0;
      const objWidth = (obj.width || 0) * (obj.scaleX || 1);
      const objHeight = (obj.height || 0) * (obj.scaleY || 1);
      const objRight = objLeft + objWidth;
      const objBottom = objTop + objHeight;

      const canvasCenter = {
        x: (canvas.width || 0) / 2,
        y: (canvas.height || 0) / 2,
      };

      // Check canvas center alignment
      if (Math.abs(objCenter.x - canvasCenter.x) < snapThreshold) {
        obj.set({ left: canvasCenter.x - objWidth / 2 });
        const line = createGuideLine(
          [canvasCenter.x, 0, canvasCenter.x, canvas.height || 0],
          true
        );
        verticalLines.push(line);
        canvas.add(line);
      }

      if (Math.abs(objCenter.y - canvasCenter.y) < snapThreshold) {
        obj.set({ top: canvasCenter.y - objHeight / 2 });
        const line = createGuideLine(
          [0, canvasCenter.y, canvas.width || 0, canvasCenter.y],
          false
        );
        horizontalLines.push(line);
        canvas.add(line);
      }

      // Check alignment with other objects
      canvas.getObjects().forEach((otherObj) => {
        if (otherObj === obj || !otherObj.visible) return;

        const otherCenter = otherObj.getCenterPoint();
        const otherLeft = otherObj.left || 0;
        const otherTop = otherObj.top || 0;
        const otherWidth = (otherObj.width || 0) * (otherObj.scaleX || 1);
        const otherHeight = (otherObj.height || 0) * (otherObj.scaleY || 1);
        const otherRight = otherLeft + otherWidth;
        const otherBottom = otherTop + otherHeight;

        // Vertical alignment
        if (Math.abs(objCenter.x - otherCenter.x) < snapThreshold) {
          obj.set({ left: otherCenter.x - objWidth / 2 });
          const line = createGuideLine(
            [otherCenter.x, 0, otherCenter.x, canvas.height || 0],
            true
          );
          verticalLines.push(line);
          canvas.add(line);
        }

        if (Math.abs(objLeft - otherLeft) < snapThreshold) {
          obj.set({ left: otherLeft });
          const line = createGuideLine(
            [otherLeft, 0, otherLeft, canvas.height || 0],
            true
          );
          verticalLines.push(line);
          canvas.add(line);
        }

        if (Math.abs(objRight - otherRight) < snapThreshold) {
          obj.set({ left: otherRight - objWidth });
          const line = createGuideLine(
            [otherRight, 0, otherRight, canvas.height || 0],
            true
          );
          verticalLines.push(line);
          canvas.add(line);
        }

        // Horizontal alignment
        if (Math.abs(objCenter.y - otherCenter.y) < snapThreshold) {
          obj.set({ top: otherCenter.y - objHeight / 2 });
          const line = createGuideLine(
            [0, otherCenter.y, canvas.width || 0, otherCenter.y],
            false
          );
          horizontalLines.push(line);
          canvas.add(line);
        }

        if (Math.abs(objTop - otherTop) < snapThreshold) {
          obj.set({ top: otherTop });
          const line = createGuideLine(
            [0, otherTop, canvas.width || 0, otherTop],
            false
          );
          horizontalLines.push(line);
          canvas.add(line);
        }

        if (Math.abs(objBottom - otherBottom) < snapThreshold) {
          obj.set({ top: otherBottom - objHeight });
          const line = createGuideLine(
            [0, otherBottom, canvas.width || 0, otherBottom],
            false
          );
          horizontalLines.push(line);
          canvas.add(line);
        }
      });

      canvas.renderAll();
    });

    canvas.on("object:modified", clearGuideLines);
    canvas.on("selection:cleared", clearGuideLines);

    // Show background options on canvas click
    canvas.on("mouse:down", (e) => {
      if (!e.target && e.pointer) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          setPopoverPosition({
            x: rect.left + (e.pointer.x || 0),
            y: rect.top + (e.pointer.y || 0),
          });
          setShowBackgroundPopover(true);
        }
      }
    });

    // Enable text editing on double-click
    canvas.on("mouse:dblclick", (e) => {
      const target = e.target;
      if (target && target.type === "i-text") {
        const textObj = target as IText;
        textObj.enterEditing();
        textObj.selectAll();
        canvas.renderAll();
      }
    });

    // Handle delete key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
          activeObjects.forEach((obj) => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();
          toast.success("Deleted");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    fabricCanvasRef.current = canvas;
    onCanvasReady(canvas);
    toast.success(`Canvas ready: ${template.name}`);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, [template, onCanvasReady]);

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.backgroundColor = color;
      fabricCanvasRef.current.renderAll();
      toast.success("Background color updated");
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && fabricCanvasRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        const imgElement = new Image();
        imgElement.src = imgUrl;
        imgElement.onload = () => {
          if (fabricCanvasRef.current) {
            const fabricImage = new FabricImage(imgElement, {
              scaleX: (fabricCanvasRef.current.width || 0) / imgElement.width,
              scaleY: (fabricCanvasRef.current.height || 0) / imgElement.height,
            });
            fabricCanvasRef.current.backgroundImage = fabricImage;
            fabricCanvasRef.current.renderAll();
            toast.success("Background image set");
            setShowBackgroundPopover(false);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div ref={containerRef} className="w-full h-full flex items-center justify-center">
        <div className="shadow-2xl rounded-lg overflow-hidden bg-[hsl(var(--canvas-bg))]">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {showBackgroundPopover && (
        <div
          style={{
            position: "fixed",
            left: popoverPosition.x,
            top: popoverPosition.y,
            zIndex: 50,
          }}
        >
          <div className="bg-popover border rounded-md shadow-md p-4 w-64">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Canvas Background</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowBackgroundPopover(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Background Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Canvas;
