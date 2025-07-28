import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/useTheme";
import { Settings, Sun, Moon, Trash2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  selectedModel: string;
  onModelChange: (model: string) => void;
  onOpenSettings: () => void;
  onClearChat: () => void;
  isConnected: boolean;
}

const AI_MODELS = [
  { id: "gemini-2.5-flash", name: "Google Gemini Flash (Free)", provider: "Google" },
  { id: "gemini-2.5-pro", name: "Google Gemini Pro (Free)", provider: "Google" },
  { id: "Qwen/Qwen2.5-7B-Instruct", name: "Qwen 2.5 7B (Free)", provider: "Hugging Face" },
  { id: "Qwen/Qwen2.5-14B-Instruct", name: "Qwen 2.5 14B (Free)", provider: "Hugging Face" },
];

export function ChatHeader({ 
  selectedModel, 
  onModelChange, 
  onOpenSettings, 
  onClearChat,
  isConnected 
}: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Zap className="text-white w-4 h-4" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          AI Chat Assistant
        </h1>
        <Badge variant={isConnected ? "default" : "secondary"} className="hidden sm:inline-flex">
          <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-3">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="hidden md:flex w-[200px]">
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            {AI_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-gray-500">{model.provider}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-300"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="text-gray-600 dark:text-gray-300"
        >
          <Settings className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearChat}
          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
