import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "success" | "warning";
type Appearance = "filled" | "outline" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: Variant;
  appearance?: Appearance;
};

export default function Button({
  loading,
  variant = "primary",
  appearance = "filled",
  className,
  children,
  ...rest
}: Props) {
  const baseStyles =
    "rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-60";

  const variantMap: Record<
    Variant,
    { filled: string; outline: string; ghost: string }
  > = {
    primary: {
      filled: "bg-blue-600 text-white hover:bg-blue-700",
      outline:
        "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50",
      ghost: "text-blue-600 bg-transparent hover:bg-blue-50",
    },
    secondary: {
      filled: "bg-gray-600 text-white hover:bg-gray-700",
      outline:
        "border border-gray-600 text-gray-600 bg-transparent hover:bg-gray-50",
      ghost: "text-gray-600 bg-transparent hover:bg-gray-50",
    },
    danger: {
      filled: "bg-red-600 text-white hover:bg-red-700",
      outline:
        "border border-red-600 text-red-600 bg-transparent hover:bg-red-50",
      ghost: "text-red-600 bg-transparent hover:bg-red-50",
    },
    success: {
      filled: "bg-green-600 text-white hover:bg-green-700",
      outline:
        "border border-green-600 text-green-600 bg-transparent hover:bg-green-50",
      ghost: "text-green-600 bg-transparent hover:bg-green-50",
    },
    warning: {
      filled: "bg-amber-500 text-white hover:bg-amber-600",
      outline:
        "border border-amber-500 text-amber-500 bg-transparent hover:bg-amber-50",
      ghost: "text-amber-500 bg-transparent hover:bg-amber-50",
    },
  };

  const styles = variantMap[variant][appearance];

  return (
    <button
      className={clsx(baseStyles, styles, className)}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
