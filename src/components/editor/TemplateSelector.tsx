import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Smartphone } from "lucide-react";
import type { TemplateSize } from "@/pages/Editor";

type TemplateOption = {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  platform: string;
};

const templates: TemplateOption[] = [
  { name: "Facebook Post", width: 1200, height: 630, icon: <Facebook />, platform: "Facebook" },
  { name: "Instagram Post", width: 1080, height: 1080, icon: <Instagram />, platform: "Instagram" },
  { name: "Instagram Story", width: 1080, height: 1920, icon: <Instagram />, platform: "Instagram" },
  { name: "WhatsApp Status", width: 1080, height: 1920, icon: <Smartphone />, platform: "WhatsApp" },
  { name: "Twitter Post", width: 1200, height: 675, icon: <Twitter />, platform: "Twitter" },
  { name: "LinkedIn Post", width: 1200, height: 627, icon: <Linkedin />, platform: "LinkedIn" },
  { name: "YouTube Thumbnail", width: 1280, height: 720, icon: <Youtube />, platform: "YouTube" },
];

type Props = {
  onSelectTemplate: (template: TemplateSize) => void;
};

const TemplateSelector = ({ onSelectTemplate }: Props) => {
  const [customWidth, setCustomWidth] = useState("1200");
  const [customHeight, setCustomHeight] = useState("1200");

  const handleCustomSize = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    
    if (width > 0 && height > 0 && width <= 5000 && height <= 5000) {
      onSelectTemplate({
        name: "Custom Size",
        width,
        height,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Canvas</h2>
        <p className="text-muted-foreground">Select a template or create a custom size</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {templates.map((template) => (
          <Card
            key={template.name}
            className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {template.icon}
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {template.width} × {template.height}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-card">
        <h3 className="font-semibold text-lg mb-4 text-card-foreground">Custom Size</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="width">Width (px)</Label>
            <Input
              id="width"
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(e.target.value)}
              min="1"
              max="5000"
            />
          </div>
          <div>
            <Label htmlFor="height">Height (px)</Label>
            <Input
              id="height"
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(e.target.value)}
              min="1"
              max="5000"
            />
          </div>
        </div>
        <Button onClick={handleCustomSize} className="w-full">
          Create Custom Canvas
        </Button>
      </Card>
    </div>
  );
};

export default TemplateSelector;
