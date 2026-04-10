import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KarzaService {
  private readonly logger = new Logger(KarzaService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly xKarzaKey: string;

  constructor(private config: ConfigService) {
    this.baseUrl = config.get<string>('karza.baseUrl', 'https://testapi.karza.in');
    this.apiKey = config.get<string>('karza.apiKey', '');
    this.xKarzaKey = config.get<string>('karza.xKarzaKey', '');
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'x-karza-key': this.xKarzaKey,
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async verifyPan(pan: string, name: string): Promise<{
    valid: boolean;
    name: string;
    dateOfBirth?: string;
    category?: string;
  }> {
    this.logger.log(`Verifying PAN: ${pan}`);

    if (!this.apiKey) {
      this.logger.warn('Karza API key not configured — returning mock response');
      return {
        valid: true,
        name,
        dateOfBirth: '01/01/1985',
        category: 'Individual',
      };
    }

    const response = await fetch(`${this.baseUrl}/v2/pan`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ pan, name }),
    });

    if (!response.ok) {
      throw new Error(`Karza PAN verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      valid: data.statusCode === '101',
      name: data.result?.name || name,
      dateOfBirth: data.result?.dob,
      category: data.result?.category,
    };
  }

  async verifyGstin(gstin: string): Promise<{
    valid: boolean;
    legalName: string;
    tradeName?: string;
    registrationDate?: string;
    status: string;
  }> {
    this.logger.log(`Verifying GSTIN: ${gstin}`);

    if (!this.apiKey) {
      return {
        valid: true,
        legalName: 'Test Business Pvt Ltd',
        tradeName: 'Test Business',
        registrationDate: '2020-01-01',
        status: 'ACTIVE',
      };
    }

    const response = await fetch(`${this.baseUrl}/v2/gstin`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ gstin }),
    });

    if (!response.ok) {
      throw new Error(`Karza GSTIN verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      valid: data.statusCode === '101',
      legalName: data.result?.lgnm || '',
      tradeName: data.result?.tradeNam,
      registrationDate: data.result?.rgdt,
      status: data.result?.sts || 'UNKNOWN',
    };
  }
}
