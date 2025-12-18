/**
 * Authentication and Authorization Utilities
 */

import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';
import { UnauthorizedError, ForbiddenError } from './api-errors';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
}

/**
 * Get authenticated user from server session
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }
  
  return {
    id: session.user.id,
    email: session.user.email || '',
    name: session.user.name || '',
    phone: session.user.phone || '',
  };
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }
  
  return user;
}

/**
 * Check if user owns a resource
 */
export async function requireOwnership(resourceUserId: string): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (user.id !== resourceUserId) {
    throw new ForbiddenError('You do not have permission to access this resource');
  }
  
  return user;
}

/**
 * Verify JWT token (for custom tokens, not NextAuth)
 */
import jwt from 'jsonwebtoken';

export function verifyToken(token: string): jwt.JwtPayload | string {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error('NEXTAUTH_SECRET is not defined');
    }
    return jwt.verify(token, secret);
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

/**
 * Generate JWT token (for custom use cases like password reset)
 */
export function generateToken(payload: object, expiresIn: string = '1h'): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not defined');
  }
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

/**
 * Password reset token generation
 */
export function generatePasswordResetToken(userId: string): string {
  return generateToken({ userId, type: 'password-reset' }, '1h');
}

/**
 * Email verification token generation
 */
export function generateEmailVerificationToken(email: string): string {
  return generateToken({ email, type: 'email-verification' }, '24h');
}

/**
 * Verify password reset token
 */
export function verifyPasswordResetToken(token: string): { userId: string } {
  const decoded = verifyToken(token);
  
  if (typeof decoded === 'string' || !decoded || typeof decoded === 'string') {
    throw new UnauthorizedError('Invalid token format');
  }
  
  const payload = decoded as jwt.JwtPayload & { type?: string; userId?: string };
  
  if (payload.type !== 'password-reset' || !payload.userId) {
    throw new UnauthorizedError('Invalid token type');
  }
  
  return { userId: payload.userId };
}

/**
 * Verify email verification token
 */
export function verifyEmailVerificationToken(token: string): { email: string } {
  const decoded = verifyToken(token);
  
  if (typeof decoded === 'string' || !decoded) {
    throw new UnauthorizedError('Invalid token format');
  }
  
  const payload = decoded as jwt.JwtPayload & { type?: string; email?: string };
  
  if (payload.type !== 'email-verification' || !payload.email) {
    throw new UnauthorizedError('Invalid token type');
  }
  
  return { email: payload.email };
}

/**
 * Check if session is expired
 */
export async function isSessionExpired(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return !session;
}

/**
 * Get user IP address from request
 */
export function getUserIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Check if request is from allowed origin
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXTAUTH_URL,
  ].filter(Boolean);
  
  if (!origin) {
    return true; // Same-origin requests don't have origin header
  }
  
  return allowedOrigins.includes(origin);
}
