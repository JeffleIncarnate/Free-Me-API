export function verifyArray(items: string[]): boolean {
  for (let i = 0; i < items.length; i++)
    if (items[i] === null || items[i] === undefined || items[i] === "")
      return false;

  return true;
}
