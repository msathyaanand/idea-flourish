
import React, { createContext, useState, useContext, useEffect } from "react";

export type Tag = string;

export interface Prompt {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  creator: string;
  createdAt: Date;
  likes: number;
}

export type SortOption = "newest" | "oldest" | "most-liked" | "alphabetical";

interface PromptContextType {
  prompts: Prompt[];
  addPrompt: (prompt: Omit<Prompt, "id" | "createdAt" | "likes">) => void;
  deletePrompt: (id: string) => void;
  updatePrompt: (id: string, prompt: Partial<Omit<Prompt, "id" | "createdAt">>) => void;
  likePrompt: (id: string) => void;
  unlikePrompt: (id: string) => void;
  hasLiked: (id: string) => boolean;
  getPromptById: (id: string) => Prompt | undefined;
  getRelatedPrompts: (id: string, limit?: number) => Prompt[];
  filteredPrompts: Prompt[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
  activeCreator: string | null;
  setActiveCreator: (creator: string | null) => void;
  allTags: Tag[];
  allCreators: string[];
  totalPrompts: number;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const usePromptContext = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePromptContext must be used within a PromptProvider");
  }
  return context;
};

// Sample data
const initialPrompts: Prompt[] = [
  {
    id: "1",
    title: "Creative Writing Assistant",
    description: "I want you to act as a creative writing assistant. You will help me craft engaging and imaginative stories that captivate readers' attention. Please provide suggestions for plot development, character arcs, dialogue enhancement, and descriptive language that shows rather than tells.",
    tags: ["writing", "creative", "storytelling"],
    creator: "Alice Johnson",
    createdAt: new Date(2023, 4, 15),
    likes: 24,
  },
  {
    id: "2",
    title: "Code Reviewer",
    description: "Act as a senior software developer conducting a code review. I will provide you with code snippets, and I want you to review them for bugs, security issues, performance problems, and adherence to best practices. Please suggest improvements and explain the reasoning behind your recommendations.",
    tags: ["coding", "development", "review"],
    creator: "Bob Smith",
    createdAt: new Date(2023, 5, 20),
    likes: 18,
  },
  {
    id: "3",
    title: "Financial Advisor",
    description: "I want you to act as a financial advisor. Analyze my financial situation and goals to provide personalized advice on budgeting, investing, retirement planning, and risk management. Consider factors like income, expenses, debts, and time horizons to create a comprehensive strategy.",
    tags: ["finance", "investing", "planning"],
    creator: "Carol Davis",
    createdAt: new Date(2023, 6, 10),
    likes: 15,
  },
  {
    id: "4",
    title: "Travel Planner",
    description: "Act as a travel planner. I'll tell you where I want to go, and you'll create a detailed itinerary including attractions, accommodations, transportation, and dining recommendations. Consider local culture, weather, budget constraints, and personal interests to craft the perfect travel experience.",
    tags: ["travel", "planning", "vacation"],
    creator: "David Wilson",
    createdAt: new Date(2023, 7, 5),
    likes: 32,
  },
  {
    id: "5",
    title: "Recipe Creator",
    description: "I want you to act as a recipe creator. I'll describe dietary preferences, available ingredients, or cuisine interests, and you'll generate unique, detailed recipes with clear instructions. Include estimated preparation time, cooking time, serving size, nutritional information, and presentation tips.",
    tags: ["cooking", "food", "recipes"],
    creator: "Emma Brown",
    createdAt: new Date(2023, 8, 12),
    likes: 27,
  },
];

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prompts, setPrompts] = useState<Prompt[]>(() => {
    const savedPrompts = localStorage.getItem("prompts");
    if (savedPrompts) {
      try {
        // Parse the saved prompts and ensure dates are properly converted
        const parsedPrompts = JSON.parse(savedPrompts, (key, value) => {
          // Convert createdAt strings back to Date objects
          if (key === 'createdAt') {
            return new Date(value);
          }
          return value;
        });
        return parsedPrompts;
      } catch (error) {
        console.error("Error parsing saved prompts:", error);
        return initialPrompts;
      }
    }
    return initialPrompts;
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCreator, setActiveCreator] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [likedPrompts, setLikedPrompts] = useState<string[]>(() => {
    const saved = localStorage.getItem("likedPrompts");
    return saved ? JSON.parse(saved) : [];
  });

  // Save prompts to localStorage when they change
  useEffect(() => {
    localStorage.setItem("prompts", JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    localStorage.setItem("likedPrompts", JSON.stringify(likedPrompts));
  }, [likedPrompts]);

  const addPrompt = (promptData: Omit<Prompt, "id" | "createdAt" | "likes">) => {
    const newPrompt: Prompt = {
      ...promptData,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      likes: 0,
    };
    const updatedPrompts = [newPrompt, ...prompts];
    setPrompts(updatedPrompts);
  };

  const deletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter((prompt) => prompt.id !== id);
    setPrompts(updatedPrompts);
  };

  const updatePrompt = (id: string, promptData: Partial<Omit<Prompt, "id" | "createdAt">>) => {
    const updatedPrompts = prompts.map((prompt) =>
      prompt.id === id ? { ...prompt, ...promptData } : prompt
    );
    setPrompts(updatedPrompts);
  };

  const hasLiked = (id: string) => {
    return likedPrompts.includes(id);
  };

  const likePrompt = (id: string) => {
    // Check if already liked
    if (hasLiked(id)) return;
    
    // Add to liked prompts
    setLikedPrompts([...likedPrompts, id]);
    
    // Increment likes count
    setPrompts(
      prompts.map((prompt) =>
        prompt.id === id ? { ...prompt, likes: prompt.likes + 1 } : prompt
      )
    );
  };

  const unlikePrompt = (id: string) => {
    // Check if liked
    if (!hasLiked(id)) return;
    
    // Remove from liked prompts
    setLikedPrompts(likedPrompts.filter(promptId => promptId !== id));
    
    // Decrement likes count
    setPrompts(
      prompts.map((prompt) =>
        prompt.id === id ? { ...prompt, likes: Math.max(0, prompt.likes - 1) } : prompt
      )
    );
  };

  const getPromptById = (id: string) => {
    return prompts.find((prompt) => prompt.id === id);
  };

  // New function to get related prompts based on shared tags
  const getRelatedPrompts = (id: string, limit = 3): Prompt[] => {
    const currentPrompt = getPromptById(id);
    if (!currentPrompt) return [];

    // Find prompts that share tags with the current prompt
    return prompts
      .filter(p => 
        p.id !== id && // Not the same prompt
        p.tags.some(tag => currentPrompt.tags.includes(tag)) // Has at least one tag in common
      )
      .sort((a, b) => {
        // Count how many tags match
        const aMatchCount = a.tags.filter(tag => currentPrompt.tags.includes(tag)).length;
        const bMatchCount = b.tags.filter(tag => currentPrompt.tags.includes(tag)).length;
        
        // Sort by number of matching tags (descending)
        return bMatchCount - aMatchCount;
      })
      .slice(0, limit); // Limit to specified number
  };

  // Compute filtered prompts based on search, tag, and creator filters
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch = searchTerm === "" || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = activeTag === null || prompt.tags.includes(activeTag);
    
    const matchesCreator = activeCreator === null || 
      prompt.creator.toLowerCase() === activeCreator.toLowerCase();
    
    return matchesSearch && matchesTag && matchesCreator;
  }).sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "most-liked":
        return b.likes - a.likes;
      case "alphabetical":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Total number of prompts
  const totalPrompts = prompts.length;

  // Extract all unique tags and creators
  const allTags = Array.from(new Set(prompts.flatMap(prompt => prompt.tags)));
  const allCreators = Array.from(new Set(prompts.map(prompt => prompt.creator)));

  const value = {
    prompts,
    addPrompt,
    deletePrompt,
    updatePrompt,
    likePrompt,
    unlikePrompt,
    hasLiked,
    getPromptById,
    getRelatedPrompts,
    filteredPrompts,
    searchTerm,
    setSearchTerm,
    activeTag,
    setActiveTag,
    activeCreator,
    setActiveCreator,
    allTags,
    allCreators,
    totalPrompts,
    sortOption,
    setSortOption,
  };

  return <PromptContext.Provider value={value}>{children}</PromptContext.Provider>;
};
