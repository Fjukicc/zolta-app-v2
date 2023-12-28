"use client";
import React, { useState, useEffect } from "react";
//ant d
import { Table, Button, Tag, Popconfirm, message } from "antd";
//icons
import { MdOutlineCategory } from "react-icons/md";
//swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";
//session
import { useSession } from "next-auth/react";
//next link
import Link from "next/link";
//api
import { deleteServiceCategory } from "@/services/service_categories";

//custom components
import ServicesSubtable from "./components/ServicesSubtable";
import Header from "./components/Header";
import AddServiceCategoryModal from "./modals/AddServiceCategoryModal";

const { Column } = Table;

const ServicCategories = () => {
  //session
  const { data: session, status: sessionStatus } = useSession();

  //for messages
  const [messageApi, contextHolder] = message.useMessage();

  //fetch service categories
  const {
    data: serviceCategoriesData,
    error: serviceCategoriesError,
    isLoading: serviceCategoriesLoading,
    mutate: mutateServiceCategories,
  } = useSWR(
    session
      ? `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service_category?company_id=${session.user.company_id}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const [isAddServiceCategoryModalOpen, setIsAddServiceCategoryModalOpen] =
    useState(false);

  const successMessage = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const errorMessage = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  //show success message when new service is created
  const successAddingNewServiceCategory = (service_category) => {
    messageApi.open({
      type: "success",
      content: `Uspješno ste dodali novu kategoriju servisa: ${service_category.name} `,
    });
  };

  const handleAddingNewServiceCategory = async (service_category) => {
    successAddingNewServiceCategory(service_category);
    await mutateServiceCategories();
  };

  const onDeleteServiceCategoryClick = async (record) => {
    const category_id = record.id;
    const result = await deleteServiceCategory(category_id);
    if (result.success === true) {
      successMessage(`Izbrisana kategorija servisa: ${record.name}`);
      await mutateServiceCategories();
    } else if (result.success === false) {
      errorMessage(`Nemožemo izbrisati kategoriju servisa: ${record.name}`);
    }
  };

  if (serviceCategoriesLoading === true) {
    return "Loading...";
  }

  return (
    <div className=" w-full min-h-full pl-6 pr-6 pt-1">
      {contextHolder}
      <Header
        setIsAddServiceCategoryModalOpen={setIsAddServiceCategoryModalOpen}
        mutateServiceCategories={mutateServiceCategories}
      />
      <div className="w-full">
        {/* table of all service categories */}
        <Table
          pagination={false}
          size="large"
          expandable={{
            expandedRowRender: (record) => {
              return <ServicesSubtable service_category_id={record.id} />;
            },
          }}
          dataSource={serviceCategoriesData}
          rowKey="id"
          className="w-full pb-8"
        >
          <Column
            title={"Ime Kategorije"}
            dataIndex="category_name"
            key="category_name"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <MdOutlineCategory size={16} className="mr-3" />
                  <div className="font-medium text-md">{record.name}</div>
                </div>
              );
            }}
          />
          <Column
            title={"Akcije"}
            dataIndex="actions"
            key="action"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <Link
                    href={{
                      pathname:
                        "/dashboard/service-categories/service-categ-details",
                      query: {
                        category_id: record.id,
                      },
                    }}
                    target="_blank"
                  >
                    <Button type="link">Uredi</Button>
                  </Link>
                  <Link
                    href={{
                      pathname: "/dashboard/service-categories/add-services",
                      query: {
                        category_id: record.id,
                      },
                    }}
                    target="_blank"
                  >
                    <Button type="link">Dodaj/Izbaci Servise</Button>
                  </Link>
                  <Popconfirm
                    title="Brisanje Kategorije Servisa"
                    description="Ako Izbrišete kategoriju servisa svi njeni servisi će biti bez kategorije"
                    okText="Da"
                    cancelText="Ne"
                    onConfirm={(e) => onDeleteServiceCategoryClick(record)}
                  >
                    <Button
                      type="link"
                      className="text-red-500 hover:text-red-500"
                    >
                      Izbriši
                    </Button>
                  </Popconfirm>
                </div>
              );
            }}
          />
        </Table>
      </div>
      <AddServiceCategoryModal
        isAddServiceCategoryModalOpen={isAddServiceCategoryModalOpen}
        setIsAddServiceCategoryModalOpen={setIsAddServiceCategoryModalOpen}
        session={session}
        handleAddingNewServiceCategory={handleAddingNewServiceCategory}
      />
    </div>
  );
};

export default ServicCategories;
