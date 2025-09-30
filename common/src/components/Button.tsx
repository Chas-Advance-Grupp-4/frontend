import clsx from "clsx";
import "./Button.css";

type Variant = "primary" | "secondary" | "danger" | "success" | "warning";
type Appearance = "filled" | "outline" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean;
	variant?: Variant;
	appearance?: Appearance;
};

const Button = ({
	loading,
	variant = "primary",
	appearance = "filled",
	className,
	children,
	...rest
}: Props) => {
	const baseStyles = "btn";
	const variantClass = `btn-${variant}-${appearance}`;
	const combinedClassName = clsx(baseStyles, variantClass, className);

	return (
		<button
			className={combinedClassName}
			disabled={loading || rest.disabled}
			{...rest}
		>
			{loading ? "Loading…" : children}
		</button>
	);
};

export default Button;
