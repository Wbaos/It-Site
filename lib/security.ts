/**
 * Input Sanitization and Validation Utilities
 */

export class InputSanitizer {
  /**
   * Sanitize HTML to prevent XSS attacks
   */
  static sanitizeHtml(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate and sanitize email
   */
  static sanitizeEmail(email: string): string | null {
    if (!email) return null;
    
    const trimmed = email.trim().toLowerCase();
    
    // Check if valid email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return null;
    }
    
    return trimmed;
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-numeric characters except + at start
    return phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
  }

  /**
   * Sanitize string input (remove special characters, trim)
   */
  static sanitizeString(input: string, maxLength: number = 1000): string {
    if (!input) return '';
    
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, ''); // Remove potential HTML tags
  }

  /**
   * Validate and sanitize URL
   */
  static sanitizeUrl(url: string): string | null {
    if (!url) return null;
    
    try {
      const parsed = new URL(url);
      
      // Only allow http and https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return null;
      }
      
      return parsed.toString();
    } catch {
      return null;
    }
  }

  /**
   * Validate MongoDB ObjectId
   */
  static isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  /**
   * Sanitize object keys and values recursively
   */
  static sanitizeObject(obj: any, maxDepth: number = 5): any {
    if (maxDepth <= 0) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, maxDepth - 1));
    }
    
    if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {};
      
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize key
        const sanitizedKey = key.replace(/[$.]/g, ''); // Prevent MongoDB injection
        
        // Sanitize value
        if (typeof value === 'string') {
          sanitized[sanitizedKey] = this.sanitizeString(value);
        } else {
          sanitized[sanitizedKey] = this.sanitizeObject(value, maxDepth - 1);
        }
      }
      
      return sanitized;
    }
    
    return obj;
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password || password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    return { valid: true };
  }

  /**
   * Prevent NoSQL injection in queries
   */
  static sanitizeMongoQuery(query: any): any {
    if (typeof query === 'string') {
      return query;
    }
    
    if (Array.isArray(query)) {
      return query.map(item => this.sanitizeMongoQuery(item));
    }
    
    if (query !== null && typeof query === 'object') {
      const sanitized: any = {};
      
      for (const [key, value] of Object.entries(query)) {
        // Prevent MongoDB operators in user input
        if (key.startsWith('$')) {
          continue; // Skip MongoDB operators from user input
        }
        
        sanitized[key] = this.sanitizeMongoQuery(value);
      }
      
      return sanitized;
    }
    
    return query;
  }
}

/**
 * Rate Limiting Helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
  
  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}
