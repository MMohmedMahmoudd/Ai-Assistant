import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { MessageInput } from "./MessageInput";
import { SettingsModal } from "./SettingsModal";
import { useChat } from "@/hooks/useChat";
import { useQuery } from "@tanstack/react-query";

export function ChatContainer() {
  const {
    messages,
    isLoading,
    error,
    currentSession,
    settings,
    sendMessage,
    clearChat,
    updateSettings,
  } = useChat();
  
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Check service health
  const { data: healthData } = useQuery({
    queryKey: ["/api/health"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  const isConnected = (healthData as any)?.aiService === "available";

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const handleClearChat = async () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      await clearChat();
    }
  };

  const handleModelChange = (model: string) => {
    updateSettings({ model });
  };

  const handleSaveSettings = (newSettings: typeof settings) => {
    updateSettings(newSettings);
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto">
      <ChatHeader
        selectedModel={settings.model}
        onModelChange={handleModelChange}
        onOpenSettings={() => setSettingsOpen(true)}
        onClearChat={handleClearChat}
        isConnected={isConnected}
      />
      
      <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-slate-900">
        <div className="h-full flex flex-col">
          <MessagesList
            messages={messages}
            isLoading={isLoading}
            autoScroll={settings.autoScroll}
          />
          
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            sendOnEnter={settings.sendOnEnter}
          />
        </div>
      </main>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
