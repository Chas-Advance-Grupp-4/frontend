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
	init: RequestInit = {}
): Promise<T> {
	const token = localStorage.getItem("access_token"); // get JWT

	const res = await fetch(`${getBaseUrl()}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(init.headers || {}), // <-- merge user headers last (allows override)
		},
	});

	if (!res.ok) {
		let msg: string;
		try {
			msg = (await res.json()).detail ?? (await res.text());
		} catch {
			msg = `${res.status} ${res.statusText}`;
		}
		throw new Error(msg);
	}

	// Handle empty responses (e.g. DELETE 204 No Content)
	if (res.status === 204) {
		return undefined as T;
	}

	return res.json() as Promise<T>;
}
