import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;
const Input = (props: Props) => {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg shadow-md  border-gray-300 px-3 py-2 focus:border-blue-600 focus:outline-none placeholder:text-gray-500" +
        (props.className || "")
      }
    />
  );
};

export default Input;
