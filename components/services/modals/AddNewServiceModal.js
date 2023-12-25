"use client";
import React, { useState } from "react";
//ant d
import { Modal, Input, Popover } from "antd";
//custom components
import CustomInput, {
  CustomInputWithIcon,
} from "@/components/shared/input/CustomInput";
//icons
import {
  ClockCircleOutlined,
  EuroCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
//api
import { addService } from "@/services/services";

const { TextArea } = Input;

const AddNewServiceModal = ({
  isAddNewServiceModalOpen,
  setIsAddNewServiceModalOpen,
  companyId,
  handleAddNewService,
}) => {
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });
  const [allFormIsFilled, setAllFormIsFilled] = useState(true);
  const [addingServiceError, setAddingServiceError] = useState();

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
  const createNewServiceHandler = async () => {
    let service_to_add = {
      ...newService,
      company_id: companyId,
    };
    const response = await addService(service_to_add);

    if (response.success === true) {
      setAddingServiceError(null);
      setIsAddNewServiceModalOpen(false);
      resetNewService();
      handleAddNewService(newService);
    } else if (response.success === false) {
      setAddingServiceError(response.error);
    }
  };

  const handleModalOk = () => {
    if (
      newService.description &&
      newService.duration &&
      newService.name &&
      newService.price
    ) {
      setAllFormIsFilled(true);
      createNewServiceHandler();
    } else {
      setAllFormIsFilled(false);
    }
  };

  const handleModalCancel = () => {
    resetNewService();
    setIsAddNewServiceModalOpen(false);
  };
  return (
    <Modal
      title="Novi Servis"
      open={isAddNewServiceModalOpen}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
    >
      <div className=" mb-2">
        <div>Ime Servisa: </div>
        <CustomInput
          placeholder={"Ime Servisa"}
          value={newService.name}
          onChange={(text) => setNewService({ ...newService, name: text })}
        />
      </div>
      <div className="mb-4">
        <div>Opis: </div>
        <TextArea
          placeholder="Dodatna nota o rezervaciji"
          rows={4}
          value={newService.description}
          onChange={(newValue) =>
            setNewService({
              ...newService,
              description: newValue.target.value,
            })
          }
        />
      </div>
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-col">
          <div>
            Trajanje (min){" "}
            <Popover
              title={"Trajanje Servisa"}
              content={"Trajanje servisa upišite u minutama"}
            >
              <QuestionCircleOutlined />
            </Popover>
          </div>
          <CustomInputWithIcon
            value={newService.duration}
            onChange={(text) => {
              setNewService({ ...newService, duration: text });
            }}
            placeholder={"npr. 50"}
            typeNumber={true}
            icon={
              <ClockCircleOutlined
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              />
            }
          />
        </div>
        <div className="flex flex-col">
          <div>Cijena Servisa</div>
          <CustomInputWithIcon
            value={newService.price}
            onChange={(text) => {
              setNewService({ ...newService, price: text });
            }}
            placeholder={"Cijena"}
            typeNumber={true}
            icon={
              <EuroCircleOutlined
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              />
            }
          />
        </div>
      </div>
      {allFormIsFilled ? null : <p>Molimo vas, popunite sva polja!</p>}
      {addingServiceError ? (
        <div className="w-full text-red-500 flex justify-center">
          {addingServiceError}
        </div>
      ) : null}
    </Modal>
  );
};

export default AddNewServiceModal;
