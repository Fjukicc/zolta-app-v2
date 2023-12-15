"use client";
import React, { useRef, useEffect, useState } from "react";
import { calculateLabelLengthAndPositionDay } from "../bl";
// moment js
import moment from "moment";

//components
import DayViewLabel from "./view-label/DayViewLabel";
//static
import { CALENDAR_STATIC_VARS } from "@/static";

const DayView = ({ gridData, date, labels, dateTimeState }) => {
  //state which will containt updated labels for printing data
  const [updatedLabelsForPrinting, setUpdatedLabelsForPrinting] =
    useState(null);
  const [updatedLabelsForPrintingLoading, setUpdatedLabelsForPrintingLoading] =
    useState(true);

  //state for local day line
  const [timeLine, setTimeLine] = useState(null);

  //  calculate where time line will be on calendar
  useEffect(() => {
    var dateTimeStateArray = dateTimeState.split(":");
    //calculate position of timeline on calendar
    var marginTopOfTimeline =
      parseInt(dateTimeStateArray[0]) * CALENDAR_STATIC_VARS.tableColumnHeight +
      parseInt(dateTimeStateArray[1]) *
        (CALENDAR_STATIC_VARS.tableColumnHeight / 60) -
      CALENDAR_STATIC_VARS.calendarStart *
        CALENDAR_STATIC_VARS.tableColumnHeight;

    setTimeLine({
      dateArray: dateTimeStateArray,
      marginTop: marginTopOfTimeline,
    });
  }, [dateTimeState]);

  useEffect(() => {
    var mappedLabels;
    if (labels && Array.isArray(labels)) {
      mappedLabels = labels.map((item) => {
        const { normalizeMarginTop, normalizedTimeDifference } =
          calculateLabelLengthAndPositionDay(item);
        return {
          ...item,
          normalizeMarginTop: normalizeMarginTop,
          normalizedTimeDifference: normalizedTimeDifference,
        };
      });

      setUpdatedLabelsForPrinting(mappedLabels);
      setUpdatedLabelsForPrintingLoading(false);
    }
  }, [labels]);

  const containerRef = useRef(null);
  return (
    <div
      className="w-full overflow-y-scroll"
      style={{ userSelect: "none", maxHeight: "70vh" }}
      ref={containerRef}
    >
      <table className="w-full border-collapse">
        {/* print day grid on calendar */}
        {gridData ? (
          <tbody className="relative w-full">
            {gridData.map((time) => (
              <tr
                key={time.label}
                className="border-t border-b border-gray-200 border-solid h-24 hover:bg-slate-100"
              >
                <td className="pl-1 border-r border-gray-200 border-solid w-1/12">
                  {time.label}
                </td>
                <td className="border-t border-b border-r border-gray-200 border-solid px-6"></td>
              </tr>
            ))}

            {timeLine
              ? parseInt(timeLine.dateArray[0]) >=
                  CALENDAR_STATIC_VARS.calendarStart &&
                parseInt(timeLine.dateArray[0]) <=
                  CALENDAR_STATIC_VARS.calendarEnd && (
                  <div
                    id="crta_kalendar"
                    style={{
                      height: "1.7px",
                      position: "absolute",
                      top: timeLine.marginTop,
                      right: 0,
                      zIndex: 999,
                      backgroundColor: "red",
                    }}
                    className="w-11/12"
                  >
                    <div
                      style={{
                        color: "red",
                        marginTop: 4,
                        marginleft: 8,
                      }}
                    >
                      {dateTimeState.toString()}
                    </div>
                  </div>
                )
              : null}

            {/* print reservations and put them on the grid */}
            {!updatedLabelsForPrintingLoading &&
              updatedLabelsForPrinting?.map((label, i) => {
                if (date === moment(label.date).format("YYYY-MM-DD")) {
                  return (
                    <DayViewLabel
                      containerRef={containerRef}
                      id={label}
                      key={i}
                      label={label}
                    />
                  );
                } else {
                  return;
                }
              })}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};

export default DayView;
