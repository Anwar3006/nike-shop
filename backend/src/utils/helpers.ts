export function sanitizeUpdateData<T extends Record<string, any>>(
  data: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    })
  ) as Partial<T>;
}

// Parse the size range from URL params
export function parseSizeRange(
  sizeParam: string | null
): { min: string; max: string } | null {
  if (!sizeParam || !sizeParam.includes("-")) return null;

  const [min, max] = sizeParam.split("-");
  return { min, max };
}
