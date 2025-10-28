import { Role } from "common/src/types/auth";
import React from "react";
interface Props {
  value: Role | "no filter",
  onChange: 
  React.ChangeEventHandler<HTMLSelectElement> | undefined
}

const FilterUsersByRole = ({ value, onChange }: Props) => {
  return (
    <>
      <select className="border rounded p-2 " value={value} onChange={onChange}>
        <option value="no filter">
          Filter users by role
          {/* <AdjustmentsVerticalIcon className="h-6 w-6" /> */}
        </option>
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
        <option value="driver">Driver</option>
      </select>
    </>
  );
};

export default FilterUsersByRole;
