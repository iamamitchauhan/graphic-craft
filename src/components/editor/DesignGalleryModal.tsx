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

// Dummy templates for demonstration
const dummyTemplates: SavedDesign[] = [
  {
    id: "dummy-1",
    name: "Summer Sale Poster",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23fbbf24' width='400' height='400'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-size='48' font-weight='bold' fill='white'%3ESUMMER%3C/text%3E%3Ctext x='200' y='240' text-anchor='middle' font-size='64' font-weight='bold' fill='white'%3ESALE%3C/text%3E%3C/svg%3E",
    data: "",
    width: 1080,
    height: 1080,
    createdAt: Date.now() - 86400000,
  },
  {
    id: "dummy-2",
    name: "Instagram Story Template",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='711'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='400' height='711'/%3E%3Ctext x='200' y='300' text-anchor='middle' font-size='40' font-weight='bold' fill='white'%3EYour Story%3C/text%3E%3Ctext x='200' y='360' text-anchor='middle' font-size='40' font-weight='bold' fill='white'%3EStarts Here%3C/text%3E%3C/svg%3E",
    data: "",
    width: 1080,
    height: 1920,
    createdAt: Date.now() - 172800000,
  },
  {
    id: "dummy-3",
    name: "Facebook Event Cover",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='210'%3E%3Crect fill='%233b82f6' width='400' height='210'/%3E%3Ctext x='200' y='90' text-anchor='middle' font-size='36' font-weight='bold' fill='white'%3EJOIN US%3C/text%3E%3Ctext x='200' y='130' text-anchor='middle' font-size='24' fill='white'%3ESpecial Event%3C/text%3E%3C/svg%3E",
    data: "",
    width: 1200,
    height: 630,
    createdAt: Date.now() - 259200000,
  },
  {
    id: "dummy-4",
    name: "Motivational Quote",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2310b981;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23059669;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad2)' width='400' height='400'/%3E%3Ctext x='200' y='160' text-anchor='middle' font-size='28' font-weight='bold' fill='white'%3EBelieve in%3C/text%3E%3Ctext x='200' y='200' text-anchor='middle' font-size='32' font-weight='bold' fill='white'%3EYourself%3C/text%3E%3C/svg%3E",
    data: "",
    width: 1080,
    height: 1080,
    createdAt: Date.now() - 345600000,
  },
  {
    id: "dummy-5",
    name: "YouTube Thumbnail",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect fill='%23ef4444' width='400' height='225'/%3E%3Ctext x='200' y='100' text-anchor='middle' font-size='42' font-weight='bold' fill='white'%3EWATCH%3C/text%3E%3Ctext x='200' y='145' text-anchor='middle' font-size='42' font-weight='bold' fill='white'%3ENOW%3C/text%3E%3C/svg%3E",
    data: "",
    width: 1280,
    height: 720,
    createdAt: Date.now() - 432000000,
  },
  {
    id: "dummy-6",
    name: "Product Showcase",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f59e0b' width='400' height='400'/%3E%3Ccircle cx='200' cy='150' r='60' fill='white' opacity='0.9'/%3E%3Ctext x='200' y='260' text-anchor='middle' font-size='36' font-weight='bold' fill='white'%3ENEW%3C/text%3E%3Ctext x='200' y='300' text-anchor='middle' font-size='28' fill='white'%3EProduct%3C/text%3E%3C/svg%3E",
    data: "",
    width: 1080,
    height: 1080,
    createdAt: Date.now() - 518400000,
  },
  {
    id: "dummy-7",
    name: "LinkedIn Post",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='209'%3E%3Crect fill='%230a66c2' width='400' height='209'/%3E%3Ctext x='200' y='90' text-anchor='middle' font-size='32' font-weight='bold' fill='white'%3EProfessional%3C/text%3E%3Ctext x='200' y='130' text-anchor='middle' font-size='32' font-weight='bold' fill='white'%3EContent%3C/text%3E%3C/svg%3E",
    data: "",
    width: 1200,
    height: 627,
    createdAt: Date.now() - 604800000,
  },
  {
    id: "dummy-8",
    name: "Twitter Header",
    thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='75'%3E%3Crect fill='%231da1f2' width='400' height='75'/%3E%3Ctext x='200' y='50' text-anchor='middle' font-size='28' font-weight='bold' fill='white'%3EYour Brand%3C/text%3E%3C/svg%3E",
    data: "",
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
                <h3 className="text-lg font-semibold mb-4 text-foreground">Saved Designs</h3>
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
