export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPort: parseInt(process.env.API_PORT ?? '3001', 10) || 3001,
  webUrl: process.env.WEB_URL || 'http://localhost:3000',

  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY || '8h',
  },

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },

  storage: {
    endpoint: process.env.STORAGE_ENDPOINT,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
    bucket: process.env.STORAGE_BUCKET,
    region: process.env.STORAGE_REGION,
    cdnUrl: process.env.STORAGE_CDN_URL || '',
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL,
    maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS ?? '8192', 10) || 8192,
  },

  karza: {
    baseUrl: process.env.KARZA_BASE_URL,
    apiKey: process.env.KARZA_API_KEY || '',
    xKarzaKey: process.env.KARZA_X_KARZA_KEY || '',
  },

  perfios: {
    baseUrl: process.env.PERFIOS_BASE_URL,
    clientId: process.env.PERFIOS_CLIENT_ID || '',
    clientSecret: process.env.PERFIOS_CLIENT_SECRET || '',
    institutionId: process.env.PERFIOS_INSTITUTION_ID || '',
  },

  cibil: {
    baseUrl: process.env.CIBIL_BASE_URL,
    memberId: process.env.CIBIL_MEMBER_ID || '',
    apiKey: process.env.CIBIL_API_KEY || '',
  },

  digio: {
    baseUrl: process.env.DIGIO_BASE_URL,
    clientId: process.env.DIGIO_CLIENT_ID || '',
    clientSecret: process.env.DIGIO_CLIENT_SECRET || '',
    webhookSecret: process.env.DIGIO_WEBHOOK_SECRET || '',
  },

  razorpayx: {
    baseUrl: process.env.RAZORPAYX_BASE_URL,
    keyId: process.env.RAZORPAYX_KEY_ID || '',
    keySecret: process.env.RAZORPAYX_KEY_SECRET || '',
    accountNumber: process.env.RAZORPAYX_ACCOUNT_NUMBER || '',
  },

  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT ?? '1025', 10) || 1025,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM,
  },

  sms: {
    provider: process.env.SMS_PROVIDER,
    apiKey: process.env.SMS_API_KEY || '',
  },

  whatsapp: {
    provider: process.env.WHATSAPP_PROVIDER,
    apiKey: process.env.WHATSAPP_API_KEY || '',
    appName: process.env.WHATSAPP_APP_NAME || '',
  },
});
