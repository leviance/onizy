let sequence = 0;

/** Local identity only; not an authentication token or a server-generated identifier. */
export function createLocalId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${sequence++}-${Math.random().toString(36).slice(2)}`;
}
