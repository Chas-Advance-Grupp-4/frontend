const ns = (key: string, prefix = "auth") => `${prefix}:${key}`;

export function getJSON<T = any>(key: string, prefix?: string): T | null {
	if (typeof window === "undefined") return null;
	const item = localStorage.getItem(ns(key, prefix));
	return item ? JSON.parse(item) : null;
}

export function setJSON(key: string, value: any, prefix?: string): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(ns(key, prefix), JSON.stringify(value));
}

export function remove(key: string, prefix?: string): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(ns(key, prefix));
}
