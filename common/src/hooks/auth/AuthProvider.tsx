// manages { token, user }, persists to storage, exposes login/logout

import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { LoginResponse, User } from "../../types/auth";
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
	exp: number;
	iat?: number;
	sub?: string;
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
		const data: LoginResponse = await apiLogin(username, password);
		setToken(data.access_token);
		setUser(data.user);
		setJSON(
			"session",
			{ token: data.access_token, user: data.user },
			storageKey
		);
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
