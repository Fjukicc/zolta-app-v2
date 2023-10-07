"use client";
import React, { useRef, useEffect, useState } from "react";
import { calculateLabelLengthAndPositionDay } from "../bl";
// moment js
import moment from "moment";
//components
import DayViewLabel from "./view-label/DayViewLabel";

const DayView = ({ gridData, date, labels, setLabels }) => {
  //state which will containt updated labels for printing data
  const [updatedLabelsForPrinting, setUpdatedLabelsForPrinting] = useState(null);

  useEffect(() => {
    var mappedLabels;

    mappedLabels = labels.map((item) => {
      const { normalizeMarginTop, normalizedTimeDifference } =
        calculateLabelLengthAndPositionDay(item);
      return {
        ...item,
        normalizeMarginTop: normalizeMarginTop,
        normalizedTimeDifference: normalizedTimeDifference,
      };
    });

    setUpdatedLabelsForPrinting(mappedLabels)
  }, []);
  const containerRef = useRef(null);
  return (
    <div
      className="w-full overflow-y-scroll"
      style={{ userSelect: "none", maxHeight: "60vh" }}
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

            {/* print reservations and put them on the grid */}
            {updatedLabelsForPrinting?.map((label, i) => {
              if (date === moment(label.date).format("YYYY-MM-DD")) {
                return (
                  <DayViewLabel
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

export default DayView;
