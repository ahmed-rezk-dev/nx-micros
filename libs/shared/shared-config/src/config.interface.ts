export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface ValkeyConfig {
  hot: {
    url: string;
    ttl: number;
  };
  session: {
    url: string;
    ttl: number;
  };
}

export interface SqsConfig {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  queues: {
    userEvents: string;
    courseEvents: string;
    subscriptionEvents: string;
    progressEvents: string;
    communityEvents: string;
    emailQueue: string;
    analyticsQueue: string;
  };
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface ServiceConfig {
  name: string;
  port: number;
  environment: string;
}

export interface AppConfig {
  database: DatabaseConfig;
  valkey: ValkeyConfig;
  sqs: SqsConfig;
  jwt: JwtConfig;
  service: ServiceConfig;
  cors: {
    origin: string[];
    credentials: boolean;
  };
  rateLimit: {
    ttl: number;
    limit: number;
  };
}
