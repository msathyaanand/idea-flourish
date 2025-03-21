
import { useState, useEffect } from "react";
import { X, Info, PlusCircle, Search, Heart, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Welcome to Prompt Library",
    description: "A place to discover, create, and share powerful AI prompts",
    icon: <Info className="h-8 w-8 text-primary" />,
  },
  {
    title: "Browse Prompts",
    description: "View and like prompts created by the community",
    icon: <Heart className="h-8 w-8 text-rose-500" />,
  },
  {
    title: "Create Prompts",
    description: "Add your own prompts to share with others",
    icon: <PlusCircle className="h-8 w-8 text-emerald-500" />,
  },
  {
    title: "Search & Filter",
    description: "Find prompts by keywords, tags, or creator",
    icon: <Search className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Explore Tags",
    description: "Discover prompts by topic using colorful tags",
    icon: <Tag className="h-8 w-8 text-amber-500" />,
  },
];

export const OnboardingTutorial = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Check if user has already seen the tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setOpen(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {steps[currentStep].title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center text-center py-6">
          <div className="mb-4 p-4 bg-primary/5 rounded-full">
            {steps[currentStep].icon}
          </div>
          <p className="text-muted-foreground mb-6">
            {steps[currentStep].description}
          </p>
          
          <div className="flex gap-2 mt-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handleClose}>
            Skip
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? "Next" : "Finish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
