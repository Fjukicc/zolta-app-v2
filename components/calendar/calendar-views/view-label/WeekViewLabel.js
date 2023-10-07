"use client";
import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import moment from "moment";
import { FiMove } from "react-icons/fi";

const WeekViewLabel = ({ setLabels, label, containerRef, columnRef }) => {
  const elementRef = useRef(null);
  const [labelData, setLabelData] = useState(label);
  const [widthOfLabelInPx, setWidthOfLabelInPx] = useState(null);

  const [yCoordinate, setYCoordinate] = useState(0);
  const [xCoordinate, setXCoordinate] = useState(0);

  //get one column width in px
  useEffect(() => {
    if (columnRef.current) {
      const { width } = columnRef.current.getBoundingClientRect();
      setWidthOfLabelInPx(width);
    }
  }, []);

  const handleDrag = (_, ui) => {
    var can_go_left = calculateDate(parseInt(ui.x));

    if(can_go_left){
      setXCoordinate(ui.x);
    }
    setYCoordinate(ui.y);

    const container = containerRef.current;
    const element = elementRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    if (elementRect.top < containerRect.top) {
      // Scrolling up
      container.scrollTop -= 21; // Adjust the scrolling speed if needed
    } else if (elementRect.bottom > containerRect.bottom) {
      // Scrolling down
      container.scrollTop += 21; // Adjust the scrolling speed if needed
    }

    calculateStartTime(parseInt(ui.y));
  };

  function calculateStartTime(offset) {
    const addMinutes = (offset / 96) * 60;

    //always has first and last time of reservation based on static offset
    let first_time_static = moment(label.start_time, "HH:mm:ss");
    let last_time_static = moment(label.end_time, "HH:mm:ss");

    const final_start_time = moment(first_time_static, "HH:mm:ss")
      .add(addMinutes, "minutes")
      .format("HH:mm:ss")
      .toString();

    const final_last_time = moment(last_time_static, "HH:mm:ss")
      .add(addMinutes, "minutes")
      .format("HH:mm:ss")
      .toString();

    setLabelData({
      ...labelData,
      start_time: final_start_time,
      end_time: final_last_time,
    });
  }

  function calculateDate(offset) {
    debugger;
    const addDate = Math.round(offset / widthOfLabelInPx);
    console.log(addDate);

    //this is original labels date
    var dateObj = moment(label.date);
    const dayOfWeek = dateObj.day() === 0 ? 6 : dateObj.day() - 1;
    console.log(dayOfWeek);
    let canGoLeftMax = parseInt(dayOfWeek) * (-1) * parseInt(widthOfLabelInPx);
    if(offset < canGoLeftMax){
      return false;
    }
    else{
      return true;
    }
  }

  return (
    widthOfLabelInPx !== null && (
      <Draggable
        onDrag={handleDrag}
        bounds="parent"
        axis="both"
        grid={[widthOfLabelInPx, 24]}
        position={{ x: xCoordinate, y: yCoordinate }}
      >
        <div
          className="flex flex-col absolute p-2 overflow-hidden rounded-lg shadow bg-fuchsia-300 border-green-400"
          ref={elementRef}
          style={{
            top: labelData.normalizeMarginTop,
            left: `${labelData.normalizeLeftPosition}%`,
            width: `${labelData.normalizeWidth}%`,
            height: labelData.normalizedHeight,
          }}
        ></div>
      </Draggable>
    )
  );
};

export default WeekViewLabel;
