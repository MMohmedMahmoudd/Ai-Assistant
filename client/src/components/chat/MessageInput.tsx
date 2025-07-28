import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";

interface Props {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sendOnEnter: boolean;
}

export function MessageInput({ onSendMessage, isLoading, sendOnEnter }: Props) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && sendOnEnter) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const characterCount = message.length;
  const maxCharacters = 4000;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message here..."
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="min-h-[48px] max-h-[120px] resize-none pr-12 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={maxCharacters}
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 bottom-3 h-6 w-6 text-gray-500 dark:text-gray-400 hover:text-blue-500"
              onClick={() => {
                // File attachment functionality could be implemented here
                console.log("Attach file clicked");
              }}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl px-6 py-3 h-12"
          >
            <span className="hidden sm:inline mr-2">Send</span>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> to send
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Shift + Enter</kbd> for new line
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={characterCount > maxCharacters * 0.9 ? "text-red-500" : ""}>
              {characterCount}/{maxCharacters}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
