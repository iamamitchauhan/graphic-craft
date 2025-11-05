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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNew: () => void;
  onEditDesign: (design: SavedDesign) => void;
};

const DesignGalleryModal = ({ open, onOpenChange, onCreateNew, onEditDesign }: Props) => {
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>(() => {
    const saved = localStorage.getItem("posterCreatorDesigns");
    return saved ? JSON.parse(saved) : [];
  });

  const handleDeleteDesign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedDesigns.filter(d => d.id !== id);
    setSavedDesigns(updated);
    localStorage.setItem("posterCreatorDesigns", JSON.stringify(updated));
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
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
