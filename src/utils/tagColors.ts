
// Map of tag names to tailwind colors
const TAG_COLORS: Record<string, string> = {
  // Default colors for common tags
  writing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  creative: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  storytelling: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  coding: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  development: "bg-green-100 text-green-800 hover:bg-green-200",
  review: "bg-teal-100 text-teal-800 hover:bg-teal-200",
  finance: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  investing: "bg-sky-100 text-sky-800 hover:bg-sky-200",
  planning: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  travel: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  vacation: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  cooking: "bg-red-100 text-red-800 hover:bg-red-200",
  food: "bg-rose-100 text-rose-800 hover:bg-rose-200",
  recipes: "bg-pink-100 text-pink-800 hover:bg-pink-200",
};

// Colors for tags not in the predefined list (rotated through)
const FALLBACK_COLORS = [
  "bg-gray-100 text-gray-800 hover:bg-gray-200",
  "bg-red-100 text-red-800 hover:bg-red-200",
  "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "bg-green-100 text-green-800 hover:bg-green-200",
  "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  "bg-purple-100 text-purple-800 hover:bg-purple-200",
  "bg-pink-100 text-pink-800 hover:bg-pink-200",
  "bg-rose-100 text-rose-800 hover:bg-rose-200",
  "bg-amber-100 text-amber-800 hover:bg-amber-200",
  "bg-lime-100 text-lime-800 hover:bg-lime-200",
  "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  "bg-teal-100 text-teal-800 hover:bg-teal-200",
  "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  "bg-sky-100 text-sky-800 hover:bg-sky-200",
  "bg-violet-100 text-violet-800 hover:bg-violet-200",
  "bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200",
];

let colorIndex = 0;

// Function to get color for a tag, either from predefined map or fallback colors
export function getTagColor(tag: string): string {
  if (tag in TAG_COLORS) {
    return TAG_COLORS[tag];
  }

  // For tags not in our predefined list, rotate through fallback colors
  const color = FALLBACK_COLORS[colorIndex % FALLBACK_COLORS.length];
  colorIndex++;
  
  return color;
}
