import { GoogleGenAI } from "@google/genai";
import { huggingFaceService } from "./huggingFaceService";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export interface ChatCompletionRequest {
  message: string;
  sessionHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  provider?: 'gemini' | 'huggingface';
  apiKey?: string;
}

export interface ChatCompletionResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
}

export class AIService {
  async generateChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    // Determine provider based on model or explicit provider setting
    const provider = request.provider || this.getProviderFromModel(request.model || "gemini-2.5-flash");
    
    if (provider === 'huggingface') {
      return this.generateHuggingFaceCompletion(request);
    } else {
      return this.generateGeminiCompletion(request);
    }
  }

  private getProviderFromModel(model: string): 'gemini' | 'huggingface' {
    if (model.includes('Qwen') || model.includes('huggingface')) {
      return 'huggingface';
    }
    return 'gemini';
  }

  private async generateHuggingFaceCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      const response = await huggingFaceService.generateChatCompletion(request);
      return {
        ...response,
        provider: 'huggingface',
      };
    } catch (error: any) {
      console.error("Hugging Face Service Error:", error);
      throw error;
    }
  }

  private async generateGeminiCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      const model = request.model || "gemini-2.5-flash";
      const temperature = request.temperature || 0.7;
      
      // Use provided API key or fall back to environment variable
      const apiKey = request.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
      
      console.log("AI Service - API key check:", {
        provided: !!request.apiKey,
        envKey: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY),
        hasKey: !!apiKey
      });
      
      if (!apiKey) {
        throw new Error("No API key provided. Please add your Gemini API key in settings.");
      }
      
      // Create a new AI instance with the provided API key
      const aiInstance = new GoogleGenAI({ apiKey });
      
      // Build conversation history
      let conversation = "";
      if (request.sessionHistory && request.sessionHistory.length > 0) {
        conversation = request.sessionHistory
          .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
          .join('\n') + '\n';
      }
      
      const prompt = conversation + `Human: ${request.message}\nAssistant:`;

      const response = await aiInstance.models.generateContent({
        model,
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        config: {
          temperature,
          maxOutputTokens: request.maxTokens || 1024,
          topP: 0.8,
          topK: 40,
        },
      });

      if (!response.text) {
        throw new Error("No response generated from AI service");
      }

      return {
        content: response.text.trim(),
        model,
        provider: 'gemini',
        usage: {
          promptTokens: 0, // Gemini doesn't provide token counts in free tier
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error: any) {
      console.error("Gemini Service Error:", error);
      
      // Handle specific error types
      if (error.message?.includes("API key")) {
        throw new Error("Invalid or missing Gemini API key. Please check your configuration.");
      }
      
      if (error.message?.includes("quota")) {
        throw new Error("Gemini API quota exceeded. Please try again later or upgrade your plan.");
      }
      
      if (error.message?.includes("rate limit")) {
        throw new Error("Rate limit exceeded. Please wait a moment before sending another message.");
      }
      
      throw new Error(`Gemini service error: ${error.message || "Unknown error occurred"}`);
    }
  }

  async generateTitle(firstMessage: string, apiKey?: string): Promise<string> {
    try {
      const prompt = `Generate a short, descriptive title (maximum 6 words) for a conversation that starts with: "${firstMessage}". Only return the title, nothing else.`;
      
      // Use provided API key or fall back to environment variable
      const key = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
      
      if (!key) {
        return "New Conversation";
      }
      
      const aiInstance = new GoogleGenAI({ apiKey: key });
      
      const response = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        config: {
          temperature: 0.3,
          maxOutputTokens: 20,
        },
      });

      return response.text?.trim() || "New Conversation";
    } catch (error) {
      console.error("Title generation error:", error);
      return "New Conversation";
    }
  }

  async isServiceAvailable(): Promise<boolean> {
    try {
      // Check Gemini first
      const geminiAvailable = await this.checkGeminiAvailability();
      if (geminiAvailable) return true;
      
      // Check Hugging Face as fallback
      const hfAvailable = await huggingFaceService.isServiceAvailable();
      return hfAvailable;
    } catch (error) {
      console.error("Service availability check failed:", error);
      return false;
    }
  }

  private async checkGeminiAvailability(): Promise<boolean> {
    try {
      if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
        return false;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          role: "user",
          parts: [{ text: "Hello" }]
        }],
        config: {
          maxOutputTokens: 10,
        },
      });
      
      return !!response.text;
    } catch (error) {
      console.error("Gemini availability check failed:", error);
      return false;
    }
  }
}

export const aiService = new AIService();
