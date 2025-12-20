import { Injectable } from '@nestjs/common';
import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  DeleteMessageCommand,
  DeleteMessageCommandInput,
  Message,
} from '@aws-sdk/client-sqs';

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

@Injectable()
export class SqsService {
  private sqsClient: SQSClient;

  constructor(private config: SqsConfig) {
    this.sqsClient = new SQSClient({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async sendMessage(
    queueUrl: string,
    message: any,
    messageGroupId?: string,
  ): Promise<string> {
    try {
      const params: SendMessageCommandInput = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message),
        ...(messageGroupId && { MessageGroupId: messageGroupId }),
      };

      const response = await this.sqsClient.send(
        new SendMessageCommand(params),
      );
      return response.MessageId!;
    } catch (error) {
      console.error('SQS Send Message Error:', error);
      throw error;
    }
  }

  async sendBatch(queueUrl: string, messages: any[]): Promise<void> {
    try {
      const entries = messages.map((message, index) => ({
        Id: `msg-${index}`,
        MessageBody: JSON.stringify(message),
      }));

      // Note: AWS SDK v3 has SendMessageBatchCommand, but for simplicity
      // we'll send messages individually in this implementation
      for (const entry of entries) {
        await this.sendMessage(queueUrl, JSON.parse(entry.MessageBody));
      }
    } catch (error) {
      console.error('SQS Send Batch Error:', error);
      throw error;
    }
  }

  async receiveMessages(
    queueUrl: string,
    maxMessages = 10,
  ): Promise<Message[]> {
    try {
      const params: ReceiveMessageCommandInput = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxMessages,
        WaitTimeSeconds: 20, // Long polling
        VisibilityTimeout: 30,
      };

      const response = await this.sqsClient.send(
        new ReceiveMessageCommand(params),
      );
      return response.Messages || [];
    } catch (error) {
      console.error('SQS Receive Messages Error:', error);
      return [];
    }
  }

  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    try {
      const params: DeleteMessageCommandInput = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      };

      await this.sqsClient.send(new DeleteMessageCommand(params));
    } catch (error) {
      console.error('SQS Delete Message Error:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Try to get queue attributes to test connection
      await this.receiveMessages(this.config.queues.userEvents, 1);
      return true;
    } catch {
      return false;
    }
  }
}

// Event types for type safety
export interface UserEvent {
  event: 'user_created' | 'user_updated' | 'user_login' | 'user_logout';
  userId: string;
  timestamp: Date;
  data?: any;
}

export interface CourseEvent {
  event:
    | 'course_created'
    | 'course_updated'
    | 'course_published'
    | 'course_enrolled';
  courseId: string;
  userId?: string;
  timestamp: Date;
  data?: any;
}

export interface SubscriptionEvent {
  event:
    | 'subscription_created'
    | 'subscription_updated'
    | 'subscription_cancelled'
    | 'payment_failed';
  subscriptionId: string;
  userId: string;
  timestamp: Date;
  data?: any;
}

export interface ProgressEvent {
  event: 'lesson_completed' | 'quiz_attempted' | 'certificate_earned';
  userId: string;
  courseId: string;
  lessonId?: string;
  progress?: number;
  score?: number;
  timestamp: Date;
  data?: any;
}

export interface CommunityEvent {
  event: 'post_created' | 'comment_added' | 'post_upvoted';
  postId: string;
  userId: string;
  timestamp: Date;
  data?: any;
}

export interface EmailEvent {
  event: 'welcome_email' | 'progress_notification' | 'certificate_ready';
  userId: string;
  email: string;
  template: string;
  data?: any;
}

export interface AnalyticsEvent {
  event: 'page_view' | 'lesson_view' | 'quiz_completed' | 'course_completed';
  userId: string;
  courseId?: string;
  lessonId?: string;
  timestamp: Date;
  metadata?: any;
}
