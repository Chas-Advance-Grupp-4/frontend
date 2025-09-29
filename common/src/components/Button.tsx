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
			filled:
				"bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary)]/90",
			outline:
				"border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] bg-transparent hover:bg-[var(--color-brand-primary-muted)]",
			ghost:
				"text-[var(--color-brand-primary)] bg-transparent hover:bg-[var(--color-brand-primary-muted)]",
		},
		secondary: {
			filled:
				"bg-[var(--color-brand-secondary)] text-white hover:bg-[var(--color-brand-secondary)]/90",
			outline:
				"border border-[var(--color-brand-secondary)] text-[var(--color-brand-secondary)] bg-transparent hover:bg-[var(--color-brand-muted)]",
			ghost:
				"text-[var(--color-brand-secondary)] bg-transparent hover:bg-[var(--color-brand-muted)]",
		},
		danger: {
			filled:
				"bg-[var(--color-semantic-error)] text-white hover:bg-[var(--color-semantic-error)]/90",
			outline:
				"border border-[var(--color-semantic-error)] text-[var(--color-semantic-error)] bg-transparent hover:bg-[var(--color-semantic-error)]/10",
			ghost:
				"text-[var(--color-semantic-error)] bg-transparent hover:bg-[var(--color-semantic-error)]/10",
		},
		success: {
			filled:
				"bg-[var(--color-semantic-success)] text-white hover:bg-[var(--color-semantic-success)]/90",
			outline:
				"border border-[var(--color-semantic-success)] text-[var(--color-semantic-success)] bg-transparent hover:bg-[var(--color-semantic-success)]/10",
			ghost:
				"text-[var(--color-semantic-success)] bg-transparent hover:bg-[var(--color-semantic-success)]/10",
		},
		warning: {
			filled:
				"bg-color-semantic-warning)] text-white hover:bg-[var(--color-semantic-warning)]/90",
			outline:
				"border border-[var(--color-semantic-warning)] text-[var(--color-semantic-warning)] bg-transparent hover:bg-[var(--color-semantic-warning)]/10",
			ghost:
				"text-[var(--color-semantic-warning)] bg-transparent hover:bg-[var(--color-semantic-warning)]/10",
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
