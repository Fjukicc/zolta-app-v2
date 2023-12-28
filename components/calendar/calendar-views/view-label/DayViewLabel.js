"use client";
import React, { useRef, useState } from "react";
//draggable react
import Draggable from "react-draggable";
//moment js
import moment from "moment";
//ant d
import { Tag } from "antd";

//modals
import OnDragConfrimModal from "../../modal/OnDragConfrimModal";

const DayViewLabel = ({ label, containerRef }) => {
  const elementRef = useRef(null);
  //labal data so we can mutate it while draggin and on finish everything will be updated
  const [labelData, setLabelData] = useState(label);

  //is label beeing dragged
  const [isDragging, setIsDragging] = useState(false);

  //follow y cord (iskreno mislim da je bespotrebno al ok)
  const [yCoordinate, setYCoordinate] = useState(0);

  const [confirmDragModalVisible, setConfirmDragModalVisible] = useState(false);

  const handleDrag = (_, ui) => {
    // Calculate the new Y-coordinate with grid snapping
    setYCoordinate(ui.y);

    const container = containerRef.current;
    const element = elementRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    if (elementRect.top < containerRect.top) {
      // Scrolling up
      container.scrollTop -= 20; // Adjust the scrolling speed if needed
    } else if (elementRect.bottom > containerRect.bottom) {
      // Scrolling down
      container.scrollTop += 20; // Adjust the scrolling speed if needed
    }

    calculateNewStartTime(parseInt(ui.y));
  };

  //start dragging helper function
  const handleStart = () => {
    setIsDragging(true);
  };

  //on drag end show modal and hide label
  const handleDragEnd = () => {
    setIsDragging(false);
    showDragModal();
  };

  //calculate new start time when component is dragged
  function calculateNewStartTime(offset) {
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

  //DRAG MODAL HANDLER FUNCTIONS
  const showDragModal = () => {
    setConfirmDragModalVisible(true);
  };

  const cancelModal = () => {
    setConfirmDragModalVisible(false);
    setLabelData(label);
    setYCoordinate(0);
  };

  const onDragModalSubmitClick = () => {
    //update database
  };

  return (
    <>
      {/* static label that is shown for dragging purposes */}
      {isDragging && (
        <div
          className="flex flex-col absolute p-2 overflow-hidden w-11/12 right-0 rounded-lg shadow bg-fuchsia-300 border-green-400"
          style={{
            top: label.normalizeMarginTop,
            height: label.normalizedTimeDifference,
            opacity: isDragging ? 0.5 : 1,
          }}
        ></div>
      )}

      {/* draggable component */}
      <Draggable
        position={{ x: 0, y: yCoordinate }}
        bounds="parent"
        onDrag={handleDrag}
        onStop={handleDragEnd}
        onStart={handleStart}
        axis="y"
        grid={[24, 24]}
      >
        <div
          className="cursor-pointer flex flex-col absolute p-2 overflow-hidden w-11/12 right-0 rounded-lg shadow bg-fuchsia-300 border-green-400"
          ref={elementRef}
          style={{
            top: labelData.normalizeMarginTop,
            height: labelData.normalizedTimeDifference,
            justifyContent:
              parseInt(label.normalizedTimeDifference) > 48 ? null : "center",
          }}
        >
          <div
            className="flex box no-cursor items-start"
            style={{
              flexDirection:
                parseInt(label.normalizedTimeDifference) > 48
                  ? "column"
                  : "row",
              justifyContent:
                parseInt(label.normalizedTimeDifference) > 48
                  ? "flex-start"
                  : null,
            }}
          >
            {/* name of the customer */}
            <div className="mb-1 font-light text-sm">{labelData.name}</div>
            
            {/* label time */}
            <div>
              <span>
                {moment(labelData.start_time, "HH:mm:ss")
                  .format("HH:mm")
                  .toString()}
              </span>
              -
              <span>
                {moment(labelData.end_time, "HH:mm:ss")
                  .format("HH:mm")
                  .toString()}
              </span>
            </div>

            {/* service or services */}
            <div className="flex flex-row">
              {labelData.services.map((service) => {
                return (
                  <Tag key={service} className="mr-2" color="#2db7f5">
                    {service.name}
                  </Tag>
                );
              })}
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
        />
      )}
    </>
  );
};

export default DayViewLabel;
