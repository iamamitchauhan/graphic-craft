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

  const handleTemplateChange = (template: TemplateSize) => {
    setSelectedTemplate(template);
    setFabricCanvas(null); // Reset canvas to trigger re-render
  };

  return (
    <div className="h-full flex flex-col bg-[hsl(var(--editor-bg))]">
      {selectedTemplate && fabricCanvas && (
        <Toolbar 
          fabricCanvas={fabricCanvas} 
          currentTemplate={selectedTemplate}
          onTemplateChange={handleTemplateChange}
        />
      )}
      
      <div className="flex-1 flex overflow-hidden min-h-0">
        {selectedTemplate && fabricCanvas && (
          <Sidebar fabricCanvas={fabricCanvas} />
        )}
        
        <main className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-auto">
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
