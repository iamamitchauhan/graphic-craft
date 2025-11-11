import { useState } from "react";
import { Canvas as FabricCanvas, Textbox } from "fabric";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Palette } from "lucide-react";
import { toast } from "sonner";

type ColorPalette = {
  name: string;
  colors: string[];
  category: string;
};

const colorPalettes: ColorPalette[] = [
  // Creative
  { name: "Ocean Depths", colors: ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#94b4d4"], category: "Creative" },
  { name: "Purple Dream", colors: ["#3a0842", "#6b0f9f", "#8e44ad", "#c39bd3", "#f4ecf7"], category: "Creative" },
  { name: "Sunset Vibes", colors: ["#1a1a1a", "#e74c3c", "#ff7f50", "#ffa07a", "#ffd6ba"], category: "Creative" },
  
  // Fun
  { name: "Candy Pop", colors: ["#5e60ce", "#6f42c1", "#9d4edd", "#c77dff", "#ffafcc"], category: "Fun" },
  { name: "Forest Night", colors: ["#081c15", "#1b4332", "#2d6a4f", "#40916c", "#52b788"], category: "Fun" },
  { name: "Ruby Red", colors: ["#0a0a0a", "#370617", "#6a040f", "#9d0208", "#d00000"], category: "Fun" },
  
  // Lively
  { name: "Spring Fresh", colors: ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#b7e4c7"], category: "Lively" },
  { name: "Peach Cream", colors: ["#e85d04", "#f48c06", "#faa307", "#ffba08", "#ffd60a"], category: "Lively" },
  { name: "Berry Blast", colors: ["#ff006e", "#fb5607", "#ff006e", "#d62828", "#f72585"], category: "Lively" },
  
  // Colorful
  { name: "Rainbow", colors: ["#001219", "#005f73", "#0a9396", "#94d2bd", "#e9d8a6"], category: "Colorful" },
  { name: "Golden Hour", colors: ["#780000", "#c1121f", "#fdf0d5", "#f4a261", "#ee9b00"], category: "Colorful" },
  { name: "Tropical", colors: ["#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00"], category: "Colorful" },
  
  // Bold
  { name: "Electric", colors: ["#03045e", "#023e8a", "#0077b6", "#0096c7", "#00b4d8"], category: "Bold" },
  { name: "Fire", colors: ["#370617", "#6a040f", "#9d0208", "#d00000", "#dc2f02"], category: "Bold" },
  { name: "Neon", colors: ["#ff006e", "#fb5607", "#ffbe0b", "#8338ec", "#3a86ff"], category: "Bold" },
  
  // Neutral
  { name: "Minimal Gray", colors: ["#212529", "#495057", "#6c757d", "#adb5bd", "#dee2e6"], category: "Neutral" },
  { name: "Earth Tones", colors: ["#3d3522", "#755c48", "#9b826f", "#c4a676", "#f3e5ab"], category: "Neutral" },
  { name: "Sage", colors: ["#2f3e46", "#52796f", "#84a98c", "#cad2c5", "#e0e4cc"], category: "Neutral" },
  
  // Warm
  { name: "Autumn", colors: ["#582f0e", "#7f4f24", "#936639", "#a68a64", "#b6ad90"], category: "Warm" },
  { name: "Terracotta", colors: ["#641220", "#6e1423", "#85182a", "#a11d33", "#c9184a"], category: "Warm" },
  { name: "Desert", colors: ["#e76f51", "#f4a261", "#e9c46a", "#e9d8a6", "#f7ede2"], category: "Warm" },
  
  // Cool
  { name: "Arctic", colors: ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"], category: "Cool" },
  { name: "Mint", colors: ["#074f57", "#0b8a99", "#13c2d9", "#88ddee", "#daf5f6"], category: "Cool" },
  { name: "Lavender", colors: ["#480ca8", "#560bad", "#7209b7", "#b5179e", "#f72585"], category: "Cool" },
];

type Props = {
  fabricCanvas: FabricCanvas;
};

const ThemeSelector = ({ fabricCanvas }: Props) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Creative");

  const categories = Array.from(new Set(colorPalettes.map(p => p.category)));

  const filteredPalettes = colorPalettes.filter(palette => {
    const matchesSearch = palette.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || palette.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const applyTheme = (palette: ColorPalette) => {
    // Set canvas background to first color
    fabricCanvas.backgroundColor = palette.colors[0];
    
    // Get all text objects
    const objects = fabricCanvas.getObjects();
    const textObjects = objects.filter(obj => 
      obj.type === "textbox" || obj.type === "i-text"
    ) as Textbox[];

    // Sort by font size to determine hierarchy
    const sortedTexts = [...textObjects].sort((a, b) => 
      (b.fontSize || 0) - (a.fontSize || 0)
    );

    // Apply theme based on text hierarchy
    sortedTexts.forEach((text, index) => {
      const fontSize = text.fontSize || 20;
      
      // Determine text type by font size
      if (fontSize >= 40) {
        // Heading - use brightest color, bold
        text.set({
          fill: palette.colors[4] || palette.colors[palette.colors.length - 1],
          fontWeight: "bold",
        });
      } else if (fontSize >= 28) {
        // Subheading - use secondary bright color, semi-bold
        text.set({
          fill: palette.colors[3] || palette.colors[palette.colors.length - 2],
          fontWeight: "600",
        });
      } else {
        // Body text - use readable color, normal weight
        text.set({
          fill: palette.colors[4] || palette.colors[palette.colors.length - 1],
          fontWeight: "normal",
        });
      }
    });

    fabricCanvas.renderAll();
    setOpen(false);
    toast.success(`Applied "${palette.name}" theme`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          Themes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Color Palettes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search color palettes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-3 gap-4">
              {filteredPalettes.map((palette, index) => (
                <button
                  key={index}
                  onClick={() => applyTheme(palette)}
                  className="flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-all hover:scale-105 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary"
                  title={`Click to apply ${palette.name}`}
                >
                  <div className="flex flex-col gap-0.5">
                    {palette.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="h-10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-center py-2 bg-muted">
                    {palette.name}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSelector;
