import 'server-only';

import mailchimp from '@mailchimp/mailchimp_marketing';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

export type MailchimpCustomer = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  serviceType?: string;
  /**
   * Optional structured address for an "Address" merge field in Mailchimp.
   * Mailchimp expects: { addr1, addr2, city, state, zip, country }
   */
  address?: {
    addr1?: string;
    addr2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
};

type MailchimpConfig = {
  apiKey: string;
  serverPrefix: string;
  audienceId: string;
};

function getMailchimpConfig(): MailchimpConfig {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !serverPrefix || !audienceId) {
    const missing: string[] = [];
    if (!apiKey) missing.push('MAILCHIMP_API_KEY');
    if (!serverPrefix) missing.push('MAILCHIMP_SERVER_PREFIX');
    if (!audienceId) missing.push('MAILCHIMP_AUDIENCE_ID');

    throw new Error(`Missing Mailchimp environment variables: ${missing.join(', ')}`);
  }

  return { apiKey, serverPrefix, audienceId };
}

let mailchimpConfigured = false;

/**
 * Reusable Mailchimp client (singleton config).
 * Safe to call repeatedly; config is applied once per process.
 */
export function getMailchimpClient() {
  const { apiKey, serverPrefix } = getMailchimpConfig();

  if (!mailchimpConfigured) {
    mailchimp.setConfig({
      apiKey,
      server: serverPrefix,
    });
    mailchimpConfigured = true;
  }

  return mailchimp;
}

export function getMailchimpSubscriberHash(email: string): string {
  return crypto
    .createHash('md5')
    .update(email.trim().toLowerCase())
    .digest('hex');
}

function parseMailchimpError(err: unknown): {
  status?: number;
  title?: string;
  detail?: string;
  type?: string;
  raw?: unknown;
  message: string;
} {
  type MailchimpSdkError = {
    status?: unknown;
    message?: unknown;
    response?: {
      status?: unknown;
      body?: unknown;
      text?: unknown;
    };
  };

  const anyErr = err as MailchimpSdkError;

  const status: number | undefined =
    typeof anyErr?.status === 'number'
      ? anyErr.status
      : typeof anyErr?.response?.status === 'number'
        ? anyErr.response.status
        : undefined;

  // The SDK uses superagent; errors often contain response.text or response.body.
  const responseBody = anyErr?.response?.body;
  const responseText = anyErr?.response?.text;

  let title: string | undefined;
  let detail: string | undefined;
  let type: string | undefined;

  if (responseBody && typeof responseBody === 'object') {
    const obj = responseBody as Record<string, unknown>;
    title = typeof obj.title === 'string' ? obj.title : undefined;
    detail = typeof obj.detail === 'string' ? obj.detail : undefined;
    type = typeof obj.type === 'string' ? obj.type : undefined;
  } else if (typeof responseText === 'string') {
    try {
      const parsed: unknown = JSON.parse(responseText);
      if (parsed && typeof parsed === 'object') {
        const obj = parsed as Record<string, unknown>;
        title = typeof obj.title === 'string' ? obj.title : undefined;
        detail = typeof obj.detail === 'string' ? obj.detail : undefined;
        type = typeof obj.type === 'string' ? obj.type : undefined;
      }
    } catch {
      // ignore parse errors
    }
  }

  const message =
    detail ||
    title ||
    (typeof anyErr?.message === 'string' ? anyErr.message : 'Mailchimp API error');

  return {
    status,
    title,
    detail,
    type,
    raw:
      responseBody && typeof responseBody === 'object'
        ? responseBody
        : typeof responseText === 'string'
          ? responseText
          : undefined,
    message,
  };
}

function toMergeFieldValue(value?: string): string {
  if (!value) return '';
  return value.trim();
}

function toAddressMergeFieldValue(customer: MailchimpCustomer):
  | {
      addr1?: string;
      addr2?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    }
  | undefined {
  const address = customer.address;
  if (!address) return undefined;

const addr1 = toMergeFieldValue(address.addr1);
const addr2 = toMergeFieldValue(address.addr2);
const city = toMergeFieldValue(address.city);
const state = toMergeFieldValue(address.state) || 'FL';
const zip = toMergeFieldValue(address.zip);
const country = toMergeFieldValue(address.country) || 'US';


  const hasAny = Boolean(addr1 || addr2 || city || state || zip);
  if (!hasAny) return undefined;

  return {
    ...(addr1 ? { addr1 } : {}),
    ...(addr2 ? { addr2 } : {}),
    ...(city ? { city } : {}),
    ...(state ? { state } : {}),
    ...(zip ? { zip } : {}),
    ...(country ? { country } : {}),
  };
}

/**
 * Adds or updates a customer in your Mailchimp audience.
 * - Upserts via lists.setListMember
 * - Forces subscription status to "subscribed"
 * - Applies merge fields (FNAME, LNAME, PHONE)
 * - Optionally applies a tag from serviceType
 */
export async function syncCustomerToMailchimp(customer: MailchimpCustomer): Promise<{
  subscriberHash: string;
}> {
  if (!customer || typeof customer !== 'object') {
    throw new Error('Customer payload is required');
  }

  const email = customer.email?.trim();
  if (!email) {
    throw new Error('Customer email is required');
  }

  const { audienceId } = getMailchimpConfig();
  const client = getMailchimpClient();
  const subscriberHash = getMailchimpSubscriberHash(email);

  const merge_fields = {
    FNAME: toMergeFieldValue(customer.firstName),
    LNAME: toMergeFieldValue(customer.lastName),
    PHONE: toMergeFieldValue(customer.phone),
  };

  const addressMerge = toAddressMergeFieldValue(customer);

  try {
    await client.lists.setListMember(audienceId, subscriberHash, {
      email_address: email,
      status_if_new: 'subscribed',
      status: 'subscribed',
      merge_fields,
    });

    // Optional: update ADDRESS merge field without risking the primary sync.
    // Some lists may not have the ADDRESS merge field configured.
    if (addressMerge) {
      try {
        await client.lists.setListMember(audienceId, subscriberHash, {
          email_address: email,
          merge_fields: {
            ADDRESS: addressMerge,
          },
        });
      } catch (err) {
        logger.warn('Mailchimp address merge update failed', {
          email,
          subscriberHash,
        });
        logger.error('Mailchimp address merge update error detail', err);
      }
    }

    const tagName = customer.serviceType?.trim();
    if (tagName) {
      await client.lists.updateListMemberTags(audienceId, subscriberHash, {
        tags: [{ name: tagName, status: 'active' }],
      });
    }

    logger.info('Mailchimp customer synced', {
      email,
      subscriberHash,
      tagged: Boolean(tagName),
    });

    return { subscriberHash };
  } catch (err) {
    const parsed = parseMailchimpError(err);

    logger.error('Mailchimp customer sync failed', err, {
      email,
      subscriberHash,
      status: parsed.status,
      title: parsed.title,
      detail: parsed.detail,
      type: parsed.type,
    });

    // Bubble up a clean message to callers.
    const statusText = parsed.status ? ` (HTTP ${parsed.status})` : '';
    throw new Error(`Mailchimp sync failed${statusText}: ${parsed.message}`);
  }
}
