import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./services/aiService";
import { insertMessageSchema, insertChatSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", async (req, res) => {
    try {
      const isAvailable = await aiService.isServiceAvailable();
      res.json({ 
        status: "ok", 
        aiService: isAvailable ? "available" : "unavailable",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: "Service check failed",
        aiService: "unavailable"
      });
    }
  });

  // Chat Sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllChatSessions();
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.status(201).json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getChatSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteChatSession(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Messages
  app.get("/api/sessions/:sessionId/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.sessionId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/sessions/:sessionId/messages", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        sessionId,
      });

      // Create user message
      const userMessage = await storage.createMessage(messageData);

      // Get conversation history for context
      const history = await storage.getMessages(sessionId);
      const conversationHistory = history
        .slice(-10) // Keep last 10 messages for context
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }));

      try {
        // Generate AI response
        const aiResponse = await aiService.generateChatCompletion({
          message: messageData.content,
          sessionHistory: conversationHistory.slice(0, -1), // Exclude the current message
          model: req.body.model || "gemini-2.5-flash",
          temperature: req.body.temperature || 0.7,
          maxTokens: req.body.maxTokens || 1024,
        });

        // Create AI message
        const aiMessage = await storage.createMessage({
          content: aiResponse.content,
          role: "assistant",
          sessionId,
          metadata: {
            model: aiResponse.model,
            tokens: aiResponse.usage?.totalTokens,
          },
        });

        // Update session timestamp
        await storage.updateChatSession(sessionId, { updatedAt: new Date() });

        res.status(201).json({
          userMessage,
          aiMessage,
          usage: aiResponse.usage,
        });
      } catch (aiError: any) {
        // Create error message for AI failure
        const errorMessage = await storage.createMessage({
          content: `I'm sorry, I encountered an error: ${aiError.message}`,
          role: "assistant",
          sessionId,
          metadata: {
            error: aiError.message,
          },
        });

        res.status(200).json({
          userMessage,
          aiMessage: errorMessage,
          error: aiError.message,
        });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Chat completion endpoint for real-time streaming
  app.post("/api/chat/completions", async (req, res) => {
    try {
      const { message, history, model, temperature, maxTokens } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await aiService.generateChatCompletion({
        message,
        sessionHistory: history || [],
        model: model || "gemini-2.5-flash",
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1024,
      });

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message,
        type: "ai_error"
      });
    }
  });

  // Generate session title
  app.post("/api/sessions/:id/generate-title", async (req, res) => {
    try {
      const { firstMessage } = req.body;
      
      if (!firstMessage) {
        return res.status(400).json({ message: "First message is required" });
      }

      const title = await aiService.generateTitle(firstMessage);
      const updatedSession = await storage.updateChatSession(req.params.id, { title });

      if (!updatedSession) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.json({ title });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
