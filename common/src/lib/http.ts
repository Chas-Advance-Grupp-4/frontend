// API base client (reads VITE_API_BASE_URL via a tiny getter you override per app)

// Base HTTP helper with injectable base URL
export type BaseUrlGetter = () => string;

let getBaseUrl: BaseUrlGetter = () => {
	throw new Error(
		"Base URL getter not set. Call setBaseUrlGetter() from the app."
	);
};

export function setBaseUrlGetter(fn: BaseUrlGetter) {
	getBaseUrl = fn;
}

export async function http<T = unknown>(
	path: string,
	init?: RequestInit
): Promise<T> {
	const token = localStorage.getItem("access_token");

	const res = await fetch(`${getBaseUrl()}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(init?.headers || {}),
		},
		...init,
	});

	if (!res.ok) {
		const msg = await res.text().catch(() => "");
		throw new Error(msg || `${res.status} ${res.statusText}`);
	}
	return res.json() as Promise<T>;
}
