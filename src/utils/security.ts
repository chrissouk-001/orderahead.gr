/**
 * security.ts
 * 
 * This module provides security-related utilities for the application:
 * - Password hashing and verification
 * - Secure ID and token generation
 * - Input sanitization
 * - Password strength validation
 * - Timing-safe token comparison
 */

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hash a password using bcrypt with a high work factor
 * 
 * @param password - The plaintext password to hash
 * @returns Promise resolving to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // Higher is more secure but slower
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plaintext password against a hashed password
 * 
 * @param password - The plaintext password to check
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise resolving to boolean indicating if passwords match
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a secure unique ID using UUID v4
 * 
 * @returns A cryptographically secure random UUID
 */
export const generateSecureId = (): string => {
  return uuidv4();
};

/**
 * Generate a secure CSRF token to prevent cross-site request forgery
 * 
 * @returns A cryptographically secure random UUID for CSRF protection
 */
export const generateCsrfToken = (): string => {
  return uuidv4();
};

/**
 * Generate a secure token for password reset functionality
 * 
 * @returns A cryptographically secure random UUID for password resets
 */
export const generateResetToken = (): string => {
  return uuidv4();
};

/**
 * Sanitize user input to prevent XSS (Cross-Site Scripting) attacks
 * 
 * @param input - The user input string to sanitize
 * @returns Sanitized string with potentially dangerous characters escaped
 */
export const sanitizeInput = (input: string): string => {
  // Basic sanitization - in production you might want more robust solutions
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate password strength based on common security criteria
 * 
 * @param password - The password to check for strength
 * @returns Boolean indicating if the password meets security requirements
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number, one special
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return strongPasswordRegex.test(password);
};

/**
 * Verify a token using a constant-time comparison to prevent timing attacks
 * 
 * @param token - The token to verify
 * @param expectedToken - The expected token value
 * @returns Boolean indicating if the tokens match
 */
export const verifyToken = (token: string, expectedToken: string): boolean => {
  if (!token || !expectedToken) return false;
  
  // Prevent timing attacks by using constant-time comparison
  const result = token.length === expectedToken.length;
  let diff = 0;
  
  // XOR each character code - if all match, diff will remain 0
  for (let i = 0; i < token.length && i < expectedToken.length; i++) {
    diff |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }
  
  return result && diff === 0;
}; 