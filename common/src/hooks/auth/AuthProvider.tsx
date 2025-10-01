import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { User, Role } from "../../types/users";
import { login as apiLogin } from "../../lib/authApi";
import { getJSON, setJSON, remove } from "../../lib/storage";
import { jwtDecode } from "jwt-decode";

type AuthContextValue = {
	token: string | null;
	user: User | null;
	login: (u: string, p: string) => Promise<void>;
	logout: () => void;
	ready: boolean;
};

type JwtPayload = {
	sub: string; // user id
	role: string;
	exp: number;
};

const AuthCtx = createContext<AuthContextValue | null>(null);

type Props = {
	children: React.ReactNode;
	storageKey?: string; // per app (e.g., "admin_auth")
};

function isTokenValid(token: string): boolean {
	try {
		const { exp } = jwtDecode<JwtPayload>(token);
		return Date.now() < exp * 1000;
	} catch {
		return false;
	}
}

export function AuthProvider({ children, storageKey = "auth" }: Props) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const saved = getJSON<{ token: string; user: User }>("session", storageKey);
		if (saved && isTokenValid(saved.token)) {
			setToken(saved.token);
			setUser(saved.user);
		} else {
			remove("session", storageKey);
		}
		setReady(true);
	}, [storageKey]);

	const login = async (username: string, password: string) => {
		const data = await apiLogin(username, password); // returns { access_token, token_type }
		const decoded = jwtDecode<JwtPayload>(data.access_token);

		const user: User = {
			id: decoded.sub,
			username, // optional, backend doesn’t return it
			role: decoded.role as Role, // or use a mapping function if necessary
			created_at: new Date().toISOString(),
		};

		setToken(data.access_token);
		setUser(user);
		setJSON("session", { token: data.access_token, user }, storageKey);
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		remove("session", storageKey);
	};

	const value = useMemo(
		() => ({ token, user, login, logout, ready }),
		[token, user, ready]
	);

	return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthCtx);
	if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
	return ctx;
}
