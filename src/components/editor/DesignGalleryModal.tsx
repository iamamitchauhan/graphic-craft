import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileImage, Trash2 } from "lucide-react";
import { toast } from "sonner";

type SavedDesign = {
  id: string;
  name: string;
  thumbnail: string;
  data: string;
  width: number;
  height: number;
  createdAt: number;
};

// Predefined templates with real design data
const dummyTemplates: SavedDesign[] = [
  {
    id: "dummy-1",
    name: "Bold Typography",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23000000' width='400' height='400'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-size='56' font-weight='bold' fill='%23ffffff' font-family='Arial'%3EMAKE IT%3C/text%3E%3Ctext x='200' y='250' text-anchor='middle' font-size='56' font-weight='bold' fill='%23fbbf24' font-family='Arial'%3EHAPPEN%3C/text%3E%3C/svg%3E",
    data: JSON.stringify({
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          version: "6.0.0",
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: "#000000",
          selectable: false,
          evented: false
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 540,
          top: 400,
          width: 800,
          fontSize: 120,
          text: "MAKE IT",
          fill: "#ffffff",
          fontFamily: "Arial",
          fontWeight: "bold",
          textAlign: "center",
          originX: "center",
          originY: "center"
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 540,
          top: 550,
          width: 800,
          fontSize: 120,
          text: "HAPPEN",
          fill: "#fbbf24",
          fontFamily: "Arial",
          fontWeight: "bold",
          textAlign: "center",
          originX: "center",
          originY: "center"
        }
      ],
      background: "#000000"
    }),
    width: 1080,
    height: 1080,
    createdAt: Date.now() - 86400000,
  },
  {
    id: "dummy-2",
    name: "Gradient Dream",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='711'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='400' height='711'/%3E%3Ctext x='200' y='320' text-anchor='middle' font-size='40' font-weight='300' fill='white' font-family='Georgia'%3EYour Story%3C/text%3E%3Ctext x='200' y='380' text-anchor='middle' font-size='48' font-weight='bold' fill='white' font-family='Georgia'%3EStarts Here%3C/text%3E%3C/svg%3E",
    data: JSON.stringify({
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          version: "6.0.0",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          fill: "#667eea",
          selectable: false,
          evented: false
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 540,
          top: 800,
          width: 900,
          fontSize: 80,
          text: "Your Story",
          fill: "#ffffff",
          fontFamily: "Georgia",
          fontWeight: "300",
          textAlign: "center",
          originX: "center",
          originY: "center"
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 540,
          top: 920,
          width: 900,
          fontSize: 96,
          text: "Starts Here",
          fill: "#ffffff",
          fontFamily: "Georgia",
          fontWeight: "bold",
          textAlign: "center",
          originX: "center",
          originY: "center"
        }
      ],
      background: "#667eea"
    }),
    width: 1080,
    height: 1920,
    createdAt: Date.now() - 172800000,
  },
  {
    id: "dummy-3",
    name: "Minimalist Blue",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='210'%3E%3Crect fill='%233b82f6' width='400' height='210'/%3E%3Ctext x='200' y='90' text-anchor='middle' font-size='42' font-weight='300' fill='white' font-family='Helvetica'%3ESimple%3C/text%3E%3Ctext x='200' y='140' text-anchor='middle' font-size='36' font-weight='bold' fill='white' font-family='Helvetica'%3E%26 Elegant%3C/text%3E%3C/svg%3E",
    data: JSON.stringify({
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          version: "6.0.0",
          left: 0,
          top: 0,
          width: 1200,
          height: 630,
          fill: "#3b82f6",
          selectable: false,
          evented: false
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 600,
          top: 240,
          width: 1000,
          fontSize: 100,
          text: "Simple",
          fill: "#ffffff",
          fontFamily: "Helvetica",
          fontWeight: "300",
          textAlign: "center",
          originX: "center",
          originY: "center"
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 600,
          top: 370,
          width: 1000,
          fontSize: 80,
          text: "& Elegant",
          fill: "#ffffff",
          fontFamily: "Helvetica",
          fontWeight: "bold",
          textAlign: "center",
          originX: "center",
          originY: "center"
        }
      ],
      background: "#3b82f6"
    }),
    width: 1200,
    height: 630,
    createdAt: Date.now() - 259200000,
  },
  {
    id: "dummy-4",
    name: "Green Energy",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23059669;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad2)' width='400' height='400'/%3E%3Ctext x='200' y='160' text-anchor='middle' font-size='32' fill='white' font-family='Verdana'%3EBelieve in%3C/text%3E%3Ctext x='200' y='220' text-anchor='middle' font-size='64' font-weight='bold' fill='white' font-family='Verdana'%3EYourself%3C/text%3E%3C/svg%3E",
    data: JSON.stringify({
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          version: "6.0.0",
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: "#10b981",
          selectable: false,
          evented: false
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 540,
          top: 420,
          width: 900,
          fontSize: 70,
          text: "Believe in",
          fill: "#ffffff",
          fontFamily: "Verdana",
          fontWeight: "normal",
          textAlign: "center",
          originX: "center",
          originY: "center"
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 540,
          top: 560,
          width: 900,
          fontSize: 130,
          text: "Yourself",
          fill: "#ffffff",
          fontFamily: "Verdana",
          fontWeight: "bold",
          textAlign: "center",
          originX: "center",
          originY: "center"
        }
      ],
      background: "#10b981"
    }),
    width: 1080,
    height: 1080,
    createdAt: Date.now() - 345600000,
  },
  {
    id: "dummy-5",
    name: "Red Alert",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect fill='%23ef4444' width='400' height='225'/%3E%3Ctext x='200' y='100' text-anchor='middle' font-size='52' font-weight='bold' fill='white' font-family='Impact'%3EWATCH%3C/text%3E%3Ctext x='200' y='155' text-anchor='middle' font-size='52' font-weight='bold' fill='%23fef3c7' font-family='Impact'%3ENOW%3C/text%3E%3C/svg%3E",
    data: JSON.stringify({
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          version: "6.0.0",
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          fill: "#ef4444",
          selectable: false,
          evented: false
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 640,
          top: 280,
          width: 1100,
          fontSize: 140,
          text: "WATCH",
          fill: "#ffffff",
          fontFamily: "Impact",
          fontWeight: "bold",
          textAlign: "center",
          originX: "center",
          originY: "center"
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 640,
          top: 450,
          width: 1100,
          fontSize: 140,
          text: "NOW",
          fill: "#fef3c7",
          fontFamily: "Impact",
          fontWeight: "bold",
          textAlign: "center",
          originX: "center",
          originY: "center"
        }
      ],
      background: "#ef4444"
    }),
    width: 1280,
    height: 720,
    createdAt: Date.now() - 432000000,
  },
  {
    id: "dummy-6",
    name: "Orange Pop",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f59e0b' width='400' height='400'/%3E%3Ctext x='200' y='160' text-anchor='middle' font-size='72' font-weight='bold' fill='white' font-family='Arial'%3ENEW%3C/text%3E%3Ctext x='200' y='240' text-anchor='middle' font-size='48' fill='%23000000' font-family='Arial'%3EProduct Launch%3C/text%3E%3C/svg%3E",
    data: JSON.stringify({
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          version: "6.0.0",
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: "#f59e0b",
          selectable: false,
          evented: false
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 540,
          top: 420,
          width: 900,
          fontSize: 150,
          text: "NEW",
          fill: "#ffffff",
          fontFamily: "Arial",
          fontWeight: "bold",
          textAlign: "center",
          originX: "center",
          originY: "center"
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 540,
          top: 600,
          width: 900,
          fontSize: 90,
          text: "Product Launch",
          fill: "#000000",
          fontFamily: "Arial",
          fontWeight: "normal",
          textAlign: "center",
          originX: "center",
          originY: "center"
        }
      ],
      background: "#f59e0b"
    }),
    width: 1080,
    height: 1080,
    createdAt: Date.now() - 518400000,
  },
  {
    id: "dummy-7",
    name: "Professional Navy",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='209'%3E%3Crect fill='%230a66c2' width='400' height='209'/%3E%3Ctext x='200' y='90' text-anchor='middle' font-size='36' font-weight='300' fill='white' font-family='Times New Roman'%3EProfessional%3C/text%3E%3Ctext x='200' y='135' text-anchor='middle' font-size='40' font-weight='bold' fill='%23fbbf24' font-family='Times New Roman'%3EContent%3C/text%3E%3C/svg%3E",
    data: JSON.stringify({
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          version: "6.0.0",
          left: 0,
          top: 0,
          width: 1200,
          height: 627,
          fill: "#0a66c2",
          selectable: false,
          evented: false
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 600,
          top: 240,
          width: 1000,
          fontSize: 80,
          text: "Professional",
          fill: "#ffffff",
          fontFamily: "Times New Roman",
          fontWeight: "300",
          textAlign: "center",
          originX: "center",
          originY: "center"
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 600,
          top: 360,
          width: 1000,
          fontSize: 90,
          text: "Content",
          fill: "#fbbf24",
          fontFamily: "Times New Roman",
          fontWeight: "bold",
          textAlign: "center",
          originX: "center",
          originY: "center"
        }
      ],
      background: "#0a66c2"
    }),
    width: 1200,
    height: 627,
    createdAt: Date.now() - 604800000,
  },
  {
    id: "dummy-8",
    name: "Sky Blue Header",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect fill='%231da1f2' width='400' height='225'/%3E%3Ctext x='200' y='100' text-anchor='middle' font-size='48' font-weight='bold' fill='white' font-family='Courier New'%3EYour Brand%3C/text%3E%3Ctext x='200' y='145' text-anchor='middle' font-size='28' fill='%23ffffff' font-family='Courier New'%3EMaking waves%3C/text%3E%3C/svg%3E",
    data: JSON.stringify({
      version: "6.0.0",
      objects: [
        {
          type: "rect",
          version: "6.0.0",
          left: 0,
          top: 0,
          width: 1600,
          height: 900,
          fill: "#1da1f2",
          selectable: false,
          evented: false
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 800,
          top: 360,
          width: 1400,
          fontSize: 120,
          text: "Your Brand",
          fill: "#ffffff",
          fontFamily: "Courier New",
          fontWeight: "bold",
          textAlign: "center",
          originX: "center",
          originY: "center"
        },
        {
          type: "textbox",
          version: "6.0.0",
          left: 800,
          top: 510,
          width: 1400,
          fontSize: 70,
          text: "Making waves",
          fill: "#ffffff",
          fontFamily: "Courier New",
          fontWeight: "normal",
          textAlign: "center",
          originX: "center",
          originY: "center"
        }
      ],
      background: "#1da1f2"
    }),
    width: 1600,
    height: 900,
    createdAt: Date.now() - 691200000,
  },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNew: () => void;
  onEditDesign: (design: SavedDesign) => void;
};

const DesignGalleryModal = ({ open, onOpenChange, onCreateNew, onEditDesign }: Props) => {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>(() => {
    const saved = localStorage.getItem("posterCreatorDesigns");
    const userDesigns = saved ? JSON.parse(saved) : [];
    // Combine dummy templates with user designs
    return [...dummyTemplates, ...userDesigns];
  });

  const handleDeleteDesign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Prevent deletion of dummy templates
    if (id.startsWith("dummy-")) {
      toast.error("Cannot delete demo templates");
      return;
    }
    
    const updated = savedDesigns.filter(d => d.id !== id);
    const userDesigns = updated.filter(d => !d.id.startsWith("dummy-"));
    setSavedDesigns(updated);
    localStorage.setItem("posterCreatorDesigns", JSON.stringify(userDesigns));
    toast.success("Design deleted");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your Designs</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Button */}
          <Card 
            className="p-8 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 border-dashed border-primary/50 hover:border-primary bg-primary/5"
            onClick={onCreateNew}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-foreground mb-1">Create New Template</h3>
                <p className="text-sm text-muted-foreground">Start designing from scratch</p>
              </div>
            </div>
          </Card>

          {/* Saved Designs Grid */}
          {savedDesigns.length > 0 ? (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Choose Template</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {savedDesigns.map((design) => (
                    <Card
                      key={design.id}
                      className="group cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 hover:border-primary overflow-hidden"
                      onClick={() => onEditDesign(design)}
                    >
                      <div className="relative aspect-square bg-muted">
                        {design.thumbnail ? (
                          <img 
                            src={design.thumbnail} 
                            alt={design.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileImage className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        <Button
                          variant="destructive"
                          size="icon"
                          className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                            design.id.startsWith("dummy-") ? "hidden" : ""
                          }`}
                          onClick={(e) => handleDeleteDesign(design.id, e)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm text-card-foreground truncate">{design.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {design.width} × {design.height}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FileImage className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No saved designs yet. Create your first one!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesignGalleryModal;
