export const splitFullName = (fullName: string) => {
  const nameParts = fullName.trim().split(/\s+/);

  if (nameParts.length === 0) return ["", ""];
  if (nameParts.length === 1) return [nameParts[0], ""];

  // First part is firstName, everything else is lastName
  const firstName = nameParts.slice(0, 2).join(" ");
  const lastName = nameParts[2];

  return [firstName, lastName];
};
