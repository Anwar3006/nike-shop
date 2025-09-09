export function sanitizeUpdateData(data) {
    return Object.fromEntries(Object.entries(data).filter(([_, value]) => {
        if (value === undefined || value === null)
            return false;
        if (typeof value === "string" && value.trim() === "")
            return false;
        return true;
    }));
}
// Parse the size range from URL params
export function parseSizeRange(sizeParam) {
    if (!sizeParam || !sizeParam.includes("-"))
        return null;
    const [min, max] = sizeParam.split("-");
    return { min, max };
}
