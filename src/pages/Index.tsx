import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Palette, Sparkles, Share2, Zap } from "lucide-react";
import DesignGalleryModal from "@/components/editor/DesignGalleryModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Editor from "./Editor";

const Index = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Palette className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Poster Creator</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Design stunning posters for all your social media platforms. Professional tools, zero learning curve.
          </p>
        </header>

        {/* Hero CTA */}
        <div className="text-center mb-20">
          <Button
            size="lg"
            onClick={() => setIsGalleryOpen(true)}
            className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Create Design
          </Button>
        </div>

        {/* Design Gallery Modal */}
        <DesignGalleryModal
          open={isGalleryOpen}
          onOpenChange={setIsGalleryOpen}
          onCreateNew={() => {
            setIsGalleryOpen(false);
            setEditingDesign(null);
            setIsEditorOpen(true);
          }}
          onEditDesign={(design) => {
            setIsGalleryOpen(false);
            setEditingDesign(design);
            setIsEditorOpen(true);
          }}
        />

        {/* Editor Modal */}
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0" aria-describedby="editor-description">
            <span id="editor-description" className="sr-only">Design editor canvas</span>
            <Editor initialDesign={editingDesign} />
          </DialogContent>
        </Dialog>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Multi-Platform Ready</h3>
            <p className="text-muted-foreground">
              Pre-configured templates for Instagram, Facebook, Twitter, LinkedIn, and more.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Full Creative Control</h3>
            <p className="text-muted-foreground">
              Add text, shapes, images, and customize every element with intuitive tools.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Export Instantly</h3>
            <p className="text-muted-foreground">
              Download your designs as high-quality PNG or JPG files in seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
