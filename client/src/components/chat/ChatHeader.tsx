import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/useTheme";
import { Settings, Sun, Moon, Trash2, Zap, Sparkles, Bot, MessageSquare, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Props {
  selectedModel: string;
  onModelChange: (model: string) => void;
  onOpenSettings: () => void;
  onClearChat: () => void;
  isConnected: boolean;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  icon: any;
  description: string;
  badge?: string;
}

const AI_MODELS: AIModel[] = [
  { 
    id: "gemini-2.5-flash", 
    name: "Gemini Flash", 
    provider: "Google", 
    icon: Sparkles,
    description: "Fast and efficient AI responses",
    badge: "FREE"
  },
  { 
    id: "gemini-2.5-pro", 
    name: "Gemini Pro", 
    provider: "Google", 
    icon: Zap,
    description: "Advanced reasoning and analysis",
    badge: "FREE"
  },
  { 
    id: "Qwen/Qwen2.5-7B-Instruct", 
    name: "Qwen 2.5 7B", 
    provider: "Hugging Face", 
    icon: Bot,
    description: "Open-source multilingual model",
    badge: "FREE"
  },
  { 
    id: "Qwen/Qwen2.5-14B-Instruct", 
    name: "Qwen 2.5 14B", 
    provider: "Hugging Face", 
    icon: Bot,
    description: "Larger open-source model",
    badge: "FREE"
  },
];

export function ChatHeader({ 
  selectedModel, 
  onModelChange, 
  onOpenSettings, 
  onClearChat,
  isConnected 
}: Props) {
  const { theme, toggleTheme } = useTheme();
  const currentModel = AI_MODELS.find(model => model.id === selectedModel);

  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-3 shadow-lg header-gradient-border">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg logo-glow">
                <MessageSquare className="text-white w-5 h-5" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="text-white w-2 h-2" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                AI Chat Assistant
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Powered by free AI models
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="hidden sm:flex items-center">
            <Badge 
              variant={isConnected ? "default" : "secondary"} 
              className={`${isConnected 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {isConnected ? 'AI Ready' : 'Connecting...'}
            </Badge>
          </div>
        </div>
        
        {/* Right Section - Controls */}
        <div className="flex items-center space-x-2">
          {/* Enhanced Model Selection */}
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-[220px] hidden md:flex bg-gray-50/80 dark:bg-slate-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors model-selector-glow">
              <div className="flex items-center space-x-2 flex-1">
                {currentModel && (
                  <>
                    <currentModel.icon className="w-4 h-4 text-blue-500" />
                    <div className="flex flex-col items-start flex-1">
                      <span className="font-medium text-sm">{currentModel.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{currentModel.provider}</span>
                    </div>
                    {currentModel.badge && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        {currentModel.badge}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </SelectTrigger>
            <SelectContent className="w-[300px]">
              {AI_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id} className="p-3">
                  <div className="flex items-center space-x-3">
                    <model.icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{model.name}</span>
                        {model.badge && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            {model.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{model.provider}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{model.description}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile Model Selection */}
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-10 h-10 p-0 md:hidden bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-gray-600">
              {currentModel && <currentModel.icon className="w-4 h-4 text-blue-500" />}
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center space-x-2">
                    <model.icon className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="font-medium">{model.name}</span>
                      <p className="text-xs text-gray-500">{model.provider}</p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 h-10 w-10 icon-button"
                >
                  {theme === "light" ? 
                    <Moon className="h-4 w-4" /> : 
                    <Sun className="h-4 w-4" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Switch to {theme === "light" ? "dark" : "light"} mode
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenSettings}
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 h-10 w-10 icon-button"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Open settings
              </TooltipContent>
            </Tooltip>

            {/* More Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 h-10 w-10 icon-button"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onClearChat} className="text-red-600 dark:text-red-400">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Export Chat
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bot className="h-4 w-4 mr-2" />
                  About AI Models
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
