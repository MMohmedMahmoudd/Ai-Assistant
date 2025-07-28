import { type Message, type InsertMessage, type ChatSession, type InsertChatSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Messages
  getMessages(sessionId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Chat Sessions
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;
  deleteChatSession(id: string): Promise<boolean>;
  getAllChatSessions(): Promise<ChatSession[]>;
}

export class MemStorage implements IStorage {
  private messages: Map<string, Message>;
  private chatSessions: Map<string, ChatSession>;

  constructor() {
    this.messages = new Map();
    this.chatSessions = new Map();
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
      metadata: insertMessage.metadata ? {
        model: typeof insertMessage.metadata.model === 'string' ? insertMessage.metadata.model : undefined,
        tokens: typeof insertMessage.metadata.tokens === 'number' ? insertMessage.metadata.tokens : undefined,
        error: typeof insertMessage.metadata.error === 'string' ? insertMessage.metadata.error : undefined,
      } : null,
    };
    this.messages.set(id, message);
    return message;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const now = new Date();
    const session: ChatSession = {
      ...insertSession,
      id,
      createdAt: now,
      updatedAt: now,
      title: insertSession.title || null,
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteChatSession(id: string): Promise<boolean> {
    // Also delete all messages in this session
    const messages = await this.getMessages(id);
    messages.forEach(message => this.messages.delete(message.id));
    
    return this.chatSessions.delete(id);
  }

  async getAllChatSessions(): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
}

export const storage = new MemStorage();
