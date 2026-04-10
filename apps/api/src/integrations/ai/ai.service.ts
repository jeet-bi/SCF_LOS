import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: Anthropic;
  private readonly model: string;
  private readonly maxTokens: number;

  constructor(private config: ConfigService) {
    this.client = new Anthropic({
      apiKey: config.get('anthropic.apiKey'),
    });
    this.model = config.get('anthropic.model') || 'claude-sonnet-4-6';
    this.maxTokens = config.get('anthropic.maxTokens') || 8192;
  }

  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: prompt },
    ];

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      system: systemPrompt,
      messages,
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI');
    }

    return content.text;
  }

  async analyzeImageBase64(
    base64Image: string,
    mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
    prompt: string,
    systemPrompt?: string,
  ): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image,
              },
            },
            { type: 'text', text: prompt },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI');
    }

    return content.text;
  }

  parseJsonResponse<T>(raw: string): T {
    const jsonMatch = raw.match(/```json\n?([\s\S]*?)\n?```/) ||
      raw.match(/\{[\s\S]*\}/) ||
      raw.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch {
        // fall through
      }
    }

    return JSON.parse(raw) as T;
  }
}
