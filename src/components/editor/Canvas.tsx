import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Line, FabricObject, IText, Group } from "fabric";
import type { TemplateSize } from "@/pages/Editor";
import { toast } from "sonner";

type Props = {
  template: TemplateSize;
  onCanvasReady: (canvas: FabricCanvas) => void;
};

const Canvas = ({ template, onCanvasReady }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Enable text editing on double-click, or add text to shapes
    canvas.on("mouse:dblclick", (e) => {
      const target = e.target;
      
      // Check if target is a group with text
      if (target && target.type === "group") {
        const group = target as Group;
        const textObj = group.getObjects().find(obj => obj.type === "i-text") as IText;
        if (textObj) {
          // Enter editing mode for text in group
          group.set({ selectable: false });
          canvas.setActiveObject(textObj);
          textObj.enterEditing();
          textObj.selectAll();
          canvas.renderAll();
          
          // Re-enable group selection when text editing ends
          textObj.on("editing:exited", () => {
            group.set({ selectable: true });
            canvas.setActiveObject(group);
            canvas.renderAll();
          });
        }
      } else if (target && target.type === "i-text") {
        const textObj = target as IText;
        textObj.enterEditing();
        textObj.selectAll();
        canvas.renderAll();
      } else if (target && target.type !== "i-text" && target.type !== "group") {
        // Add text to shape and group them
        const shapeCenter = target.getCenterPoint();
        const shapeLeft = target.left || 0;
        const shapeTop = target.top || 0;
        
        const text = new IText("Text", {
          left: 0,
          top: 0,
          fontSize: 24,
          fontWeight: "normal",
          fill: "#000000",
          fontFamily: "Arial",
          editable: true,
          editingBorderColor: "#3b82f6",
          originX: "center",
          originY: "center",
        });
        
        // Remove the original shape
        canvas.remove(target);
        
        // Create group with shape and text
        const group = new Group([target, text], {
          left: shapeLeft,
          top: shapeTop,
          originX: "left",
          originY: "top",
        });
        
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
        
        // Immediately enter text editing
        setTimeout(() => {
          group.set({ selectable: false });
          canvas.setActiveObject(text);
          text.enterEditing();
          text.selectAll();
          canvas.renderAll();
          
          text.on("editing:exited", () => {
            group.set({ selectable: true });
            canvas.setActiveObject(group);
            canvas.renderAll();
          });
        }, 100);
        
        toast.success("Text added - edit now");
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
    onCanvasReady(canvas);
    toast.success(`Canvas ready: ${template.name}`);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, [template, onCanvasReady]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <div className="shadow-2xl rounded-lg overflow-hidden bg-[hsl(var(--canvas-bg))]">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Canvas;
