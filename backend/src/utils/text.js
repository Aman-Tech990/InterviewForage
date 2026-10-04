export function normalizeTopic(topic) {
  return String(topic ?? '').trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 80);
}

export function truncate(text, maxLength) {
  const value = String(text ?? '');
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 3)}...`;
}

export function unique(values) {
  return [...new Set(values)];
}
