import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Line, FabricObject, IText } from "fabric";
import type { TemplateSize } from "@/pages/Editor";
import { toast } from "sonner";

type Props = {
  template: TemplateSize;
  onCanvasReady: (canvas: FabricCanvas) => void;
  initialData?: string;
};

const Canvas = ({ template, onCanvasReady, initialData }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Calculate scale to fit canvas in viewport
    const container = containerRef.current;
    if (!container) return;

    const containerPadding = 80;
    const maxWidth = container.clientWidth - containerPadding;
    const maxHeight = container.clientHeight - containerPadding;
    const scale = Math.min(maxWidth / template.width, maxHeight / template.height, 1);

    const canvas = new FabricCanvas(canvasRef.current, {
      width: template.width,
      height: template.height,
      backgroundColor: "#ffffff",
    });

    // Apply scaling if needed
    if (scale < 1) {
      canvas.setDimensions({
        width: template.width * scale,
        height: template.height * scale,
      });
      canvas.setZoom(scale);
    }

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
        x: template.width / 2,
        y: template.height / 2,
      };

      // Check canvas center alignment
      if (Math.abs(objCenter.x - canvasCenter.x) < snapThreshold) {
        obj.set({ left: canvasCenter.x - objWidth / 2 });
        const line = createGuideLine(
          [canvasCenter.x, 0, canvasCenter.x, template.height],
          true
        );
        verticalLines.push(line);
        canvas.add(line);
      }

      if (Math.abs(objCenter.y - canvasCenter.y) < snapThreshold) {
        obj.set({ top: canvasCenter.y - objHeight / 2 });
        const line = createGuideLine(
          [0, canvasCenter.y, template.width, canvasCenter.y],
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
            [otherCenter.x, 0, otherCenter.x, template.height],
            true
          );
          verticalLines.push(line);
          canvas.add(line);
        }

        if (Math.abs(objLeft - otherLeft) < snapThreshold) {
          obj.set({ left: otherLeft });
          const line = createGuideLine(
            [otherLeft, 0, otherLeft, template.height],
            true
          );
          verticalLines.push(line);
          canvas.add(line);
        }

        if (Math.abs(objRight - otherRight) < snapThreshold) {
          obj.set({ left: otherRight - objWidth });
          const line = createGuideLine(
            [otherRight, 0, otherRight, template.height],
            true
          );
          verticalLines.push(line);
          canvas.add(line);
        }

        // Horizontal alignment
        if (Math.abs(objCenter.y - otherCenter.y) < snapThreshold) {
          obj.set({ top: otherCenter.y - objHeight / 2 });
          const line = createGuideLine(
            [0, otherCenter.y, template.width, otherCenter.y],
            false
          );
          horizontalLines.push(line);
          canvas.add(line);
        }

        if (Math.abs(objTop - otherTop) < snapThreshold) {
          obj.set({ top: otherTop });
          const line = createGuideLine(
            [0, otherTop, template.width, otherTop],
            false
          );
          horizontalLines.push(line);
          canvas.add(line);
        }

        if (Math.abs(objBottom - otherBottom) < snapThreshold) {
          obj.set({ top: otherBottom - objHeight });
          const line = createGuideLine(
            [0, otherBottom, template.width, otherBottom],
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

    // Add predefined text based on template
    const addPredefinedText = () => {
      let textContent = "";
      let fontSize = 32;
      let topPosition = template.height * 0.3;

      // Customize text based on template type
      if (template.name.includes("Instagram")) {
        textContent = "Your Story\nStarts Here";
        fontSize = 48;
      } else if (template.name.includes("Facebook")) {
        textContent = "Connect & Share\nYour Moments";
        fontSize = 42;
      } else if (template.name.includes("Twitter") || template.name.includes("LinkedIn")) {
        textContent = "Make Your\nStatement";
        fontSize = 38;
      } else if (template.name.includes("YouTube")) {
        textContent = "Watch Now";
        fontSize = 52;
      } else if (template.name.includes("WhatsApp")) {
        textContent = "Share Your\nUpdate";
        fontSize = 44;
      } else {
        textContent = "Your Design\nStarts Here";
        fontSize = 40;
      }

      const text = new IText(textContent, {
        left: template.width / 2,
        top: topPosition,
        fontSize: fontSize,
        fontWeight: "bold",
        fill: "#000000",
        fontFamily: "Arial",
        textAlign: "center",
        originX: "center",
        originY: "top",
        editable: true,
        editingBorderColor: "#3b82f6",
      });

      canvas.add(text);
      canvas.renderAll();
    };

    // Load initial data if provided, otherwise add predefined text
    if (initialData) {
      try {
        const jsonData = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;
        canvas.loadFromJSON(jsonData, () => {
          // Make all text objects editable after loading (handle all text types)
          canvas.getObjects().forEach((obj) => {
            if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
              obj.set({
                editable: true,
                editingBorderColor: '#3b82f6',
                selectable: true,
                lockScalingFlip: true,
              });
            }
          });
          
          // Force multiple renders to ensure visibility
          canvas.renderAll();
          requestAnimationFrame(() => {
            canvas.renderAll();
            toast.success("Template loaded");
          });
        });
      } catch (error) {
        console.error("Error loading design:", error);
        toast.error("Failed to load template");
        addPredefinedText(); // Fallback to default text
      }
    } else {
      addPredefinedText();
    }

    // Enable text editing on double-click for all text types
    canvas.on("mouse:dblclick", (e) => {
      const target = e.target;
      if (target && (target.type === "i-text" || target.type === "text" || target.type === "textbox")) {
        const textObj = target as IText;
        textObj.enterEditing();
        textObj.selectAll();
        canvas.renderAll();
      }
    });

    // Also enable editing on selection for better UX
    canvas.on("selection:created", (e) => {
      const target = e.selected?.[0];
      if (target && (target.type === "i-text" || target.type === "text" || target.type === "textbox")) {
        const textObj = target as IText;
        textObj.set({ editable: true });
      }
    });

    // Handle delete key (only Delete, not Backspace)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
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
    onCanvasReady(canvas);
    toast.success(`Canvas ready: ${template.name}`);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, [template, onCanvasReady, initialData]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-auto p-4">
      <div className="shadow-2xl rounded-lg overflow-hidden bg-[hsl(var(--canvas-bg))] max-w-full max-h-full">
        <canvas ref={canvasRef} className="max-w-full max-h-full" style={{ display: 'block' }} />
      </div>
    </div>
  );
};

export default Canvas;
