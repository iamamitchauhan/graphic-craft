import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Square, Circle, Triangle, Type, Image as ImageIcon, Minus, ArrowRight } from "lucide-react";
import { Canvas as FabricCanvas, Rect, Circle as FabricCircle, Triangle as FabricTriangle, IText, FabricImage, Line } from "fabric";
import { toast } from "sonner";

type Props = {
  fabricCanvas: FabricCanvas;
};

const Sidebar = ({ fabricCanvas }: Props) => {
  const addRectangle = () => {
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: "#3b82f6",
      width: 150,
      height: 100,
      cornerStyle: "circle",
      stroke: "#000000",
      strokeWidth: 2,
    });
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
    toast.success("Rectangle added");
  };

  const addCircle = () => {
    const circle = new FabricCircle({
      left: 100,
      top: 100,
      fill: "#10b981",
      radius: 75,
      cornerStyle: "circle",
      stroke: "#000000",
      strokeWidth: 2,
    });
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    fabricCanvas.renderAll();
    toast.success("Circle added");
  };

  const addTriangle = () => {
    const triangle = new FabricTriangle({
      left: 100,
      top: 100,
      fill: "#f59e0b",
      width: 150,
      height: 130,
      cornerStyle: "circle",
      stroke: "#000000",
      strokeWidth: 2,
    });
    fabricCanvas.add(triangle);
    fabricCanvas.setActiveObject(triangle);
    fabricCanvas.renderAll();
    toast.success("Triangle added");
  };

  const addLine = (type: "solid" | "dashed" | "arrow") => {
    const line = new Line([100, 100, 300, 100], {
      stroke: "#000000",
      strokeWidth: 3,
      cornerStyle: "circle",
    });

    if (type === "dashed") {
      line.strokeDashArray = [10, 5];
    } else if (type === "arrow") {
      line.strokeLineCap = "round";
      // Create arrow head using a triangle
      const arrowHead = new FabricTriangle({
        left: 300,
        top: 100,
        fill: "#000000",
        width: 15,
        height: 15,
        angle: 90,
        originX: "center",
        originY: "center",
      });
      fabricCanvas.add(arrowHead);
    }

    fabricCanvas.add(line);
    fabricCanvas.setActiveObject(line);
    fabricCanvas.renderAll();
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} line added`);
  };

  const addText = (preset: "heading" | "subheading" | "body") => {
    const configs = {
      heading: { text: "Heading", fontSize: 48, fontWeight: "bold" },
      subheading: { text: "Subheading", fontSize: 32, fontWeight: "600" },
      body: { text: "Body Text", fontSize: 20, fontWeight: "normal" },
    };

    const config = configs[preset];
    const text = new IText(config.text, {
      left: 100,
      top: 100,
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
      fill: "#000000",
      fontFamily: "Arial",
      editable: true,
      editingBorderColor: "#3b82f6",
    });
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
    
    // Defer entering edit mode until after render completes
    requestAnimationFrame(() => {
      text.enterEditing();
      text.selectAll();
      fabricCanvas.renderAll();
    });
    
    toast.success("Text added - start typing!");
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        const imgElement = new Image();
        imgElement.src = imgUrl;
        imgElement.onload = () => {
          const fabricImage = new FabricImage(imgElement, {
            left: 100,
            top: 100,
            cornerStyle: "circle",
          });
          
          // Scale image to fit nicely
          const maxWidth = (fabricCanvas.width || 800) * 0.4;
          const maxHeight = (fabricCanvas.height || 600) * 0.4;
          const scale = Math.min(maxWidth / imgElement.width, maxHeight / imgElement.height, 1);
          fabricImage.scale(scale);
          
          fabricCanvas.add(fabricImage);
          fabricCanvas.setActiveObject(fabricImage);
          fabricCanvas.renderAll();
          toast.success("Image added");
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const addSticker = (emoji: string) => {
    const sticker = new IText(emoji, {
      left: 100,
      top: 100,
      fontSize: 80,
      fontFamily: "Arial",
      editable: false,
    });
    fabricCanvas.add(sticker);
    fabricCanvas.setActiveObject(sticker);
    fabricCanvas.renderAll();
    toast.success("Sticker added");
  };

  const emojis = [
    // Smileys & People
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
    "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
    "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
    "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
    "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮",
    "🤧", "🥵", "🥶", "😶‍🌫️", "😵", "🤯", "🤠", "🥳", "😎", "🤓",
    "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺",
    "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣",
    "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈",
    "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾",
    // Gestures & Body Parts
    "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾",
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤏", "✌️", "🤞", "🤟",
    "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎",
    "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏",
    "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻",
    // Hearts & Symbols
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
    "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟",
    "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️",
    "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐",
    "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️", "📴", "📳",
    // Animals & Nature
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
    "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆",
    "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋",
    "🐌", "🐞", "🐜", "🦟", "🦗", "🕷️", "🦂", "🐢", "🐍", "🦎",
    "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟",
    "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧",
    // Food & Drink
    "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈",
    "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦",
    "🥬", "🥒", "🌶️", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐",
    "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇",
    "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🥪",
    "🥙", "🧆", "🌮", "🌯", "🥗", "🥘", "🍝", "🍜", "🍲", "🍛",
    "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠",
    "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂",
    "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯",
    "🥛", "🍼", "☕", "🍵", "🧃", "🥤", "🍶", "🍺", "🍻", "🥂",
    // Activities & Objects
    "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
    "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🪁",
    "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛷", "⛸️", "🥌",
    "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "🤺", "⛹️", "🤾",
    "🏌️", "🏇", "🧘", "🏊", "🚴", "🚵", "🎖️", "🏆", "🏅", "🥇",
    "🎃", "🎄", "🎆", "🎇", "🧨", "✨", "🎈", "🎉", "🎊", "🎋",
    "🎍", "🎎", "🎏", "🎐", "🎑", "🧧", "🎀", "🎁", "🎗️", "🎟️",
    "🎫", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷",
    // Travel & Places
    "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐",
    "🛻", "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵",
    "🏍️", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟",
    "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇",
    "🚊", "🚉", "✈️", "🛫", "🛬", "🛩️", "💺", "🛰️", "🚀", "🛸",
    "⭐", "🌟", "✨", "⚡", "☄️", "💥", "🔥", "🌈", "☀️", "🌤️",
    "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "☃️",
    "⛄", "🌬️", "💨", "💧", "💦", "☔", "☂️", "🌊", "🌫️", "🏔️",
  ];

  return (
    <aside className="w-64 bg-[hsl(var(--sidebar-bg))] border-r border-border p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Shapes Section */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Shapes</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={addRectangle} className="h-20 flex flex-col gap-2">
              <Square className="w-6 h-6" />
              <span className="text-xs">Rectangle</span>
            </Button>
            <Button variant="outline" onClick={addCircle} className="h-20 flex flex-col gap-2">
              <Circle className="w-6 h-6" />
              <span className="text-xs">Circle</span>
            </Button>
            <Button variant="outline" onClick={addTriangle} className="h-20 flex flex-col gap-2">
              <Triangle className="w-6 h-6" />
              <span className="text-xs">Triangle</span>
            </Button>
          </div>
        </div>

        {/* Lines Section */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Lines</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => addLine("solid")}
              className="w-full justify-start"
            >
              <Minus className="w-4 h-4 mr-2" />
              Solid Line
            </Button>
            <Button
              variant="outline"
              onClick={() => addLine("dashed")}
              className="w-full justify-start"
            >
              <Minus className="w-4 h-4 mr-2" strokeDasharray="4 2" />
              Dashed Line
            </Button>
            <Button
              variant="outline"
              onClick={() => addLine("arrow")}
              className="w-full justify-start"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Arrow Line
            </Button>
          </div>
        </div>

        {/* Stickers Section */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Stickers</h3>
          <div className="grid grid-cols-5 gap-1 max-h-64 overflow-y-auto p-1 bg-muted/20 rounded-md">
            {emojis.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => addSticker(emoji)}
                className="h-10 w-10 p-0 text-2xl hover:bg-muted"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>

        {/* Text Section */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Text</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => addText("heading")}
              className="w-full justify-start"
            >
              <Type className="w-4 h-4 mr-2" />
              Heading
            </Button>
            <Button
              variant="outline"
              onClick={() => addText("subheading")}
              className="w-full justify-start"
            >
              <Type className="w-4 h-4 mr-2" />
              Subheading
            </Button>
            <Button
              variant="outline"
              onClick={() => addText("body")}
              className="w-full justify-start"
            >
              <Type className="w-4 h-4 mr-2" />
              Body Text
            </Button>
          </div>
        </div>


        {/* Images Section */}
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Images</h3>
          <Card className="p-4">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2 text-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload</span>
              </div>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </Card>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
