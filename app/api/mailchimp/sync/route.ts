import 'server-only';

import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { syncCustomerToMailchimp, type MailchimpCustomer } from '@/lib/mailchimp';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(email: string): boolean {
  // Intentionally simple: enough for API input validation.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function isAuthorized(request: Request): { ok: true } | { ok: false; status: number; message: string } {
  const expected = process.env.MAILCHIMP_SYNC_BASIC_AUTH;
  if (!expected) {
    return {
      ok: false,
      status: 403,
      message: 'Sync endpoint is disabled: set MAILCHIMP_SYNC_BASIC_AUTH to enable.',
    };
  }

  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Basic ')) {
    return { ok: false, status: 401, message: 'Unauthorized' };
  }

  const encoded = authHeader.slice('Basic '.length).trim();
  let decoded = '';
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return { ok: false, status: 401, message: 'Unauthorized' };
  }

  const ok = timingSafeEqualString(decoded, expected);
  if (!ok) {
    return { ok: false, status: 401, message: 'Unauthorized' };
  }

  return { ok: true };
}

function validatePayload(body: unknown): { ok: true; customer: MailchimpCustomer } | { ok: false; errors: string[] } {
  if (!body || typeof body !== 'object') {
    return { ok: false, errors: ['Body must be a JSON object'] };
  }

  const anyBody = body as Record<string, unknown>;
  const email = anyBody.email;

  const errors: string[] = [];

  if (!isNonEmptyString(email) || !isValidEmail(email)) {
    errors.push('email is required and must be a valid email address');
  }

  const firstName = isNonEmptyString(anyBody.firstName) ? anyBody.firstName.trim() : undefined;
  const lastName = isNonEmptyString(anyBody.lastName) ? anyBody.lastName.trim() : undefined;
  const phone = isNonEmptyString(anyBody.phone) ? anyBody.phone.trim() : undefined;
  const serviceType = isNonEmptyString(anyBody.serviceType) ? anyBody.serviceType.trim() : undefined;

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    customer: {
      email: (email as string).trim(),
      firstName,
      lastName,
      phone,
      serviceType,
    },
  };
}

export async function POST(request: Request) {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.message }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const validated = validatePayload(body);
  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, error: 'Invalid input', details: validated.errors },
      { status: 400 }
    );
  }

  try {
    const result = await syncCustomerToMailchimp(validated.customer);
    return NextResponse.json({ ok: true, subscriberHash: result.subscriberHash });
  } catch (err) {
    logger.error('Mailchimp sync API failed', err, {
      email: validated.customer.email,
    });

    const message = err instanceof Error ? err.message : 'Mailchimp sync failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: 'Method Not Allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}
