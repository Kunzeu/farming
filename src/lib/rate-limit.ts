import { NextRequest, NextResponse } from 'next/server';

// Simple rate limiting usando Map en memoria
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutos
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 intentos por ventana

export function rateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset o primera vez
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit excedido
  }

  userLimit.count++;
  return true;
}

export function getRateLimitInfo(identifier: string): { remaining: number; resetTime: number } {
  const userLimit = rateLimitMap.get(identifier);
  const now = Date.now();

  if (!userLimit || now > userLimit.resetTime) {
    return { remaining: RATE_LIMIT_MAX_REQUESTS, resetTime: now + RATE_LIMIT_WINDOW };
  }

  return {
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - userLimit.count),
    resetTime: userLimit.resetTime
  };
}
