
import { useState } from "react";
import { Heart, ChevronRight, Calendar, Code, Pencil, DollarSign, Map, Utensils, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { usePromptContext, Prompt } from "@/context/PromptContext";
import { cn } from "@/lib/utils";
import { getTagColor } from "@/utils/tagColors";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface PromptCardProps {
  prompt: Prompt;
  onView: (id: string) => void;
}

// Map of tag names to their respective icons
const tagIcons: Record<string, React.ReactNode> = {
  "coding": <Code size={12} />,
  "writing": <Pencil size={12} />,
  "finance": <DollarSign size={12} />,
  "travel": <Map size={12} />,
  "food": <Utensils size={12} />
};

export const PromptCard = ({ prompt, onView }: PromptCardProps) => {
  const { likePrompt, unlikePrompt, hasLiked, setActiveTag, getRelatedPrompts } = usePromptContext();
  const [isLiking, setIsLiking] = useState(false);
  const [showRelated, setShowRelated] = useState(false);
  
  const relatedPrompts = getRelatedPrompts(prompt.id, 2);
  
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
      className="group overflow-hidden border border-border/40 bg-white/60 backdrop-blur-md hover:shadow-lg hover:border-border/60 transition-all duration-300 ease-out flex flex-col"
    >
      <CardContent className="p-6 flex-grow">
        <div className="flex flex-col h-full">
          <div className="space-y-2 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 bg-primary/10">
                  <AvatarFallback className="text-xs text-primary">
                    {prompt.creator.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Badge 
                  variant="outline"
                  className="bg-primary/5 hover:bg-primary/10 transition-colors text-xs font-normal px-2 py-0.5"
                >
                  {prompt.creator}
                </Badge>
              </div>
              <div className="flex items-center text-muted-foreground text-xs">
                <Calendar size={12} className="mr-1" />
                {formattedDate}
              </div>
            </div>
            <h3 className="font-semibold text-xl tracking-tight leading-tight">{prompt.title}</h3>
          </div>
          
          <Separator className="my-3 bg-border/30" />
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {prompt.description}
          </p>
          
          <div className="mt-auto">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {prompt.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`text-xs font-normal cursor-pointer transition-colors ${getTagColor(tag)} flex items-center gap-1`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTag(tag);
                  }}
                >
                  {tagIcons[tag.toLowerCase()] || null}
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      {relatedPrompts.length > 0 && (
        <>
          <Separator className="bg-border/30" />
          <div className="px-6 py-2 bg-muted/20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowRelated(!showRelated);
              }}
              className="text-xs font-medium text-primary flex items-center w-full justify-between"
            >
              Explore Similar Prompts
              <ChevronRight 
                size={14} 
                className={`transition-transform ${showRelated ? 'rotate-90' : ''}`} 
              />
            </button>
            
            {showRelated && (
              <div className="mt-2 space-y-1.5 animate-fade-in">
                {relatedPrompts.map(related => (
                  <button
                    key={related.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(related.id);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 w-full text-left"
                  >
                    <ChevronRight size={12} className="text-primary/70" />
                    {related.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
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
