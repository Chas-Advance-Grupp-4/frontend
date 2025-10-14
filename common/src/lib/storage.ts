// localStorage helpers (get/set/remove with namespacing)

const ns = (key: string, prefix = "auth") => `${prefix}:${key}`;

export function setJSON(key: string, value: unknown, prefix?: string) {
  localStorage.setItem(ns(key, prefix), JSON.stringify(value));
}

export function getJSON<T = unknown>(key: string, prefix?: string): T | null {
  const raw = localStorage.getItem(ns(key, prefix));
  return raw ? (JSON.parse(raw) as T) : null;
}

export function remove(key: string, prefix?: string) {
  localStorage.removeItem(ns(key, prefix));
}
