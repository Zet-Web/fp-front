// Utility functions for post URL generation and slug handling

/**
 * Generates a random 4-character URL code with mixed case letters and numbers
 * @returns A random 4-character string (e.g., "Ab3X")
 */
export function generatePostUrlCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Creates a URL-friendly slug from a post title
 * @param title - The post title to convert
 * @returns A slugified version of the title (e.g., "hello-world")
 */
export function generateSlugFromTitle(title: string): string {
  if (!title) return ''

  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Constructs the full post URL path
 * @param urlCode - The unique 4-character URL code
 * @param slug - Optional slug derived from title
 * @returns Full URL path (e.g., "/post/Ab3X-hello-world" or "/post/Ab3X")
 */
export function constructPostUrl(urlCode: string, slug?: string): string {
  if (!slug) {
    return `/post/${urlCode}`
  }
  return `/post/${urlCode}-${slug}`
}

/**
 * Parses a post URL parameter to extract the URL code
 * @param urlParam - The URL parameter from the route (e.g., "Ab3X-hello-world")
 * @returns The 4-character URL code
 */
export function extractUrlCodeFromParam(urlParam: string): string {
  // The URL code is always the first 4 characters
  return urlParam.substring(0, 4)
}

/**
 * Validates if a URL code has the correct format
 * @param urlCode - The URL code to validate
 * @returns True if valid, false otherwise
 */
export function isValidUrlCode(urlCode: string): boolean {
  if (urlCode.length !== 4) return false
  const validChars = /^[A-Za-z0-9]{4}$/
  return validChars.test(urlCode)
}

export { generatePostUrlCode as generateRandomUrlCode }
