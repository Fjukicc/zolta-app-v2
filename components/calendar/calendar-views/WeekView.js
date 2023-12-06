"use client";
import React, {
  useRef,
  useMemo,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import moment from "moment";
import { calculateLabelLengthAndPositionWeek } from "../bl";
//components
import WeekViewLabel from "./view-label/WeekViewLabel";

const WeekView = ({ labels, date, gridData }) => {
  //state which will containt updated labels for printing data
  const [updatedLabelsForPrinting, setUpdatedLabelsForPrinting] = useState();
  const [updatedLabelsForPrintingLoading, setUpdatedLabelsForPrintingLoading] =
    useState(true);

  // map throught labels and set additional atributes required for calendar
  useEffect(() => {
    var mappedLabels;
    if (labels !== null) {
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
      setUpdatedLabelsForPrintingLoading(false);
    }
  }, [labels]);

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
