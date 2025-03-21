
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { PromptCard } from "@/components/PromptCard";
import { PromptForm } from "@/components/PromptForm";
import { PromptDetail } from "@/components/PromptDetail";
import { PromptProvider, usePromptContext } from "@/context/PromptContext";

const PromptLibrary = () => {
  const { filteredPrompts } = usePromptContext();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const handleViewPrompt = (id: string) => {
    setSelectedPromptId(id);
    setIsDetailOpen(true);
  };
  
  return (
    <div className="min-h-screen w-full">
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-semibold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
            Prompt Library
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Discover, create, and share powerful prompts to enhance your AI interactions
          </p>
          
          <Button 
            onClick={() => setIsAddFormOpen(true)}
            size="lg" 
            className="rounded-full px-6 gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircle size={18} />
            <span>Add New Prompt</span>
          </Button>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <SearchBar />
        
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No prompts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters, or add a new prompt.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onView={handleViewPrompt}
              />
            ))}
          </div>
        )}
      </main>
      
      <PromptForm 
        open={isAddFormOpen} 
        onOpenChange={setIsAddFormOpen} 
      />
      
      <PromptDetail
        promptId={selectedPromptId}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};

const Index = () => {
  return (
    <PromptProvider>
      <PromptLibrary />
    </PromptProvider>
  );
};

export default Index;
