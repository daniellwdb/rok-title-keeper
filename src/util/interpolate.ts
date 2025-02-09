export function interpolate(
  text: string,
  interpolation: Record<string, unknown>
) {
  return Object.entries(interpolation).reduce((originalText, [key, value]) => {
    const placeholder = `{${key}}`;
    const keyInText = originalText.includes(placeholder);

    if (keyInText) {
      return originalText.replace(placeholder, `${value}`);
    }

    return originalText;
  }, text);
}
