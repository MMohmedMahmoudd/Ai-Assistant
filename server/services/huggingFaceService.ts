// Hugging Face Inference API - Free AI service alternative
interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

interface HuggingFaceChatRequest {
  message: string;
  sessionHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class HuggingFaceService {
  private readonly baseUrl = 'https://api-inference.huggingface.co/models';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || "";
  }

  async generateChatCompletion(request: HuggingFaceChatRequest) {
    try {
      // Use a free model like Qwen2.5 as mentioned in the user's document
      const model = request.model || "Qwen/Qwen2.5-7B-Instruct";
      
      // Build conversation context
      let prompt = "";
      if (request.sessionHistory && request.sessionHistory.length > 0) {
        prompt = request.sessionHistory
          .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
          .join('\n') + '\n';
      }
      prompt += `Human: ${request.message}\nAssistant:`;

      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: request.maxTokens || 512,
            temperature: request.temperature || 0.7,
            do_sample: true,
            return_full_text: false,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: HuggingFaceResponse[] = await response.json();
      
      if (!data || data.length === 0 || !data[0].generated_text) {
        throw new Error("No response generated from Hugging Face model");
      }

      return {
        content: data[0].generated_text.trim(),
        model,
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error: any) {
      console.error("Hugging Face Service Error:", error);
      
      if (error.message?.includes("Authorization")) {
        throw new Error("Invalid Hugging Face API key. Get a free key from https://huggingface.co/settings/tokens");
      }
      
      if (error.message?.includes("Model") && error.message?.includes("loading")) {
        throw new Error("Model is loading. Free models may take a moment to initialize. Please try again.");
      }
      
      throw new Error(`Hugging Face service error: ${error.message || "Unknown error occurred"}`);
    }
  }

  async isServiceAvailable(): Promise<boolean> {
    try {
      // Check if we have an API key and if the service responds
      if (!this.apiKey) return false;
      
      const response = await fetch(`${this.baseUrl}/Qwen/Qwen2.5-7B-Instruct`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: "Hello",
          parameters: { max_new_tokens: 10 },
        }),
      });
      
      return response.ok;
    } catch (error) {
      console.error("Hugging Face availability check failed:", error);
      return false;
    }
  }
}

export const huggingFaceService = new HuggingFaceService();