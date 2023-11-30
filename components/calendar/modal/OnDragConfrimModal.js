import React from "react";
import { Modal } from "antd";

//custom components
import PrimaryButton from "@/components/buttons/PrimaryButton";

const OnDragConfrimModal = ({
  cancelModal,
  confirmDragModalVisible,
  onDragModalSubmitClick,
  newLabel,
  oldLabel,
  isWeek = false,
}) => {
  return (
    <Modal
      title="Basic Modal"
      open={confirmDragModalVisible}
      onOk={onDragModalSubmitClick}
      onCancel={cancelModal}
      footer={
        <div className="flex flex-row w-100 justify-end" key="Cancel">
          <PrimaryButton title="Cancel" onClick={cancelModal} />
          <div className="pl-1" />
          <PrimaryButton
            key="Submit"
            title={"Submit"}
            onClick={onDragModalSubmitClick}
          />
        </div>
      }
    >
      <h1>Creating Changes</h1>
      {/* TIME CHANGES*/}
      <p>{oldLabel.start_time + "->" + newLabel.start_time}</p>
      <p>{oldLabel.end_time + "->" + newLabel.end_time}</p>
      {/* DATE CHANGES */}
      {isWeek === true && <p>{oldLabel.date + "->" + newLabel.date}</p>}
    </Modal>
  );
};

export default OnDragConfrimModal;
