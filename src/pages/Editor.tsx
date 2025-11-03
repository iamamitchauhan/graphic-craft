import { useState } from "react";
import TemplateSelector from "@/components/editor/TemplateSelector";
import Toolbar from "@/components/editor/Toolbar";
import Sidebar from "@/components/editor/Sidebar";
import Canvas from "@/components/editor/Canvas";
import { Canvas as FabricCanvas } from "fabric";

export type TemplateSize = {
  name: string;
  width: number;
  height: number;
};

const Editor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSize | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  return (
    <div className="h-screen flex flex-col bg-[hsl(var(--editor-bg))]">
      {selectedTemplate && fabricCanvas && (
        <Toolbar fabricCanvas={fabricCanvas} />
      )}
      
      <div className="flex-1 flex overflow-hidden">
        {selectedTemplate && fabricCanvas && (
          <Sidebar fabricCanvas={fabricCanvas} />
        )}
        
        <main className="flex-1 flex items-center justify-center p-8">
          {!selectedTemplate ? (
            <TemplateSelector onSelectTemplate={setSelectedTemplate} />
          ) : (
            <Canvas
              template={selectedTemplate}
              onCanvasReady={setFabricCanvas}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Editor;
