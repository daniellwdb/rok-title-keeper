export function commandOptions(options: Record<string, string>) {
  return Object.values(options).map((value) => ({
    name: value,
    value,
  }));
}
