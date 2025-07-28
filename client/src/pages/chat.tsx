import { ChatContainer } from "@/components/chat/ChatContainer";
import { ThemeProvider } from "@/components/chat/ThemeProvider";

export default function ChatPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <ChatContainer />
      </div>
    </ThemeProvider>
  );
}
