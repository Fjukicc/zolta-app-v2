"use client";
import React, { useState } from "react";
//ant d
import { Modal } from "antd";
import CustomInput from "@/components/shared/input/CustomInput";

const AddNewServiceModal = ({
  isAddNewServiceModalOpen,
  setIsAddNewServiceModalOpen,
  handleAddNewService,
}) => {
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  //reset
  const resetNewService = () => {
    setNewService({
      name: "",
      description: "",
      price: "",
      duration: "",
    });
  };

  //handle creating new service
  const createNewServiceHandler = () => {};

  const handleModalOk = () => {
    createNewServiceHandler();
  };

  const handleModalCancel = () => {
    resetNewService();

    setIsAddNewServiceModalOpen(false);
  };
  return (
    <Modal
      title="Dodaj Servis"
      open={isAddNewServiceModalOpen}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
    >
      <div className=" mb-2">
        <div>Ime Servisa: </div>
        <CustomInput/>
      </div>
    </Modal>
  );
};

export default AddNewServiceModal;
