import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { User, Role, LoginResponse } from "../../types/auth";
import { login as apiLogin, me as apiMe } from "../../lib/authApi";
import { getJSON, setJSON, remove } from "../../lib/storage";
import {jwtDecode} from "jwt-decode";

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
		// 1. Call backend login → returns { access_token, token_type }
		const data: LoginResponse = await apiLogin(username, password);

		// 2a. Store token in state
		setToken(data.access_token);

		// 2b. Store token in localStorage
		localStorage.setItem("access_token", data.access_token);

		// 3. Immediately call /auth/me with the token
		const user: User = await apiMe();

		// 4. Store user and persist session
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
