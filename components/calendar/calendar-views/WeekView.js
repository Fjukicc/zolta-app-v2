"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";

//moment js
import moment from "moment";
//frontend bl
import { calculateLabelLengthAndPositionWeek } from "../bl";
//components
import WeekViewLabel from "./view-label/WeekViewLabel";
import { CALENDAR_STATIC_VARS } from "@/static";

const WeekView = ({ labels, date, gridData, dateTimeState }) => {
  //state which will containt updated labels for printing data
  const [widthOfLabelInPx, setWidthOfLabelInPx] = useState(null);
  const [updatedLabelsForPrinting, setUpdatedLabelsForPrinting] = useState();
  const [updatedLabelsForPrintingLoading, setUpdatedLabelsForPrintingLoading] =
    useState(true);

  const containerRef = useRef(null);
  const columnRef = useRef(null);

  const [timeLine, setTimeLine] = useState(null);

  //  calculate where time line will be on calendar
  useEffect(() => {
    //date je TRENUTNI DATUM TO PROMJENI
    const current_day = moment().isoWeekday();
    var timelineWidth = CALENDAR_STATIC_VARS.timlineWidth;

    var leftPosition = 0;
    leftPosition = leftPosition;
    //check timeline left position
    if (current_day >= 1 && current_day <= 7) {
      leftPosition = (current_day - 1) * timelineWidth;
    }

    //split minutes and hours for calculations
    var dateTimeStateArray = dateTimeState.split(":");

    //calculate position of timeline on calendar
    var marginTopOfTimeline =
      parseInt("13") * CALENDAR_STATIC_VARS.tableColumnHeight +
      parseInt(dateTimeStateArray[1]) *
        (CALENDAR_STATIC_VARS.tableColumnHeight / 60) -
      CALENDAR_STATIC_VARS.calendarStart *
        CALENDAR_STATIC_VARS.tableColumnHeight;

    setTimeLine({
      left: leftPosition,
      width: timelineWidth,
      dateArray: dateTimeStateArray,
      marginTop: marginTopOfTimeline,
    });
  }, [dateTimeState]);

  // map throught labels and set additional atributes required for calendar
  useEffect(() => {
    var mappedLabels;
    if (labels && Array.isArray(labels)) {
      mappedLabels = labels?.map((item) => {
        const {
          normalizeLeftPosition,
          normalizeMarginTop,
          normalizeWidth,
          normalizedHeight,
        } = calculateLabelLengthAndPositionWeek(item);
        return {
          ...item,
          normalizeMarginTop: normalizeMarginTop,
          normalizeLeftPosition: normalizeLeftPosition,
          normalizeWidth: normalizeWidth,
          normalizedHeight: normalizedHeight,
        };
      });
      setUpdatedLabelsForPrinting(mappedLabels);
      setUpdatedLabelsForPrintingLoading(false);
    }
  }, [labels]);

  useEffect(() => {
    const updateLabelWidth = () => {
      if (columnRef.current) {
        const { width } = columnRef.current.getBoundingClientRect();
        setWidthOfLabelInPx(width);
      }
    };
    updateLabelWidth();
  }, [columnRef]);

  //only calculate new grid on date change
  const arrayOfWeek = useMemo(() => {
    const fromDate = moment(date).startOf("isoWeek");
    const newArrayOfWeek = [];

    // Generate days of the week
    for (var i = 0; i < 7; i++) {
      var generatedDate = moment(fromDate).add(i, "days");
      newArrayOfWeek.push({
        day: moment(generatedDate).format("ddd"),
        dayNumber: moment(generatedDate).format("D"),
        realDate: generatedDate.format("YYYY-MM-DD"),
        left: i + 1,
      });
    }

    return newArrayOfWeek;
  }, [date]);

  return (
    <div
      className="w-full overflow-y-scroll flex pt-4"
      style={{ userSelect: "none", maxHeight: "70vh" }}
      ref={containerRef}
    >
      {/* table for showing time */}
      <table className="w-1/12 border-collapse">
        {gridData ? (
          <tbody className="w-full">
            {gridData.map((time) => (
              <tr key={time.label} className="w-full h-24">
                <td className="pl-1 border-r border-gray-200 border-solid w-full relative">
                  <span className="absolute -top-2">{time.label}</span>
                </td>
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
      <table className="w-11/12 border-collapse">
        {gridData ? (
          <tbody className="relative w-full">
            {gridData.map((time) => (
              <tr
                key={time.label}
                className="border-t border-b w-full border-solid border-gray-200 h-24"
              >
                {/* left col for time */}
                {arrayOfWeek?.map((day, i) => {
                  if (
                    day.realDate.toString() ===
                    moment().format("YYYY-MM-DD").toString()
                  ) {
                    return (
                      <td
                        key={i}
                        className="border-b border-r border-t border-solid px-1 bg-blue-100 bg-opacity-50 hover:bg-opacity-50 hover:bg-blue-50"
                        style={{ width: `${100 / 7}%` }}
                      ></td>
                    );
                  } else {
                    return (
                      <td
                        ref={columnRef}
                        key={i}
                        className="border-b border-r hover:bg-slate-100 border-gray-200 border-solid px-1"
                        style={{ width: `${100 / 7}%` }}
                      ></td>
                    );
                  }
                })}
              </tr>
            ))}

            {/* //print timeline */}
            {timeLine
              ? parseInt("13") >= CALENDAR_STATIC_VARS.calendarStart &&
                parseInt(timeLine.dateArray[0]) <=
                  CALENDAR_STATIC_VARS.calendarEnd && (
                  <>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        position: "absolute",
                        backgroundColor: "red",
                        zIndex: 40,
                        left: timeLine.left + "%",
                        top: timeLine.marginTop - 6,
                      }}
                    />
                    <div
                      id="crta_kalendar"
                      style={{
                        width: timeLine.width + "%",
                        height: "1.7px",
                        position: "absolute",
                        zIndex: 40,
                        top: timeLine.marginTop,
                        left: timeLine.left + "%",
                        backgroundColor: "red",
                      }}
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
                  </>
                )
              : null}

            {/* print reservations and put them on the grid */}
            {!updatedLabelsForPrintingLoading &&
              updatedLabelsForPrinting?.map((label, i) => {
                let isLabelInActiveWeekDate = moment(date).isSame(
                  label.date,
                  "isoWeek"
                );

                if (isLabelInActiveWeekDate) {
                  return (
                    <WeekViewLabel
                      columnRef={columnRef}
                      containerRef={containerRef}
                      widthOfLabelInPx={widthOfLabelInPx}
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

export default WeekView;
