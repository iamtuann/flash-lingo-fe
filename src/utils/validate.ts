
type ObjectWithValues = Record<string, string | number | null | undefined>;

export function hasValues(obj: ObjectWithValues): boolean {
  return Object.values(obj).every(
    (value) => value !== null && value !== undefined && value !== ''
  );
}