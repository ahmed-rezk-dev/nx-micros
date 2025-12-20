import { Injectable } from '@nestjs/common';
import {
  SQSClient,
  SendMessageCommand,
  CreateQueueCommand,
  GetQueueUrlCommand,
  ListQueuesCommand,
} from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService {
  private sqsClient: SQSClient;
  private queueUrls: Map<string, string> = new Map();

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.SQS_ENDPOINT || 'http://localhost:4566',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    });
  }

  async createQueue(queueName: string): Promise<string> {
    try {
      const command = new CreateQueueCommand({
        QueueName: queueName,
      });

      const result = await this.sqsClient.send(command);
      const queueUrl = result.QueueUrl!;

      this.queueUrls.set(queueName, queueUrl);
      console.log(`Created SQS queue: ${queueName}`);
      return queueUrl;
    } catch (error) {
      console.error(`Error creating queue ${queueName}:`, error);
      throw error;
    }
  }

  async getQueueUrl(queueName: string): Promise<string> {
    if (this.queueUrls.has(queueName)) {
      return this.queueUrls.get(queueName)!;
    }

    try {
      const command = new GetQueueUrlCommand({
        QueueName: queueName,
      });

      const result = await this.sqsClient.send(command);
      const queueUrl = result.QueueUrl!;

      this.queueUrls.set(queueName, queueUrl);
      return queueUrl;
    } catch (error) {
      console.error(`Error getting queue URL for ${queueName}:`, error);
      throw error;
    }
  }

  async sendMessage(queueName: string, message: any): Promise<void> {
    try {
      const queueUrl = await this.getQueueUrl(queueName);

      const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message),
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: message.eventType || 'unknown',
          },
          timestamp: {
            DataType: 'String',
            StringValue: new Date().toISOString(),
          },
        },
      });

      await this.sqsClient.send(command);
      console.log(`Message sent to queue ${queueName}:`, message);
    } catch (error) {
      console.error(`Error sending message to queue ${queueName}:`, error);
      throw error;
    }
  }

  async listQueues(): Promise<string[]> {
    try {
      const command = new ListQueuesCommand({});
      const result = await this.sqsClient.send(command);
      return result.QueueUrls || [];
    } catch (error) {
      console.error('Error listing queues:', error);
      return [];
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.listQueues();
      return true;
    } catch {
      return false;
    }
  }
}
