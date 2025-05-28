import type { UserProfileDTO } from "../api/types";
import { apiService } from "../api/service";

export type Message = {
  from: "user" | "ai";
  text: string;
};

const getStorageKey = async (): Promise<string> => {
  const user: UserProfileDTO = await apiService.getMe();
  return `chat_${user.email}_${user.username}`;
};

export const chatService = {
  async getHistory(): Promise<Message[]> {
    const key = await getStorageKey();
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  },

  async saveHistory(history: Message[]): Promise<void> {
    const key = await getStorageKey();
    localStorage.setItem(key, JSON.stringify(history));
  },

  async clearHistory(): Promise<void> {
    const key = await getStorageKey();
    localStorage.removeItem(key);
  },

  async sendMessageToAI(message: string): Promise<string> {
    return await apiService.sendMessage(message);
  },
};
