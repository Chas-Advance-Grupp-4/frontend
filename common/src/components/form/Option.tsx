import React from "react";
type Props = React.OptionHTMLAttributes<HTMLOptionElement>;

const Option = (props: Props) => {
  return <option value={props.value}>{props.children}</option>;
};

export default Option;
