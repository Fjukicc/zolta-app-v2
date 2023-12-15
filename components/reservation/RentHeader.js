import React from "react";
//ant d
import { Button, Select } from "antd";
//custom compnents
import { CustomInputWithIcon } from "../shared/input/CustomInput";

const RentHeader = ({
  setSearchRent,
  searchRent,
  employeesData,
  setSelectedEmployee,
  selectedEmployee,
}) => {
  return (
    <div className="h-16 flex flex-row justify-between w-full items-center">
      {/* left side (dropdown and search) */}
      <div className="flex flex-row items-center">
        {/* <Input placeholder="Basic usage" /> */}
        <CustomInputWithIcon value={"Search for rents"} />
        <Select
          className="ml-3"
          value={selectedEmployee}
          placeholder="Odaberi Zaposlenika"
          options={(employeesData || []).map((emp) => ({
            ...emp,
            value: emp.name,
            label: emp.name,
          }))}
        />
      </div>
      {/* right side (add new rent button) */}
      <div>
        <Button type="primary">Dodaj Rezervaciju</Button>
      </div>
    </div>
  );
};

export default RentHeader;
