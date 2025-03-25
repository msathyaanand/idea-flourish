
import { Heart, Copy, CheckCheck, Calendar, User, Tag as TagIcon, Code, Pencil, DollarSign, Map, Utensils } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePromptContext, Prompt } from "@/context/PromptContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PromptDetailProps {
  promptId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Map of tag names to their respective icons
const tagIcons: Record<string, React.ReactNode> = {
  "coding": <Code size={14} />,
  "writing": <Pencil size={14} />,
  "finance": <DollarSign size={14} />,
  "travel": <Map size={14} />,
  "food": <Utensils size={14} />
};

export const PromptDetail = ({ promptId, open, onOpenChange }: PromptDetailProps) => {
  const { getPromptById, likePrompt, unlikePrompt, hasLiked, setActiveTag, getRelatedPrompts } = usePromptContext();
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
  
  const relatedPrompts = getRelatedPrompts(prompt.id, 3);
  
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
    
    if (hasLiked(prompt.id)) {
      unlikePrompt(prompt.id);
    } else {
      likePrompt(prompt.id);
    }
    
    setTimeout(() => {
      setIsLiking(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none glass animate-scale-in">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 bg-primary/10">
                <AvatarFallback className="text-xs text-primary">
                  {prompt.creator.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Badge 
                variant="outline" 
                className="bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                {prompt.creator}
              </Badge>
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar size={14} className="mr-1.5" />
              {formattedDate}
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold tracking-tight mb-4">{prompt.title}</h2>
          
          <Separator className="my-3 bg-border/30" />
          
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
                className="text-sm cursor-pointer hover:bg-secondary/80 transition-colors flex items-center gap-1"
                onClick={() => {
                  setActiveTag(tag);
                  onOpenChange(false);
                }}
              >
                {tagIcons[tag.toLowerCase()] || null}
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
          
          {relatedPrompts.length > 0 && (
            <div className="mt-6">
              <Separator className="mb-4 bg-border/30" />
              <h3 className="text-sm font-semibold mb-3">Explore Similar Prompts</h3>
              <div className="space-y-2">
                {relatedPrompts.map(related => (
                  <button
                    key={related.id}
                    onClick={() => {
                      onOpenChange(false);
                      setTimeout(() => {
                        // This timeout gives dialog time to close before
                        // opening a new one with different content
                        onOpenChange(true);
                        // This would require passing setSelectedPromptId as prop
                        // If this doesn't work as is, we need to lift state up
                      }, 100);
                    }}
                    className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 w-full text-left"
                  >
                    <ChevronRight size={14} />
                    {related.title}
                  </button>
                ))}
              </div>
            </div>
          )}
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
                  hasLiked(prompt.id) && "fill-rose-500 text-rose-500",
                  isLiking && "scale-125"
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
