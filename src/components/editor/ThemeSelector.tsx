import { useState } from "react";
import { Canvas as FabricCanvas, Textbox } from "fabric";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Palette } from "lucide-react";
import { toast } from "sonner";

type ThemePalette = {
  name: string;
  category: string;
  background: string;
  heading: {
    color: string;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
  };
  subheading: {
    color: string;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
  };
  body: {
    color: string;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
  };
  colors: string[]; // For display purposes
};

const themePalettes: ThemePalette[] = [
  // Creative
  {
    name: "Ocean Depths",
    category: "Creative",
    background: "#1a1a2e",
    heading: { color: "#94b4d4", fontFamily: "Georgia", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#533483", fontFamily: "Georgia", fontWeight: "600", fontStyle: "italic" },
    body: { color: "#94b4d4", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#1a1a2e", "#16213e", "#0f3460", "#533483", "#94b4d4"]
  },
  {
    name: "Purple Dream",
    category: "Creative",
    background: "#3a0842",
    heading: { color: "#f4ecf7", fontFamily: "Impact", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#c39bd3", fontFamily: "Verdana", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#f4ecf7", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#3a0842", "#6b0f9f", "#8e44ad", "#c39bd3", "#f4ecf7"]
  },
  {
    name: "Sunset Vibes",
    category: "Creative",
    background: "#1a1a1a",
    heading: { color: "#ffd6ba", fontFamily: "Georgia", fontWeight: "bold", fontStyle: "italic" },
    subheading: { color: "#ffa07a", fontFamily: "Georgia", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#ffd6ba", fontFamily: "Verdana", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#1a1a1a", "#e74c3c", "#ff7f50", "#ffa07a", "#ffd6ba"]
  },
  
  // Fun
  {
    name: "Candy Pop",
    category: "Fun",
    background: "#5e60ce",
    heading: { color: "#ffafcc", fontFamily: "Comic Sans MS", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#c77dff", fontFamily: "Comic Sans MS", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#ffafcc", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#5e60ce", "#6f42c1", "#9d4edd", "#c77dff", "#ffafcc"]
  },
  {
    name: "Forest Night",
    category: "Fun",
    background: "#081c15",
    heading: { color: "#52b788", fontFamily: "Georgia", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#40916c", fontFamily: "Georgia", fontWeight: "600", fontStyle: "italic" },
    body: { color: "#52b788", fontFamily: "Verdana", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#081c15", "#1b4332", "#2d6a4f", "#40916c", "#52b788"]
  },
  {
    name: "Ruby Red",
    category: "Fun",
    background: "#0a0a0a",
    heading: { color: "#d00000", fontFamily: "Impact", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#9d0208", fontFamily: "Arial", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#d00000", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#0a0a0a", "#370617", "#6a040f", "#9d0208", "#d00000"]
  },
  
  // Lively
  {
    name: "Spring Fresh",
    category: "Lively",
    background: "#2d6a4f",
    heading: { color: "#b7e4c7", fontFamily: "Verdana", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#74c69d", fontFamily: "Verdana", fontWeight: "600", fontStyle: "italic" },
    body: { color: "#b7e4c7", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#b7e4c7"]
  },
  {
    name: "Peach Cream",
    category: "Lively",
    background: "#e85d04",
    heading: { color: "#ffd60a", fontFamily: "Georgia", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#ffba08", fontFamily: "Georgia", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#ffd60a", fontFamily: "Verdana", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#e85d04", "#f48c06", "#faa307", "#ffba08", "#ffd60a"]
  },
  {
    name: "Berry Blast",
    category: "Lively",
    background: "#ff006e",
    heading: { color: "#ffffff", fontFamily: "Impact", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#f72585", fontFamily: "Arial", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#ffffff", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#ff006e", "#fb5607", "#ff006e", "#d62828", "#f72585"]
  },
  
  // Colorful
  {
    name: "Rainbow",
    category: "Colorful",
    background: "#001219",
    heading: { color: "#e9d8a6", fontFamily: "Georgia", fontWeight: "bold", fontStyle: "italic" },
    subheading: { color: "#94d2bd", fontFamily: "Georgia", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#e9d8a6", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#001219", "#005f73", "#0a9396", "#94d2bd", "#e9d8a6"]
  },
  {
    name: "Golden Hour",
    category: "Colorful",
    background: "#780000",
    heading: { color: "#fdf0d5", fontFamily: "Times New Roman", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#f4a261", fontFamily: "Georgia", fontWeight: "600", fontStyle: "italic" },
    body: { color: "#fdf0d5", fontFamily: "Georgia", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#780000", "#c1121f", "#fdf0d5", "#f4a261", "#ee9b00"]
  },
  {
    name: "Tropical",
    category: "Colorful",
    background: "#007f5f",
    heading: { color: "#aacc00", fontFamily: "Verdana", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#80b918", fontFamily: "Verdana", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#aacc00", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#007f5f", "#2b9348", "#55a630", "#80b918", "#aacc00"]
  },
  
  // Bold
  {
    name: "Electric",
    category: "Bold",
    background: "#03045e",
    heading: { color: "#00b4d8", fontFamily: "Impact", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#0096c7", fontFamily: "Arial", fontWeight: "bold", fontStyle: "normal" },
    body: { color: "#00b4d8", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#03045e", "#023e8a", "#0077b6", "#0096c7", "#00b4d8"]
  },
  {
    name: "Fire",
    category: "Bold",
    background: "#370617",
    heading: { color: "#dc2f02", fontFamily: "Impact", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#d00000", fontFamily: "Arial", fontWeight: "bold", fontStyle: "italic" },
    body: { color: "#dc2f02", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#370617", "#6a040f", "#9d0208", "#d00000", "#dc2f02"]
  },
  {
    name: "Neon",
    category: "Bold",
    background: "#000000",
    heading: { color: "#ffbe0b", fontFamily: "Impact", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#ff006e", fontFamily: "Arial", fontWeight: "bold", fontStyle: "normal" },
    body: { color: "#3a86ff", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#ff006e", "#fb5607", "#ffbe0b", "#8338ec", "#3a86ff"]
  },
  
  // Neutral
  {
    name: "Minimal Gray",
    category: "Neutral",
    background: "#212529",
    heading: { color: "#dee2e6", fontFamily: "Arial", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#adb5bd", fontFamily: "Arial", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#dee2e6", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#212529", "#495057", "#6c757d", "#adb5bd", "#dee2e6"]
  },
  {
    name: "Earth Tones",
    category: "Neutral",
    background: "#3d3522",
    heading: { color: "#f3e5ab", fontFamily: "Georgia", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#c4a676", fontFamily: "Georgia", fontWeight: "600", fontStyle: "italic" },
    body: { color: "#f3e5ab", fontFamily: "Georgia", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#3d3522", "#755c48", "#9b826f", "#c4a676", "#f3e5ab"]
  },
  {
    name: "Sage",
    category: "Neutral",
    background: "#2f3e46",
    heading: { color: "#e0e4cc", fontFamily: "Verdana", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#cad2c5", fontFamily: "Verdana", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#e0e4cc", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#2f3e46", "#52796f", "#84a98c", "#cad2c5", "#e0e4cc"]
  },
  
  // Warm
  {
    name: "Autumn",
    category: "Warm",
    background: "#582f0e",
    heading: { color: "#b6ad90", fontFamily: "Georgia", fontWeight: "bold", fontStyle: "italic" },
    subheading: { color: "#a68a64", fontFamily: "Georgia", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#b6ad90", fontFamily: "Georgia", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#582f0e", "#7f4f24", "#936639", "#a68a64", "#b6ad90"]
  },
  {
    name: "Terracotta",
    category: "Warm",
    background: "#641220",
    heading: { color: "#c9184a", fontFamily: "Times New Roman", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#a11d33", fontFamily: "Georgia", fontWeight: "600", fontStyle: "italic" },
    body: { color: "#c9184a", fontFamily: "Georgia", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#641220", "#6e1423", "#85182a", "#a11d33", "#c9184a"]
  },
  {
    name: "Desert",
    category: "Warm",
    background: "#e76f51",
    heading: { color: "#f7ede2", fontFamily: "Verdana", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#e9d8a6", fontFamily: "Verdana", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#f7ede2", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#e76f51", "#f4a261", "#e9c46a", "#e9d8a6", "#f7ede2"]
  },
  
  // Cool
  {
    name: "Arctic",
    category: "Cool",
    background: "#03045e",
    heading: { color: "#caf0f8", fontFamily: "Arial", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#90e0ef", fontFamily: "Arial", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#caf0f8", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"]
  },
  {
    name: "Mint",
    category: "Cool",
    background: "#074f57",
    heading: { color: "#daf5f6", fontFamily: "Verdana", fontWeight: "bold", fontStyle: "normal" },
    subheading: { color: "#88ddee", fontFamily: "Verdana", fontWeight: "600", fontStyle: "italic" },
    body: { color: "#daf5f6", fontFamily: "Arial", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#074f57", "#0b8a99", "#13c2d9", "#88ddee", "#daf5f6"]
  },
  {
    name: "Lavender",
    category: "Cool",
    background: "#480ca8",
    heading: { color: "#f72585", fontFamily: "Georgia", fontWeight: "bold", fontStyle: "italic" },
    subheading: { color: "#b5179e", fontFamily: "Georgia", fontWeight: "600", fontStyle: "normal" },
    body: { color: "#f72585", fontFamily: "Verdana", fontWeight: "normal", fontStyle: "normal" },
    colors: ["#480ca8", "#560bad", "#7209b7", "#b5179e", "#f72585"]
  },
];

type Props = {
  fabricCanvas: FabricCanvas;
};

const ThemeSelector = ({ fabricCanvas }: Props) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Creative");

  const categories = Array.from(new Set(themePalettes.map(p => p.category)));

  const filteredPalettes = themePalettes.filter(palette => {
    const matchesSearch = palette.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || palette.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const applyTheme = (theme: ThemePalette) => {
    // Set canvas background
    fabricCanvas.backgroundColor = theme.background;
    
    // Get all text objects
    const objects = fabricCanvas.getObjects();
    const textObjects = objects.filter(obj => 
      obj.type === "textbox" || obj.type === "i-text"
    ) as Textbox[];

    // Apply theme based on text hierarchy by font size
    textObjects.forEach((text) => {
      const fontSize = text.fontSize || 20;
      
      // Determine text type by font size and apply comprehensive styling
      if (fontSize >= 40) {
        // Heading
        text.set({
          fill: theme.heading.color,
          fontFamily: theme.heading.fontFamily,
          fontWeight: theme.heading.fontWeight,
          fontStyle: theme.heading.fontStyle,
        });
      } else if (fontSize >= 28) {
        // Subheading
        text.set({
          fill: theme.subheading.color,
          fontFamily: theme.subheading.fontFamily,
          fontWeight: theme.subheading.fontWeight,
          fontStyle: theme.subheading.fontStyle,
        });
      } else {
        // Body text
        text.set({
          fill: theme.body.color,
          fontFamily: theme.body.fontFamily,
          fontWeight: theme.body.fontWeight,
          fontStyle: theme.body.fontStyle,
        });
      }
    });

    fabricCanvas.renderAll();
    setOpen(false);
    toast.success(`Applied "${theme.name}" theme with fonts & styles`);
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
              {filteredPalettes.map((theme, index) => (
                <button
                  key={index}
                  onClick={() => applyTheme(theme)}
                  className="flex flex-col gap-0.5 cursor-pointer hover:opacity-80 transition-all hover:scale-105 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary"
                  title={`${theme.name} - Fonts: ${theme.heading.fontFamily}, ${theme.subheading.fontFamily}`}
                >
                  <div className="flex flex-col gap-0.5">
                    {theme.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="h-10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-center py-2 bg-muted space-y-0.5">
                    <p className="font-medium">{theme.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate px-1">
                      {theme.heading.fontFamily} • {theme.heading.fontStyle}
                    </p>
                  </div>
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
