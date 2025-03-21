
import { useState } from "react";
import { toast } from "sonner";
import { Redirect } from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  Edit, 
  BarChart3, 
  LogOut 
} from "lucide-react";
import { usePromptContext } from "@/context/PromptContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PromptForm } from "@/components/PromptForm";

const AdminPage = () => {
  const { prompts, deletePrompt, totalPrompts } = usePromptContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("adminAuthenticated") === "true";
  });
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<any>(null);

  // Handle admin login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check credentials
    if (username === "Sathya" && password === "saan@10") {
      // Set authenticated flag in localStorage
      localStorage.setItem("adminAuthenticated", "true");
      setIsAuthenticated(true);
      toast.success("Welcome to the admin panel");
    } else {
      toast.error("Invalid credentials");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  // Handle edit prompt
  const handleEditPrompt = (prompt: any) => {
    setEditingPrompt(prompt);
    setIsAddFormOpen(true);
  };

  // Handle delete prompt
  const handleDeletePrompt = (id: string) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      deletePrompt(id);
      toast.success("Prompt deleted successfully");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold">{totalPrompts}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={() => {
                  setEditingPrompt(null);
                  setIsAddFormOpen(true);
                }}
                className="w-full gap-2"
              >
                <Plus size={16} />
                Add New Prompt
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Manage Prompts</h2>
            <p className="mt-1 text-sm text-gray-500">Edit or delete existing prompts</p>
          </div>
          
          <Separator />
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Likes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prompts.map((prompt) => (
                  <tr key={prompt.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {prompt.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{prompt.creator}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{prompt.likes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(prompt.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPrompt(prompt)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <PromptForm 
        open={isAddFormOpen} 
        onOpenChange={setIsAddFormOpen}
        editingPrompt={editingPrompt}
      />
    </div>
  );
};

export default AdminPage;
