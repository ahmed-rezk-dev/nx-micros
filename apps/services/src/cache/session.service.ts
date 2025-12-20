import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SessionService {
  private client: Redis;

  constructor(@Inject('VALKEY_SESSION_URL') sessionUrl: string) {
    this.client = new Redis(sessionUrl);
    this.client.on('error', (err) =>
      console.error('Session Valkey Error:', err),
    );
  }

  async createSession(userId: string, sessionData: any = {}): Promise<string> {
    const sessionId = this.generateSessionId();
    const sessionPayload = {
      userId,
      ...sessionData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };

    try {
      await this.client.setex(
        `session:${sessionId}`,
        604800, // 7 days in seconds
        JSON.stringify(sessionPayload),
      );
      return sessionId;
    } catch (error) {
      console.error('Session Create Error:', error);
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<any | null> {
    try {
      const data = await this.client.get(`session:${sessionId}`);
      if (!data) return null;

      const session = JSON.parse(data);
      // Update last activity
      session.lastActivity = new Date().toISOString();
      await this.client.setex(
        `session:${sessionId}`,
        604800,
        JSON.stringify(session),
      );

      return session;
    } catch (error) {
      console.error('Session Get Error:', error);
      return null;
    }
  }

  async updateSession(sessionId: string, updates: any): Promise<void> {
    try {
      const existing = await this.getSession(sessionId);
      if (!existing) return;

      const updated = { ...existing, ...updates };
      await this.client.setex(
        `session:${sessionId}`,
        604800,
        JSON.stringify(updated),
      );
    } catch (error) {
      console.error('Session Update Error:', error);
    }
  }

  async destroySession(sessionId: string): Promise<void> {
    try {
      await this.client.del(`session:${sessionId}`);
    } catch (error) {
      console.error('Session Destroy Error:', error);
    }
  }

  async getUserSessions(userId: string): Promise<string[]> {
    try {
      const keys = await this.client.keys('session:*');
      const userSessions: string[] = [];

      for (const key of keys) {
        const data = await this.client.get(key);
        if (data) {
          const session = JSON.parse(data);
          if (session.userId === userId) {
            userSessions.push(key.replace('session:', ''));
          }
        }
      }

      return userSessions;
    } catch (error) {
      console.error('Session Get User Sessions Error:', error);
      return [];
    }
  }

  async cleanupExpiredSessions(): Promise<void> {
    // Valkey handles expiration automatically, but we can implement cleanup logic if needed
    try {
      const keys = await this.client.keys('session:*');
      for (const key of keys) {
        const ttl = await this.client.ttl(key);
        if (ttl === -2) {
          // Key doesn't exist
          continue;
        }
        if (ttl === -1) {
          // Key has no expiration
          await this.client.del(key);
        }
      }
    } catch (error) {
      console.error('Session Cleanup Error:', error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.client.quit();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}
