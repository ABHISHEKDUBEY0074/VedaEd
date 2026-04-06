/** True when a single-line toast should use error (red) styling vs success (green). */
export function isToastErrorMessage(msg) {
  if (!msg || typeof msg !== "string") return false;
  return /❌|\bfailed\b|fix errors/i.test(msg);
}

export function toastBannerClassName(msg) {
  const err = isToastErrorMessage(msg);
  return err
    ? "text-red-800 bg-red-50 border-red-200"
    : "text-green-800 bg-green-50 border-green-200";
}
