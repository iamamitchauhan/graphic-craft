import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Canvas as FabricCanvas } from "fabric";
import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fabricCanvas: FabricCanvas;
};

const ExportDialog = ({ open, onOpenChange, fabricCanvas }: Props) => {
  const [format, setFormat] = useState<"png" | "jpg" | "json">("png");
  const [quality, setQuality] = useState<"1" | "2" | "3">("2");

  const handleExport = () => {
    if (!fabricCanvas) return;

    if (format === "json") {
      // Export as JSON
      const json = JSON.stringify(fabricCanvas.toJSON(), null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.download = `poster-${Date.now()}.json`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Exported as JSON");
    } else {
      // Export as image
      const multiplier = quality === "1" ? 1 : quality === "2" ? 2 : 3;
      
      const dataURL = fabricCanvas.toDataURL({
        format: format === "png" ? "png" : "jpeg",
        quality: 1,
        multiplier: multiplier,
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `poster-${Date.now()}.${format}`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported as ${format.toUpperCase()}`);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Your Design</DialogTitle>
          <DialogDescription>
            Choose your export format and quality settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as "png" | "jpg" | "json")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="png" id="png" />
                <Label htmlFor="png" className="font-normal cursor-pointer">
                  PNG (Transparent background support)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jpg" id="jpg" />
                <Label htmlFor="jpg" className="font-normal cursor-pointer">
                  JPG (Smaller file size)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="font-normal cursor-pointer">
                  JSON (Save and load your design)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {format !== "json" && (
            <div className="space-y-3">
              <Label>Quality / Resolution</Label>
              <RadioGroup value={quality} onValueChange={(v) => setQuality(v as "1" | "2" | "3")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="q1" />
                  <Label htmlFor="q1" className="font-normal cursor-pointer">
                    Standard (1x)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="q2" />
                  <Label htmlFor="q2" className="font-normal cursor-pointer">
                    High (2x) - Recommended
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="q3" />
                  <Label htmlFor="q3" className="font-normal cursor-pointer">
                    Ultra (3x) - Best quality
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button onClick={handleExport} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download {format.toUpperCase()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
