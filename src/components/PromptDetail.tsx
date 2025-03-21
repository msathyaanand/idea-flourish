
import { Heart, Copy, CheckCheck, Calendar, User, Tag as TagIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePromptContext, Prompt } from "@/context/PromptContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PromptDetailProps {
  promptId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PromptDetail = ({ promptId, open, onOpenChange }: PromptDetailProps) => {
  const { getPromptById, likePrompt, setActiveTag } = usePromptContext();
  const [copied, setCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  
  const prompt = promptId ? getPromptById(promptId) : null;
  
  if (!prompt) {
    return null;
  }
  
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.description);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleLike = () => {
    if (isLiking) return;
    
    setIsLiking(true);
    likePrompt(prompt.id);
    
    setTimeout(() => {
      setIsLiking(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none glass animate-scale-in">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <Badge 
              variant="outline" 
              className="bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              {prompt.creator}
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar size={14} className="mr-1.5" />
              {formattedDate}
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold tracking-tight mb-4">{prompt.title}</h2>
          
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{prompt.description}</p>
          </div>
          
          <div className="mt-6 flex items-center flex-wrap gap-2">
            <div className="flex items-center">
              <TagIcon size={16} className="mr-2 text-muted-foreground" />
            </div>
            {prompt.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => {
                  setActiveTag(tag);
                  onOpenChange(false);
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="mt-6 flex items-center">
            <div className="flex items-center">
              <User size={16} className="mr-2 text-muted-foreground" />
              <span className="text-sm">Created by</span>
            </div>
            <span className="ml-2 font-medium">{prompt.creator}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-4 flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={handleLike}
            >
              <Heart
                size={18}
                className={cn(
                  "transition-all",
                  isLiking && "scale-125 fill-rose-500 text-rose-500"
                )}
              />
              <span>{prompt.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={handleCopy}
            >
              {copied ? <CheckCheck size={18} className="text-green-500" /> : <Copy size={18} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
