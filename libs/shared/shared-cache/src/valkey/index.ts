import Redis from 'ioredis';

export interface ValkeyHotConfig {
  url: string;
  ttl: number;
}

export interface ValkeySessionConfig {
  url: string;
  ttl: number;
}

export class ValkeyHotService {
  private client: Redis;

  constructor(config: ValkeyHotConfig) {
    this.client = new Redis(config.url);
    this.client.on('error', (err) => console.error('Valkey Hot Error:', err));
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(`hot:${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Valkey Hot Get Error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(`hot:${key}`, ttl, serializedValue);
      } else {
        await this.client.set(`hot:${key}`, serializedValue);
      }
    } catch (error) {
      console.error('Valkey Hot Set Error:', error);
    }
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    await this.set(key, data, ttl);
    return data;
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(`hot:${key}`);
    } catch (error) {
      console.error('Valkey Hot Delete Error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(`hot:${pattern}`);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error('Valkey Hot Invalidate Pattern Error:', error);
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
}

export class ValkeySessionService {
  private client: Redis;

  constructor(config: ValkeySessionConfig) {
    this.client = new Redis(config.url);
    this.client.on('error', (err) =>
      console.error('Valkey Session Error:', err),
    );
  }

  async createSession(userId: string, sessionData: any): Promise<string> {
    const sessionId = this.generateSessionId();
    try {
      await this.client.setex(
        `session:${sessionId}`,
        604800, // 7 days
        JSON.stringify({ userId, ...sessionData }),
      );
      return sessionId;
    } catch (error) {
      console.error('Valkey Session Create Error:', error);
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<any | null> {
    try {
      const data = await this.client.get(`session:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Valkey Session Get Error:', error);
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
      console.error('Valkey Session Update Error:', error);
    }
  }

  async destroySession(sessionId: string): Promise<void> {
    try {
      await this.client.del(`session:${sessionId}`);
    } catch (error) {
      console.error('Valkey Session Destroy Error:', error);
    }
  }

  async getActiveSessions(userId: string): Promise<string[]> {
    try {
      const keys = await this.client.keys(`session:*`);
      const sessions: string[] = [];

      for (const key of keys) {
        const data = await this.client.get(key);
        if (data) {
          const session = JSON.parse(data);
          if (session.userId === userId) {
            sessions.push(key.replace('session:', ''));
          }
        }
      }

      return sessions;
    } catch (error) {
      console.error('Valkey Session Get Active Error:', error);
      return [];
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
