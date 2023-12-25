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

//custom components
import ServicesSubtable from "./components/ServicesSubtable";

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

  if (serviceCategoriesLoading === true) {
    return "Loading...";
  }

  return (
    <div className=" w-full min-h-full pl-6 pr-6 pt-1">
      {contextHolder}
      <div className="w-full mt-3">
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
                      pathname: "/dashboard/rents/rent-details",
                      query: {
                        rent_id: record.id,
                      },
                    }}
                  >
                    <Button type="link">Uredi</Button>
                  </Link>
                  <Popconfirm
                    title="Brisanje Rezervacije"
                    description="Jeste li sigurni da želite izbrisati rezervaciju?"
                    okText="Da"
                    cancelText="Ne"
                    onConfirm={(e) => onDeleteReservationClick(record)}
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
    </div>
  );
};

export default ServicCategories;
