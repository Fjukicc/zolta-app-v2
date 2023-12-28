"use client";
import React, { useState, useEffect } from "react";
//react swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";
//antd
import {
  Card,
  Button,
  Input,
  message,
  Checkbox,
  Popover,
  Row,
  Col,
  DatePicker,
  Alert,
  Tag,
} from "antd";
import CustomInput from "@/components/shared/input/CustomInput";
//api
import { updateServiceCategory } from "@/services/service_categories";

const SCDetails = ({ category_id }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [fillFormError, setFillFormError] = useState(false);

  const [activeServiceCategoryData, setActiveServiceCategoryData] = useState();

  //fetch service category
  const {
    data: serviceCategoryData,
    error: serviceCategoryError,
    isLoading: serviceCategoryLoading,
    mutate: mutateGetServiceCategory,
  } = useSWR(
    `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service_category?id=${category_id}`,
    fetcher
  );

  //set service data
  useEffect(() => {
    if (serviceCategoryData) {
      setActiveServiceCategoryData(serviceCategoryData[0]);
    }
  }, [serviceCategoryData]);

  //on save button press
  const onSaveButtonPress = async () => {
    if (activeServiceCategoryData.name !== "") {
      setFillFormError(false);
      let new_service_category = {
        name: activeServiceCategoryData.name,
        id: category_id,
        company_id: serviceCategoryData.company_id,
      };
      const result = await updateServiceCategory(new_service_category);

      if (result.success === true) {
        await mutateGetServiceCategory();
        successUpdateServiceCategory();
      } else if (result.success === false) {
        errorUpdateServiceCategory();
      }
    } else {
      setFillFormError(true);
    }
  };

  //messages for updating service
  const successUpdateServiceCategory = () => {
    messageApi.open({
      type: "success",
      content: "Uspješno ste ažurirali kategoriju servisa :)",
    });
  };
  const errorUpdateServiceCategory = () => {
    messageApi.open({
      type: "error",
      content: "Problem u ažuriranju kategorije servisa",
    });
  };
  return (
    <>
      {contextHolder}
      {activeServiceCategoryData && (
        <Card title="Informacije o Kategoriji Servisa" bordered={false}>
          <div className="w-full flex h-full justify-start flex-col">
            <Row gutter={16} className="">
              <Col span={12} className="text-left">
                <label>Ime Servisa</label>
                <CustomInput
                  value={activeServiceCategoryData.name}
                  onChange={(text) => {
                    setActiveServiceCategoryData({
                      ...activeServiceCategoryData,
                      name: text,
                    });
                  }}
                />
              </Col>
            </Row>
            {fillFormError && (
              <Alert
                className="mt-2 mb-4"
                message="Molimo popunite sva polja!"
                type="error"
                showIcon
              />
            )}
            <Row gutter={16} className="mb-2">
              <Col span={24} className="flex flex-row justify-end">
                <Button className="mr-3" type="primary" danger>
                  Resetiraj
                </Button>
                <Button onClick={onSaveButtonPress} type="primary">
                  Spremi
                </Button>
              </Col>
            </Row>
          </div>
        </Card>
      )}
    </>
  );
};

export default SCDetails;
