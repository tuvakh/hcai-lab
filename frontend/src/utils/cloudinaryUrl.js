/**
 * Transforms a Cloudinary image URL to serve an optimized version.
 * - f_auto: serves WebP/AVIF where supported
 * - q_auto: auto quality (Cloudinary picks the best compression)
 * - w_{width}: resizes to the given width
 *
 * Non-Cloudinary URLs (NTNU profile photos, etc.) are returned unchanged.
 */
export function cloudinaryUrl(url, width = 400) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
