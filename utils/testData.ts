// Builds a unique name for test records, e.g. "AutoTest-Customer-1791283378971".
export function uniqueName(prefix: string): string {
  return `${prefix}${Date.now()}`;
}