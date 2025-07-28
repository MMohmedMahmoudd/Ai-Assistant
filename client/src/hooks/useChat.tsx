import { useState, useCallback, useRef, useEffect } from "react";
import { Message, ChatSession, ChatState, ChatSettings } from "@/types/chat";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_SETTINGS: ChatSettings = {
  model: "gemini-2.5-flash",
  temperature: 0.7,
  maxTokens: 1024,
  autoScroll: true,
  soundNotifications: false,
  sendOnEnter: true,
};

export function useChat() {
  const { toast } = useToast();
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    currentSession: null,
  });
  
  const [settings, setSettings] = useState<ChatSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatSettings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("chatSettings", JSON.stringify(settings));
  }, [settings]);

  // Create new chat session
  const createSession = useCallback(async (): Promise<ChatSession> => {
    try {
      const response = await apiRequest("POST", "/api/sessions", {
        title: "New Conversation",
      });
      const session = await response.json();
      setState(prev => ({ ...prev, currentSession: session, messages: [] }));
      return session;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create new chat session",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Load messages for a session
  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const [sessionResponse, messagesResponse] = await Promise.all([
        apiRequest("GET", `/api/sessions/${sessionId}`),
        apiRequest("GET", `/api/sessions/${sessionId}/messages`),
      ]);

      const session = await sessionResponse.json();
      const messages = (await messagesResponse.json()).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));

      setState(prev => ({
        ...prev,
        currentSession: session,
        messages,
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      toast({
        title: "Error",
        description: "Failed to load chat session",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    let session = state.currentSession;
    if (!session) {
      session = await createSession();
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
      sessionId: session.id,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await apiRequest("POST", `/api/sessions/${session.id}/messages`, {
        content: content.trim(),
        role: "user",
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
      });

      const data = await response.json();

      // Update with server response
      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages.slice(0, -1), // Remove temporary user message
          {
            ...data.userMessage,
            timestamp: new Date(data.userMessage.timestamp),
          },
          {
            ...data.aiMessage,
            timestamp: new Date(data.aiMessage.timestamp),
          },
        ],
        isLoading: false,
      }));

      // Generate title for first message
      if (state.messages.length === 0) {
        try {
          await apiRequest("POST", `/api/sessions/${session.id}/generate-title`, {
            firstMessage: content.trim(),
          });
        } catch (titleError) {
          console.warn("Failed to generate title:", titleError);
        }
      }

      // Show error toast if AI response contains error
      if (data.error) {
        toast({
          title: "AI Service Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
        messages: prev.messages.slice(0, -1), // Remove failed user message
      }));

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  }, [state.currentSession, state.messages.length, settings, createSession, toast]);

  // Clear chat
  const clearChat = useCallback(async () => {
    if (state.currentSession) {
      try {
        await apiRequest("DELETE", `/api/sessions/${state.currentSession.id}`);
      } catch (error) {
        console.warn("Failed to delete session:", error);
      }
    }
    
    setState(prev => ({
      ...prev,
      messages: [],
      currentSession: null,
      error: null,
    }));

    toast({
      title: "Chat Cleared",
      description: "Conversation history has been cleared",
    });
  }, [state.currentSession, toast]);

  // Cancel current request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    ...state,
    settings,
    sendMessage,
    clearChat,
    loadSession,
    createSession,
    cancelRequest,
    updateSettings,
  };
}
