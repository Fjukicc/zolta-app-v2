"use client";
import React, { useEffect, useState } from "react";
//ant d
import { Table, Typography, Tag, Button, Popconfirm, message } from "antd";
//react icons
import { MdOutlineRoomService } from "react-icons/md";
import { FaEuroSign } from "react-icons/fa";
import { AiFillClockCircle } from "react-icons/ai";

//moment
import moment from "moment";
//session
import { useSession } from "next-auth/react";
//custom compnents
import { CustomInputWithIcon } from "../shared/input/CustomInput";
//modals
import AddNewServiceModal from "./modals/AddNewServiceModal";
//routing
import Link from "next/link";
//swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";

const { Text } = Typography;

const { Column } = Table;

const Services = () => {
  //session
  const { data: session, status: sessionStatus } = useSession();
  //search for table
  const [searchedText, setSearchedText] = useState("");
  //modal
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  //for messages
  const [messageApi, contextHolder] = message.useMessage();

  //fetch services
  const {
    data: servicesData,
    error: serviceError,
    isLoading: servicesLoading,
  } = useSWR(
    session
      ? `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service?company_id=${session.user.company_id}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const onServiceTextChange = (text) => {
    setSearchedText(text);
  };

  //handle creating new service
  const handleAddNewService = async () => {};

  //handle delete service
  const onDeleteServicesClick = (record) => {};

  //handle error fetching services
  if (serviceError) {
    return <div>Error</div>;
  }

  return (
    <>
      {contextHolder}
      <div className=" w-full min-h-full pl-6 pr-6 pt-1">
        {/* search bar */}
        <div className="h-16 flex flex-row justify-between w-full items-center">
          <div className=" w-64">
            <CustomInputWithIcon
              value={searchedText}
              onChange={onServiceTextChange}
              placeholder="Filtriraj Servise"
            />
          </div>
          <Button onClick={() => setIsAddServiceModalOpen(true)} type="primary">
            Dodaj Servis
          </Button>
        </div>

        {/* table */}
        <Table
          size="large"
          pagination={{ pageSize: 25 }}
          dataSource={servicesData}
          rowKey="id"
        >
          {/* service name */}
          <Column
            title="Ime Servisa"
            dataIndex="name"
            key="name"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <Tag
                    color="purple"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <MdOutlineRoomService size={16} className="mr-1" />
                    {record.name}{" "}
                  </Tag>
                </div>
              );
            }}
            filteredValue={[searchedText]}
            onFilter={(value, record) =>
              String(record.name)
                .toLowerCase()
                .includes(value.toLocaleLowerCase()) ||
              String(record.price)
                .toLowerCase()
                .includes(value.toLocaleLowerCase())
            }
          />
          {/* service base price (without discount) */}
          <Column
            title="Osnovna Cijena"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <Tag
                    color="gold"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {record.price}
                    <FaEuroSign />
                  </Tag>
                </div>
              );
            }}
          />
          {/* service discount */}
          <Column
            title="Popust"
            render={(text, record, index) => {
              return (
                <>
                  {record.discount_percentage === null ? (
                    <Tag color="#808080">Nema popusta</Tag>
                  ) : (
                    <Tag color="#87d068">{record.discount_percentage} %</Tag>
                  )}
                </>
              );
            }}
          />
          {/* service discount end time */}
          <Column
            title="Datum Kraja Popusta"
            render={(text, record, index) => {
              return (
                <>
                  {record.discount_percentage === null ? (
                    <Tag color="#808080">Bez Datuma</Tag>
                  ) : (
                    <Tag color="#87d068">
                      {moment(record.discount_endtime).format("LL").toString()}
                    </Tag>
                  )}
                </>
              );
            }}
          />
          {/* service final price */}
          <Column
            title="Završna Cijena"
            dataIndex="discount_price"
            key="discount_price"
            render={(text, record, index) => {
              return (
                <Tag color="red">
                  <div className="flex items-center">
                    {record.discount_price}
                    <FaEuroSign />
                  </div>
                </Tag>
              );
            }}
          />
          {/* service category */}
          <Column
            title="Kategorija"
            dataIndex="service_category_id"
            key="service_category_id"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  {record.service_category_id ? (
                    <Tag color="#A020F0">{record.service_category_name}</Tag>
                  ) : (
                    <Text bold style={{ fontSize: 14 }}>
                      Bez kategorije
                    </Text>
                  )}
                </div>
              );
            }}
          />
          {/* service duration */}
          <Column
            title="Trajanje"
            dataIndex="duration"
            key="duration"
            render={(text, record, inded) => {
              return (
                <div className="flex items-center">
                  <AiFillClockCircle color={"#722ed1"} size={17} />
                  <Text strong style={{ fontSize: 14, marginLeft: 4 }}>
                    {record.duration} Min
                  </Text>
                </div>
              );
            }}
          />

          {/* service action buttons */}
          <Column
            title="Akcije"
            render={(text, record, index) => {
              return (
                <>
                  {/* edit service */}
                  <Link
                    href={{
                      pathname: "/dashboard/services/service-details",
                      query: {
                        service_id: record.id,
                      },
                    }}
                  >
                    <Button type="link">Uredi</Button>
                  </Link>

                  {/* delete service */}
                  <Popconfirm
                    title="Brisanje Servisa"
                    description="Jeste li sigurni da želite izbrisati servis?"
                    okText="Da"
                    cancelText="Ne"
                    onConfirm={(e) => onDeleteServicesClick(record)}
                  >
                    <Button
                      type="link"
                      className="text-red-500 hover:text-red-500"
                    >
                      Izbriši
                    </Button>
                  </Popconfirm>
                </>
              );
            }}
          />
        </Table>
        <AddNewServiceModal
          isAddNewServiceModalOpen={isAddServiceModalOpen}
          setIsAddNewServiceModalOpen={setIsAddServiceModalOpen}
          handleAddNewService={handleAddNewService}
        />
      </div>
    </>
  );
};

export default Services;
