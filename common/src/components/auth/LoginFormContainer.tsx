import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/AuthProvider";
import LoginForm from "./LoginForm";

export default function LoginFormContainer() {
	const { login } = useAuth();
	const nav = useNavigate();
	const [form, setForm] = useState({ username: "", password: "" });
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login(form.username.trim(), form.password);
			nav("/", { replace: true });
		} catch (err: any) {
			setError(err?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<LoginForm
			username={form.username}
			password={form.password}
			error={error}
			loading={loading}
			onUsernameChange={(v) => setForm((s) => ({ ...s, username: v }))}
			onPasswordChange={(v) => setForm((s) => ({ ...s, password: v }))}
			onSubmit={handleSubmit}
		/>
	);
}
