import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function Button({
  loading,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      className={
        "rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 " +
        className
      }
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
