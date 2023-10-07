"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import moment from "moment";
import { calculateLabelLengthAndPositionWeek } from "../bl";
//components
import WeekViewLabel from "./view-label/WeekViewLabel";

const WeekView = ({ setLabels, labels, date, gridData }) => {
  //state which will containt updated labels for printing data
  const [updatedLabelsForPrinting, setUpdatedLabelsForPrinting] = useState();

  useEffect(() => {
    var mappedLabels;

    mappedLabels = labels.map((item) => {
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
  }, []);

  const containerRef = useRef(null);
  const columnRef = useRef(null);

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
      className="w-full overflow-y-scroll"
      style={{ userSelect: "none", maxHeight: "60vh" }}
      ref={containerRef}
    >
      <table className="w-full border-collapse">
        {gridData ? (
          <tbody className="relative w-full">
            {gridData.map((time) => (
              <tr
                key={time.label}
                className="border-t border-b border-solid border-gray-200 h-24"
              >
                {/* left col for time */}
                <td className="pl-1 border-r border-gray-200 border-solid w-1/12">
                  {time.label}
                </td>
                {arrayOfWeek?.map((day, i) => {
                  if (
                    day.realDate.toString() ===
                    moment().format("YYYY-MM-DD").toString()
                  ) {
                    return (
                      <td
                        key={i}
                        className="border-b border-r bg-blue-200 hover:bg-blue-100 border-gray-200 border-solid px-1"
                      ></td>
                    );
                  } else {
                    return (
                      <td
                        ref={columnRef}
                        key={i}
                        className="border-b border-r hover:bg-slate-100 border-gray-200 border-solid px-1"
                      ></td>
                    );
                  }
                })}
              </tr>
            ))}

            {/* print reservations and put them on the grid */}
            {updatedLabelsForPrinting?.map((label, i) => {
              const isLabelInActiveWeekDate = moment(date).isSame(
                label.date,
                "isoWeek"
              );

              if (isLabelInActiveWeekDate) {
                return (
                  <WeekViewLabel
                    columnRef={columnRef}
                    setLabels={setLabels}
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

export default WeekView;
