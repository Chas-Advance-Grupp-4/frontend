import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none " +
        (props.className || "")
      }
    />
  );
}
