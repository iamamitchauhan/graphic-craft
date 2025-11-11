import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  onColorSelect: (color: string) => void;
};

const ColorPalettes = ({ onColorSelect }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Creative");

  const categories = Array.from(new Set(colorPalettes.map(p => p.category)));

  const filteredPalettes = colorPalettes.filter(palette => {
    const matchesSearch = palette.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || palette.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search color palettes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-9"
        />
      </div>

      <div className="flex gap-1 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="h-7 text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[300px] pr-3">
        <div className="grid grid-cols-4 gap-2">
          {filteredPalettes.map((palette, index) => (
            <div
              key={index}
              className="flex flex-col gap-0.5 cursor-pointer hover:opacity-80 transition-opacity"
              title={palette.name}
            >
              {palette.colors.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  onClick={() => onColorSelect(color)}
                  className="h-8 rounded-sm transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ColorPalettes;
