type EncryptedEnvelope = {
  v: 1;
  iv: string;
  salt: string;
  cipherText: string;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const KEY_PREFIX = 'reportiq.secure.';
const FALLBACK_SECRET = 'reportiq-default-storage-secret';

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function storageKey(key: string): string {
  return `${KEY_PREFIX}${key}`;
}

function resolveSecret(): string {
  const configured = import.meta.env.VITE_AUTH_STORAGE_SECRET;
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim();
  }
  return `${window.location.origin}|${FALLBACK_SECRET}`;
}

async function deriveKey(salt: Uint8Array): Promise<CryptoKey> {
  const secret = resolveSecret();
  const baseKey = await crypto.subtle.importKey('raw', encoder.encode(secret), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 120000,
      hash: 'SHA-256',
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  );
}

function canEncrypt(): boolean {
  return typeof window !== 'undefined' && typeof window.crypto?.subtle !== 'undefined';
}

async function encrypt(plainText: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(salt);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(plainText));

  const envelope: EncryptedEnvelope = {
    v: 1,
    iv: toBase64(iv),
    salt: toBase64(salt),
    cipherText: toBase64(new Uint8Array(encrypted)),
  };
  return JSON.stringify(envelope);
}

async function decrypt(payload: string): Promise<string> {
  const parsed = JSON.parse(payload) as Partial<EncryptedEnvelope>;
  if (parsed.v !== 1 || !parsed.iv || !parsed.salt || !parsed.cipherText) {
    throw new Error('Invalid encrypted payload.');
  }

  const iv = fromBase64(parsed.iv);
  const salt = fromBase64(parsed.salt);
  const data = fromBase64(parsed.cipherText);
  const key = await deriveKey(salt);
  const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return decoder.decode(plainBuffer);
}

export async function setSecureItem<T>(key: string, value: T): Promise<void> {
  const raw = JSON.stringify(value);
  const finalKey = storageKey(key);
  if (!canEncrypt()) {
    localStorage.setItem(finalKey, raw);
    return;
  }

  const payload = await encrypt(raw);
  localStorage.setItem(finalKey, payload);
}

export async function getSecureItem<T>(key: string): Promise<T | null> {
  const finalKey = storageKey(key);
  const payload = localStorage.getItem(finalKey);
  if (!payload) return null;

  if (!canEncrypt()) {
    return JSON.parse(payload) as T;
  }

  const plain = await decrypt(payload);
  return JSON.parse(plain) as T;
}

export async function removeSecureItem(key: string): Promise<void> {
  localStorage.removeItem(storageKey(key));
}

export function removeSecureItemSync(key: string): void {
  localStorage.removeItem(storageKey(key));
}