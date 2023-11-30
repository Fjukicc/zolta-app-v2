"use client";
import React, { useState, useRef, useEffect } from "react";
// react draggable
import Draggable from "react-draggable";
//moment js
import moment from "moment";
//ant d
import { Tag } from "antd";
//modals
import OnDragConfrimModal from "../../modal/OnDragConfrimModal";

const WeekViewLabel = ({ label, containerRef, columnRef }) => {
  //REFS
  const elementRef = useRef(null);

  const [labelData, setLabelData] = useState(label);
  const [widthOfLabelInPx, setWidthOfLabelInPx] = useState(null);

  const [confirmDragModalVisible, setConfirmDragModalVisible] = useState(false);

  //is label beeing dragged
  const [isDragging, setIsDragging] = useState(false);

  const [yCoordinate, setYCoordinate] = useState(0);
  const [xCoordinate, setXCoordinate] = useState(0);

  //get one column width in px
  useEffect(() => {
    const updateLabelWidth = () => {
      if (columnRef.current) {
        const { width } = columnRef.current.getBoundingClientRect();
        setWidthOfLabelInPx(width);
      }
    };
    updateLabelWidth();
  }, [columnRef]);

  // // REINITIALIZE CALENDAR ON RESIZE
  // const handleResize = () => {
  //   updateLabelWidth();
  // };

  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const handleDrag = (_, ui) => {
    setXCoordinate(ui.x);
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

    let { final_start_time, final_last_time } = calculateStartTime(
      parseInt(ui.y)
    );
    let { finalDate } = calculateDate(parseInt(ui.x));

    // set new label
    setLabelData({
      ...labelData,
      start_time: final_start_time,
      end_time: final_last_time,
      date: moment(finalDate).format("YYYY-MM-DD").toString(),
    });
  };

  //on drag start helper function
  const onDragStart = () => {
    setIsDragging(true);
  };

  //on drag end helper function
  const onDragEnd = () => {
    if (xCoordinate === 0 && yCoordinate === 0) {
    } else {
      showDragModal();
    }
    setIsDragging(false);
  };

  //calculate the new time of the label
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

    return { final_start_time, final_last_time };
  }

  //calculate the new date of the label
  function calculateDate(offset) {
    const addDate = Math.round(offset / widthOfLabelInPx);
    //add add date (how much label has moved) to original label date
    let finalDate = moment(label.date).add(addDate, "day");

    return { finalDate };
  }

  //DRAG MODAL HANDLER FUNCTIONS
  const showDragModal = () => {
    setConfirmDragModalVisible(true);
  };

  const cancelModal = () => {
    setConfirmDragModalVisible(false);
    setLabelData(label);
    setYCoordinate(0);
    setXCoordinate(0);
  };

  const onDragModalSubmitClick = () => {
    //update database
  };

  return (
    widthOfLabelInPx !== null && (
      <>
        {isDragging && (
          <div
            className="flex flex-col absolute p-2 overflow-hidden cursor-pointer rounded-md shadow bg-fuchsia-300 border-green-400"
            style={{
              top: label.normalizeMarginTop,
              left: `${label.normalizeLeftPosition}%`,
              width: `${label.normalizeWidth}%`,
              height: label.normalizedHeight,
              opacity: isDragging ? 0.5 : 1,
            }}
          ></div>
        )}
        <Draggable
          onDrag={handleDrag}
          bounds="parent"
          onStart={onDragStart}
          onStop={onDragEnd}
          axis="both"
          grid={[widthOfLabelInPx, 24]}
          position={{ x: xCoordinate, y: yCoordinate }}
        >
          <div
            className="flex flex-col absolute p-1 overflow-hidden cursor-pointer rounded-md shadow bg-fuchsia-300 border-green-400"
            ref={elementRef}
            style={{
              top: labelData.normalizeMarginTop,
              left: `${labelData.normalizeLeftPosition}%`,
              width: `${labelData.normalizeWidth}%`,
              height: labelData.normalizedHeight,
            }}
          >
            {/* inner container */}
            <div
              className="flex box no-cursor items-start"
              style={{
                flexDirection:
                  parseInt(label.normalizedHeight) > 48 ? "column" : "row",
                justifyContent:
                  parseInt(label.normalizedHeight) > 48 ? "flex-start" : null,
              }}
            >
              {/* service or services */}
              <div className="flex">
                {labelData.service_name.map((service) => {
                  return (
                    <Tag key={service} className="mr-1" color="#2db7f5">
                      {service}
                    </Tag>
                  );
                })}
              </div>

              {/* label time */}
              <div>
                <span
                  style={{
                    fontSize: parseInt(label.normalizedHeight) > 48 ? 14 : 14,
                  }}
                >
                  {moment(labelData.start_time, "HH:mm:ss")
                    .format("HH:mm:ss")
                    .toString()}
                </span>
                -
                <span>
                  {moment(labelData.end_time, "HH:mm:ss")
                    .format("HH:mm:ss")
                    .toString()}
                </span>
              </div>
            </div>
          </div>
        </Draggable>
        {confirmDragModalVisible && (
          <OnDragConfrimModal
            onDragModalSubmitClick={onDragModalSubmitClick}
            cancelModal={cancelModal}
            confirmDragModalVisible={confirmDragModalVisible}
            newLabel={labelData}
            oldLabel={label}
            isWeek={true}
          />
        )}
      </>
    )
  );
};

export default WeekViewLabel;
