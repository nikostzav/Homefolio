/**
 * Requests an appropriately-sized, auto-compressed version of a Cloudinary
 * image instead of the raw upload. Property photos are uploaded at full
 * camera resolution (often 3000-6000px wide); without this, a 300x200
 * thumbnail was downloading and decoding the multi-megabyte original.
 */
export function cloudinaryResize(url, { width, height, crop = "fill" } = {}) {
  if (!url || !url.includes("/upload/")) return url;

  const parts = [`q_auto`, `f_auto`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (width && height) parts.push(`c_${crop}`);

  return url.replace("/upload/", `/upload/${parts.join(",")}/`);
}
