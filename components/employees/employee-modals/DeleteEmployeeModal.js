"use client";
import React from "react";
//ant d
import { Modal, Alert } from "antd";

const DeleteEmployeeModal = ({
  isDeleteEmployeeModalOpen,
  setIsDeleteEmployeeModalOpen,
  record,
  setRecordToDelete,
}) => {
  const handleModalCancel = () => {
    setIsDeleteEmployeeModalOpen(false);
    setRecordToDelete(null);
  };

  const handleModalOk = () => {
    setIsDeleteEmployeeModalOpen(false);
  };
  return (
    <Modal
      title="Brisanje Zaposlenika"
      open={isDeleteEmployeeModalOpen}
      onCancel={handleModalCancel}
      onOk={handleModalOk}
    >
      <div className="mt-3" />

      {/* Name of a person that is making the reservation */}
      <div className=" text-lg font-semibold text-red-500">
        Jeste li siguni da želite izbrisati zaposlenika {record?.name}?
      </div>
      <div className="mt-2 text-md font-medium">
        Brisanje zaposlenika će uzrokovati nemogučnost dodavanja novih
        rezervacija na njegovo ime.
      </div>
      <div className="">
        Brisanje je moguće ukoliko zaposlenik nema budućih rezervacija.
      </div>
    </Modal>
  );
};

export default DeleteEmployeeModal;
