import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, Zap, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  messages: Message[];
  isLoading: boolean;
  autoScroll: boolean;
}

interface SuggestedPrompt {
  text: string;
  icon: any;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { text: "Explain quantum computing in simple terms", icon: Zap },
  { text: "Write a Python script to analyze data", icon: Zap },
  { text: "Help me plan a productive morning routine", icon: Zap },
];

export function MessagesList({ messages, isLoading, autoScroll }: Props) {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, autoScroll]);

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied",
        description: "Message copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(timestamp);
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-white w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to AI Chat Assistant
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Ask me anything! I'm powered by advanced AI models and ready to help with your questions.
          </p>
          
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Try these prompts:</p>
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                onClick={() => {
                  const input = document.querySelector('textarea') as HTMLTextAreaElement;
                  if (input) {
                    input.value = prompt.text;
                    input.focus();
                  }
                }}
              >
                <prompt.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{prompt.text}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div className={cn(
            "max-w-[80%] lg:max-w-[60%]",
            message.role === "user" ? "order-2" : "order-1"
          )}>
            {message.role === "assistant" && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Zap className="text-white w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex-1">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap text-sm md:text-base text-gray-900 dark:text-gray-100">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {message.role === "user" && (
              <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
                <p className="text-sm md:text-base whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            )}
            
            <div className={cn(
              "flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400",
              message.role === "user" ? "justify-end" : "justify-start ml-11"
            )}>
              <span>{formatTimestamp(message.timestamp)}</span>
              
              {message.role === "assistant" && (
                <div className="flex items-center ml-2 space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1 hover:text-blue-500"
                    onClick={() => copyMessage(message.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1 hover:text-green-500"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1 hover:text-red-500"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                </div>
              )}
              
              {message.role === "user" && (
                <div className="flex items-center ml-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="text-white w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
