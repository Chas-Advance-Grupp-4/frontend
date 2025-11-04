import React from "react";
type Props = React.SelectHTMLAttributes<HTMLSelectElement>;
const Select = (props: Props) => {
  return (
    <select
      className="rounded p-2 w-full shadow-md placeholder:text-gray-500"
      value={props.value}
      onChange={props.onChange}
      {...props}
    >
      {props.children}
    </select>
  );
};

export default Select;
