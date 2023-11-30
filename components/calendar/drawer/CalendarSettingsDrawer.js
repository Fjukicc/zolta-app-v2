import React, { useEffect, useState } from "react";
import { Drawer, Checkbox } from "antd";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const CalendarSettingsDrawer = ({
  settingsDrawerOpen,
  onSettingsDrawerClose,
  calendarSettingsCopy,
  setCalendarSettingsCopy,
}) => {
  const changeCalendarSettingsHandler = (e) => {
    setCalendarSettingsCopy({
      ...calendarSettingsCopy,
      showWeekends: e.target.checked,
    });
  };
  return (
    <Drawer
      title="Calendar Settings"
      placement="right"
      onClose={onSettingsDrawerClose}
      open={settingsDrawerOpen}
    >
      {calendarSettingsCopy && (
        <div className="flex flex-col w-full">
          <Checkbox
            checked={calendarSettingsCopy.showWeekends}
            onChange={changeCalendarSettingsHandler}
          >
            Prikaži Vikende
          </Checkbox>
          <Checkbox
            checked={calendarSettingsCopy.showWeekends}
            onChange={changeCalendarSettingsHandler}
          >
            Puni zaslon
          </Checkbox>
          <hr className="mb-4 mt-4"/>
          <PrimaryButton title={"Save"}/>
        </div>
      )}
    </Drawer>
  );
};

export default CalendarSettingsDrawer;
