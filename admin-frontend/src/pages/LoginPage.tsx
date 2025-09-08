import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, Button, Input } from "@frontend/common";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      nav("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h1 className="mb-1 text-center text-2xl font-semibold text-gray-800">
          Welcome back
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Sign in to Admin
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Username"
            autoComplete="username"
            value={form.username}
            onChange={(e) =>
              setForm((s) => ({ ...s, username: e.target.value }))
            }
          />
          <Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) =>
              setForm((s) => ({ ...s, password: e.target.value }))
            }
          />
          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <Button type="submit" loading={loading} className="mt-2 w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
