/**
 * Environment Variable Validation
 * Ensures all required environment variables are present at build time
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_WRITE_TOKEN',
  'RESEND_API_KEY',
  'EMAIL_USER',
  'EMAIL_PASS',
  'NEXT_PUBLIC_BASE_URL',
] as const;

const optionalEnvVars = [
  'FROM_EMAIL',
  'OPENAI_API_KEY',
  'MAILCHIMP_API_KEY',
  'MAILCHIMP_SERVER_PREFIX',
  'MAILCHIMP_AUDIENCE_ID',
  'MAILCHIMP_SYNC_BASIC_AUTH',
] as const;

export function validateEnv() {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check optional variables
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      'Please check your .env.local file.'
    );
  }

  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(
      `⚠️  Optional environment variables not set:\n${warnings.join('\n')}`
    );
  }

  // Validate NEXTAUTH_SECRET length
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    throw new Error('NEXTAUTH_SECRET must be at least 32 characters long');
  }

  // Validate URLs
  if (process.env.NEXTAUTH_URL) {
    try {
      new URL(process.env.NEXTAUTH_URL);
    } catch {
      throw new Error('NEXTAUTH_URL must be a valid URL');
    }
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_BASE_URL);
    } catch {
      throw new Error('NEXT_PUBLIC_BASE_URL must be a valid URL');
    }
  }

  console.log('✅ Environment variables validated successfully');
}

// Auto-validate on import (except in production builds)
if (process.env.NODE_ENV !== 'production') {
  validateEnv();
}
