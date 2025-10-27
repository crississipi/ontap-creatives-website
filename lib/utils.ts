export function inPeso(num: number, locale = 'en-US'): string {
  return num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}