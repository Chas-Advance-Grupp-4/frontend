import Option from "../../../common/src/components/form/Option";
import Select from "../../../common/src/components/form/Select";
import { Role } from "common/src/types/auth";
import React from "react";
interface Props {
  value: Role | "no filter";
  onChange: React.ChangeEventHandler<HTMLSelectElement> | undefined;
}

const FilterUsersByRole = ({ value, onChange }: Props) => {
  return (
    <>
      <Select
        value={value}
        onChange={onChange}
        // className="w"
      >
        <Option value="no filter">
          Filter users by role
          {/* <AdjustmentsVerticalIcon className="h-6 w-6" /> */}
        </Option>
        <Option value="customer">Customer</Option>
        <Option value="admin">Admin</Option>
        <Option value="driver">Driver</Option>
      </Select>
    </>
  );
};

export default FilterUsersByRole;
