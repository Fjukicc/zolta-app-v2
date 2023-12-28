"use client";
import React, { useState } from "react";
//ant d
import { Modal, Alert } from "antd";
//custom components
import CustomInput from "@/components/shared/input/CustomInput";
// api
import { addServiceCategory } from "@/services/service_categories";

const AddServiceCategoryModal = ({
  isAddServiceCategoryModalOpen,
  setIsAddServiceCategoryModalOpen,
  session,
  handleAddingNewServiceCategory,
}) => {
  const [newServiceCategory, setNewServiceCategory] = useState({
    name: "",
  });
  const [fillAllFieldsError, setFillAllFieldError] = useState(false);
  const [errorAddingCategory, setErrorAddingCategory] = useState("");

  const handleModalCancel = () => {
    setFillAllFieldError(false);
    resetServiceCategory();
    setIsAddServiceCategoryModalOpen(false);
  };
  const handleModalOk = () => {
    console.log(newServiceCategory.name);
    if (newServiceCategory.name !== "") {
      setFillAllFieldError(false);
      createServiceCategoryHandler();
    } else {
      setFillAllFieldError(true);
    }
  };

  const createServiceCategoryHandler = async () => {
    let new_service_category = {
      ...newServiceCategory,
      company_id: session.user.company_id,
    };
    const result = await addServiceCategory(new_service_category);
    if (result.success === true) {
      setErrorAddingCategory("");
      handleAddingNewServiceCategory(new_service_category);
      resetServiceCategory();
      setIsAddServiceCategoryModalOpen(false);
    } else if (result.success === false) {
      setErrorAddingCategory(result.error);
      resetServiceCategory();
    }
  };

  const resetServiceCategory = () => {
    setNewServiceCategory({
      name: "",
    });
  };
  return (
    <Modal
      title="Nova Kategorija Servisa"
      open={isAddServiceCategoryModalOpen}
      onCancel={handleModalCancel}
      onOk={handleModalOk}
    >
      <div className="mt-2" />

      {/* Name of a person that is making the reservation */}
      <div className="mb-2">
        <div className="mb-1">Ime Kategorije Servisa:</div>
        <CustomInput
          placeholder="Ime Kategorije Servisa"
          value={newServiceCategory.name}
          onChange={(text) => {
            setNewServiceCategory({ ...newServiceCategory, name: text });
          }}
        />
      </div>
      {fillAllFieldsError === true && (
        <Alert
          className="mb-4"
          message="Molimo vas unesite sva polja!"
          type="error"
        />
      )}
      {errorAddingCategory !== "" && (
        <Alert
          className="mb-4"
          message="Trenutno nemožemo dodati kategoriju :(!"
          type="error"
        />
      )}
    </Modal>
  );
};

export default AddServiceCategoryModal;
