// Safety check before deleting: only records created by the tests may be deleted.
export function assertTestRecord(name: string, prefix: string): void {
  if (!name.startsWith(prefix)) {
    throw new Error(`Refusing to delete "${name}": it does not start with "${prefix}".`);
  }
}