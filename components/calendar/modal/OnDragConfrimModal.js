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
          <div className="pl-1"/>
          <PrimaryButton
            key="Submit"
            title={"Submit"}
            onClick={onDragModalSubmitClick}
          />
        </div>
      }
    >
      <h1>Creating Changes</h1>
      <p>
        {
          oldLabel.start_time + "->" + newLabel.start_time
        }
      </p>
      <p>
        {
          oldLabel.end_time + "->" + newLabel.end_time
        }
      </p>
    </Modal>
  );
};

export default OnDragConfrimModal;
