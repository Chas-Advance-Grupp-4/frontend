// UI for login form

import Input from "@frontend/common/src/components/form/Input";
import Button from "@frontend/common/src/components/Button";

type LoginFormProps = {
  username: string;
  password: string;
  error?: string | null;
  loading?: boolean;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function LoginForm({
  username,
  password,
  error,
  loading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Input
        placeholder="Username"
        autoComplete="username"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />

      {error && (
        <div className="rounded-md px-3 py-2 text-sm text-semantic-error" style={{ backgroundColor: "var(--semantic-error, #f00)", opacity: 0.1 }}>
          {error}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="mt-2 w-full bg-brand-primary text-white hover:bg-blue-700"
      >
        Sign in
      </Button>
    </form>
  );
}
