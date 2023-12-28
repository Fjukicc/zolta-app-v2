"use client";
import React from "react";
//ant d
import { Modal, Alert } from "antd";

const AddEmployeModal = ({
  isAddEmployeeModalOpen,
  setIsAddEmployeeModalOpen,
}) => {
  const handleModalCancel = () => {
    setIsAddEmployeeModalOpen(false);
  };

  const handleModalOk = () => {
    setIsAddEmployeeModalOpen(false);
  };
  return (
    <Modal
      title="Novi Zaposlenik"
      open={isAddEmployeeModalOpen}
      onCancel={handleModalCancel}
      onOk={handleModalOk}
    ></Modal>
  );
};

export default AddEmployeModal;
