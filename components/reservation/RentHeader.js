"use client";
import React, { useState } from "react";
//ant d
import { Button, Select, Checkbox, DatePicker } from "antd";
//custom compnents
import { CustomInputWithIcon } from "../shared/input/CustomInput";

const { RangePicker } = DatePicker;

const RentHeader = ({
  setSearchRent,
  searchRent,
  employeesData,
  setSelectedEmployee,
  selectedEmployee,
  setIsAddReservationModalOpen,
}) => {
  const [isIntervalCheckboxClicked, setIsIntervakCheckboxClicked] =
    useState(false);
  //is checkbox for multiple dates checked
  const onIntervalPickChange = (e) => {
    setIsIntervakCheckboxClicked(e.target.checked);
  };

  return (
    <div className="h-16 flex flex-row justify-between w-full items-center">
      {/* left side (dropdown and search) */}
      <div className="flex flex-row items-center">
        {/* <Input placeholder="Basic usage" /> */}
        <CustomInputWithIcon value={"Search for rents"} />
        <Select
          className="ml-3 mr-3"
          value={selectedEmployee}
          placeholder="Odaberi Zaposlenika"
          options={(employeesData || []).map((emp) => ({
            ...emp,
            value: emp.name,
            label: emp.name,
          }))}
        />
        <Checkbox
          checked={isIntervalCheckboxClicked}
          onChange={onIntervalPickChange}
        >
          Range Dates
        </Checkbox>
        {!isIntervalCheckboxClicked ? <DatePicker /> : <RangePicker />}
      </div>
      {/* right side (add new rent button) */}
      <div>
        <Button onClick={()=>setIsAddReservationModalOpen(true)} type="primary">Dodaj Rezervaciju</Button>
      </div>
    </div>
  );
};

export default RentHeader;
