/**
 * Generate a URL-safe slug from a business name
 * Converts to lowercase, removes special characters, and replaces spaces with hyphens
 */
export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug with merchant ID suffix to prevent collisions
 * Example: "the-coffee-shop-a7f3"
 */
export function generateUniqueSlug(businessName: string, merchantId: string): string {
  const baseSlug = generateSlug(businessName);
  const suffix = merchantId.split('-')[0].slice(0, 4); // First 4 chars of UUID
  return `${baseSlug}-${suffix}`;
}
