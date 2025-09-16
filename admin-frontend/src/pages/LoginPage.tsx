import LoginFormContainer from "../components/auth/LoginFormContainer";
import Button from "@frontend/common/src/components/Button";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h1 className="mb-1 text-center text-2xl font-semibold text-gray-800">
          logivance 🚛
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Sign in to the administration panel.
        </p>
        <LoginFormContainer />
      </div>
    </div>
  );
}
