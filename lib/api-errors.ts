import { NextResponse } from 'next/server';
import { logger } from './logger';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, message);
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Too Many Requests') {
    super(429, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message, false);
  }
}

/**
 * Error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse {
  // Log the error
  logger.error('API Error:', error);

  // Handle known API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  // Handle Mongoose validation errors
  if (error && typeof error === 'object' && 'name' in error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'Validation Error',
          details: error,
        },
        { status: 400 }
      );
    }

    if (error.name === 'CastError') {
      return NextResponse.json(
        {
          error: 'Invalid ID format',
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors (MongoDB)
    if (error.name === 'MongoServerError' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        {
          error: 'Duplicate entry',
        },
        { status: 409 }
      );
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error: 'Internal Server Error',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  // Unknown error type
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}

/**
 * Async handler wrapper for API routes
 */
export function asyncHandler(
  fn: (request: Request, context?: any) => Promise<NextResponse | Response>
) {
  return async (request: Request, context?: any) => {
    try {
      return await fn(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Validate request method
 */
export function validateMethod(request: Request, allowedMethods: string[]): void {
  if (!allowedMethods.includes(request.method)) {
    throw new ApiError(
      405,
      `Method ${request.method} Not Allowed. Allowed methods: ${allowedMethods.join(', ')}`
    );
  }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => !body[field]);

  if (missingFields.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missingFields.join(', ')}`
    );
  }
}
