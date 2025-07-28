import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ChatSettings } from "@/types/chat";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: ChatSettings;
  onSaveSettings: (settings: ChatSettings) => void;
}

const AI_PROVIDERS = [
  { id: "gemini-2.5-flash", name: "Google Gemini Flash (Free)", provider: "Google" },
  { id: "gemini-2.5-pro", name: "Google Gemini Pro (Free)", provider: "Google" },
  { id: "Qwen/Qwen2.5-7B-Instruct", name: "Qwen 2.5 7B (Free)", provider: "Hugging Face" },
  { id: "Qwen/Qwen2.5-14B-Instruct", name: "Qwen 2.5 14B (Free)", provider: "Hugging Face" },
  { id: "Qwen/Qwen2.5-32B-Instruct", name: "Qwen 2.5 32B (Free)", provider: "Hugging Face" },
];

export function SettingsModal({ open, onOpenChange, settings, onSaveSettings }: Props) {
  const [localSettings, setLocalSettings] = useState<ChatSettings>(settings);
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    onSaveSettings(localSettings);
    onOpenChange(false);
    // Note: API key handling would be implemented based on security requirements
    if (apiKey) {
      console.log("API key would be saved securely");
    }
  };

  const updateSetting = <K extends keyof ChatSettings>(
    key: K,
    value: ChatSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* API Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">API Configuration</h3>
            
            <div className="space-y-2">
              <Label htmlFor="ai-provider">AI Provider</Label>
              <Select 
                value={localSettings.model} 
                onValueChange={(value) => updateSetting("model", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AI Provider" />
                </SelectTrigger>
                <SelectContent>
                  {AI_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{provider.name}</span>
                        <span className="text-xs text-gray-500">{provider.provider}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key (Optional)</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Gemini:</strong> Get free API key from Google AI Studio (aistudio.google.com)</p>
                <p><strong>Hugging Face:</strong> Get free API key from huggingface.co/settings/tokens</p>
                <p>Leave empty to use available free services with rate limits.</p>
              </div>
            </div>
          </div>
          
          {/* Chat Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Chat Settings</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-scroll">Auto-scroll to new messages</Label>
              <Switch
                id="auto-scroll"
                checked={localSettings.autoScroll}
                onCheckedChange={(checked) => updateSetting("autoScroll", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-notifications">Sound notifications</Label>
              <Switch
                id="sound-notifications"
                checked={localSettings.soundNotifications}
                onCheckedChange={(checked) => updateSetting("soundNotifications", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="send-on-enter">Send with Enter key</Label>
              <Switch
                id="send-on-enter"
                checked={localSettings.sendOnEnter}
                onCheckedChange={(checked) => updateSetting("sendOnEnter", checked)}
              />
            </div>
          </div>
          
          {/* Model Parameters */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Model Parameters</h3>
            
            <div className="space-y-2">
              <Label>
                Temperature (Creativity): <span className="font-mono">{localSettings.temperature}</span>
              </Label>
              <Slider
                value={[localSettings.temperature]}
                onValueChange={([value]) => updateSetting("temperature", value)}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Higher values make responses more creative, lower values more focused
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>
                Max Tokens: <span className="font-mono">{localSettings.maxTokens}</span>
              </Label>
              <Slider
                value={[localSettings.maxTokens]}
                onValueChange={([value]) => updateSetting("maxTokens", value)}
                max={2048}
                min={50}
                step={50}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Maximum length of AI responses
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
