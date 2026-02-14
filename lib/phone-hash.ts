import crypto from 'crypto';

export function hashPhone(phone: string, merchantId: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Hash: SHA-256(merchantId + phone)
  const hash = crypto
    .createHash('sha256')
    .update(`${merchantId}:${cleaned}`)
    .digest('hex');
  
  return hash;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
}

export function getPhoneLast4(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.slice(-4);
}
