import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
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
    canvas.freeDrawingBrush.color = "#000000";
    canvas.freeDrawingBrush.width = 2;

    // Enable object controls
    canvas.selection = true;

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
