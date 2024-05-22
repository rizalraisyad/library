export function setDefaultTimestamp(): string {
  // due to test using sqlite instead of pg, we need to tweak schemas
  return (process.env.NODE_ENV || 'development') === 'development'
    ? 'NOW()'
    : "datetime('now')";
}
