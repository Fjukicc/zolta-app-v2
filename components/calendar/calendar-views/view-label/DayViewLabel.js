"use client";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import moment from "moment";
import { FiMove } from "react-icons/fi";

//components
import OnDragConfrimModal from "../../modal/OnDragConfrimModal";

const DayViewLabel = ({ label, containerRef }) => {
  const elementRef = useRef(null);
  //labal data so we can mutate it while draggin and on finish everything will be updated
  const [labelData, setLabelData] = useState(label);

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

  //DRAG MODAL HANDLER FUNCTIONS
  const showDragModal = () => {
    setConfirmDragModalVisible(true);
  };

  const cancelModal = () => {
    setConfirmDragModalVisible(false);
    console.log(label);
    setLabelData(label);
    setYCoordinate(0);
  };

  const onDragModalSubmitClick = () => {
    //update database
  };

  //on drag end show modal
  const handleDragEnd = () => {
    showDragModal(true);
  };
  return (
    <>
      <Draggable
        position={{ x: 0, y: yCoordinate }}
        handle="strong"
        bounds="parent"
        onDrag={handleDrag}
        onStop={handleDragEnd}
        axis="y"
        grid={[24, 24]}
      >
        <div
          className="flex flex-col absolute p-2 overflow-hidden w-11/12 right-0 rounded-lg shadow bg-fuchsia-300 border-green-400"
          ref={elementRef}
          style={{
            top: labelData.normalizeMarginTop,
            height: labelData.normalizedTimeDifference,
          }}
        >
          <div className="flex w-full flex-row justify-center items-center">
            <strong className="p-2 hover:bg-green-300 cursor-grab">
              <FiMove />
            </strong>
          </div>
          <div className="flex flex-row box no-cursor w-full justify-between">
            <span className="font-bold">{labelData.service_name}</span>
            <div>
              <span>
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
        />
      )}
    </>
  );
};

export default DayViewLabel;
