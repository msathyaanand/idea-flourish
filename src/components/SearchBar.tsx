
import { useState } from "react";
import { Search, X, Tag, User, SortAsc, SortDesc } from "lucide-react";
import { usePromptContext, SortOption } from "@/context/PromptContext";
import { Badge } from "@/components/ui/badge";
import { getTagColor } from "@/utils/tagColors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SearchBar = () => {
  const { 
    setSearchTerm, 
    activeTag, 
    setActiveTag, 
    activeCreator, 
    setActiveCreator,
    allTags,
    allCreators,
    totalPrompts,
    filteredPrompts,
    sortOption,
    setSortOption
  } = usePromptContext();
  
  const [inputValue, setInputValue] = useState("");
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isCreatorsOpen, setIsCreatorsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputValue);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setInputValue("");
    setActiveTag(null);
    setActiveCreator(null);
  };

  const hasActiveFilters = inputValue !== "" || activeTag !== null || activeCreator !== null;

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Liked", value: "most-liked" },
    { label: "Alphabetical", value: "alphabetical" },
  ];

  const getSortOptionLabel = () => {
    return sortOptions.find(option => option.value === sortOption)?.label || "Sort by";
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredPrompts.length}</span> of <span className="font-medium text-foreground">{totalPrompts}</span> prompts
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-border bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all">
              {sortOption === "newest" || sortOption === "alphabetical" ? (
                <SortDesc size={14} />
              ) : (
                <SortAsc size={14} />
              )}
              <span>{getSortOptionLabel()}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={sortOption === option.value ? "bg-primary/10 font-medium" : ""}
                onClick={() => setSortOption(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search prompts..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full border border-border bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                setSearchTerm("");
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3 items-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsTagsOpen(!isTagsOpen);
                setIsCreatorsOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-border bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all"
            >
              <Tag size={14} />
              <span>{activeTag || "Tags"}</span>
            </button>
            
            {isTagsOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 p-2 rounded-lg glass shadow-lg animate-fade-in z-10">
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={activeTag === tag ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        activeTag !== tag ? getTagColor(tag) : ""
                      }`}
                      onClick={(e) => {
                        setActiveTag(activeTag === tag ? null : tag);
                        setIsTagsOpen(false);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsCreatorsOpen(!isCreatorsOpen);
                setIsTagsOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-border bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all"
            >
              <User size={14} />
              <span>{activeCreator || "Creator"}</span>
            </button>
            
            {isCreatorsOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 p-2 rounded-lg glass shadow-lg animate-fade-in z-10">
                <div className="max-h-48 overflow-y-auto">
                  {allCreators.map((creator) => (
                    <div
                      key={creator}
                      className={`px-2 py-1.5 text-sm rounded cursor-pointer transition-colors ${
                        activeCreator === creator 
                          ? "bg-primary text-white" 
                          : "hover:bg-secondary"
                      }`}
                      onClick={() => {
                        setActiveCreator(activeCreator === creator ? null : creator);
                        setIsCreatorsOpen(false);
                      }}
                    >
                      {creator}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
