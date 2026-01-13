// JWT utility functions
export interface JWTPayload {
  sub: string;
  exp: number;
  iat?: number;
}

/**
 * Decode JWT token without verification (client-side only)
 * Note: This does not verify the signature, only decodes the payload
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  
  // Add 5 second buffer to account for clock skew
  return currentTime >= (expirationTime - 5000);
}

/**
 * Get time until token expires in milliseconds
 * Returns 0 if expired or invalid
 */
export function getTokenExpirationTime(token: string): number {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return 0;
  }
  
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const timeUntilExpiry = expirationTime - currentTime;
  
  return Math.max(0, timeUntilExpiry);
}

