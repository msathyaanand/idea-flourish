
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePromptContext, Prompt } from "@/context/PromptContext";
import { toast } from "sonner";

interface PromptFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPrompt?: Prompt;
}

export const PromptForm = ({ open, onOpenChange, editingPrompt }: PromptFormProps) => {
  const { addPrompt, updatePrompt } = usePromptContext();
  
  const [title, setTitle] = useState(editingPrompt?.title || "");
  const [description, setDescription] = useState(editingPrompt?.description || "");
  const [creator, setCreator] = useState(editingPrompt?.creator || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(editingPrompt?.tags || []);
  
  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !creator.trim() || tags.length === 0) {
      toast.error("Please fill in all fields and add at least one tag");
      return;
    }
    
    if (editingPrompt) {
      updatePrompt(editingPrompt.id, {
        title,
        description,
        creator,
        tags,
      });
      toast.success("Prompt updated successfully");
    } else {
      addPrompt({
        title,
        description,
        creator,
        tags,
      });
      toast.success("Prompt added successfully");
    }
    
    // Reset form
    setTitle("");
    setDescription("");
    setCreator("");
    setTags([]);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass border-none shadow-xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            {editingPrompt ? "Edit Prompt" : "Add New Prompt"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Prompt</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full h-32 resize-none"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="creator">Creator Name</Label>
            <Input
              id="creator"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              placeholder="Your name"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag"
                className="w-full"
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Plus size={18} />
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 py-1 gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground transition-colors ml-1"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingPrompt ? "Update Prompt" : "Create Prompt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
