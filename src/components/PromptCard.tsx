
import { useState } from "react";
import { Heart, ChevronRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { usePromptContext, Prompt } from "@/context/PromptContext";
import { cn } from "@/lib/utils";
import { getTagColor } from "@/utils/tagColors";

interface PromptCardProps {
  prompt: Prompt;
  onView: (id: string) => void;
}

export const PromptCard = ({ prompt, onView }: PromptCardProps) => {
  const { likePrompt, unlikePrompt, hasLiked, setActiveTag } = usePromptContext();
  const [isLiking, setIsLiking] = useState(false);
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isLiking) return;
    
    setIsLiking(true);
    
    if (hasLiked(prompt.id)) {
      unlikePrompt(prompt.id);
    } else {
      likePrompt(prompt.id);
    }
    
    // Add animation timeout
    setTimeout(() => {
      setIsLiking(false);
    }, 500);
  };
  
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card
      className="group overflow-hidden border border-border/40 bg-white/60 backdrop-blur-md hover:shadow-lg hover:border-border/60 transition-all duration-300 ease-out"
    >
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="space-y-2 mb-4">
            <div className="flex items-start justify-between">
              <Badge 
                variant="outline"
                className="bg-primary/5 hover:bg-primary/10 transition-colors text-xs font-normal px-2 py-0.5"
              >
                {prompt.creator}
              </Badge>
              <div className="flex items-center text-muted-foreground text-xs">
                <Calendar size={12} className="mr-1" />
                {formattedDate}
              </div>
            </div>
            <h3 className="font-semibold text-xl tracking-tight leading-tight">{prompt.title}</h3>
          </div>
          
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1.5 mb-4">
              {prompt.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`text-xs font-normal cursor-pointer transition-colors ${getTagColor(tag)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTag(tag);
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 border-t border-border/50 bg-secondary/30 flex items-center justify-between">
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-rose-500 transition-colors group"
        >
          <Heart
            size={18}
            className={cn(
              "transition-all",
              hasLiked(prompt.id) && "fill-rose-500 text-rose-500",
              isLiking && "scale-125",
              !isLiking && "group-hover:scale-110"
            )}
          />
          <span className="text-sm">{prompt.likes}</span>
        </button>
        
        <button
          onClick={() => onView(prompt.id)}
          className="flex items-center gap-1 text-sm text-primary font-medium transition-colors hover:text-primary/80"
        >
          View Prompt
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </CardFooter>
    </Card>
  );
};
