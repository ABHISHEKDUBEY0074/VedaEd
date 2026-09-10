const crypto = require('crypto');

/**
 * Token Crypto Service
 * Provides authenticated AES-256-GCM symmetric encryption for OAuth tokens and secrets at rest.
 * Uses 256-bit key, 12-byte IV, and 16-byte authentication tag.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit recommended for GCM
const KEY_LENGTH = 32; // 256-bit

/**
 * Derives a consistent 32-byte encryption key from environment secrets.
 */
function getEncryptionKey() {
  const secret = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'veda_school_enterprise_secure_token_secret_32b!';
  return crypto.createHash('sha256').update(String(secret)).digest();
}

/**
 * Encrypts plaintext string using AES-256-GCM.
 * @param {string} plaintext - The plain string to encrypt (e.g. access_token, refresh_token)
 * @returns {{ encrypted: string, iv: string, tag: string }}
 */
function encrypt(plaintext) {
  if (!plaintext || typeof plaintext !== 'string') {
    return { encrypted: '', iv: '', tag: '' };
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag,
  };
}

/**
 * Decrypts ciphertext using AES-256-GCM with authentication tag verification.
 * @param {string} encryptedHex - The ciphertext in hex
 * @param {string} ivHex - The IV in hex
 * @param {string} tagHex - The auth tag in hex
 * @returns {string} - Decrypted plaintext string
 */
function decrypt(encryptedHex, ivHex, tagHex) {
  if (!encryptedHex || !ivHex || !tagHex) {
    return '';
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Computes a constant-time HMAC-SHA256 signature for webhook or state verification.
 */
function computeHmac(secret, payload) {
  return crypto.createHmac('sha256', secret).update(typeof payload === 'string' ? payload : JSON.stringify(payload)).digest('hex');
}

/**
 * Secure constant-time comparison to prevent timing attacks.
 */
function timingSafeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

module.exports = {
  encrypt,
  decrypt,
  computeHmac,
  timingSafeEqual,
};
