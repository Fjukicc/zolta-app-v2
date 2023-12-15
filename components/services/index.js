"use client";
import React, { useEffect, useState } from "react";
//ant d
import { Table, Typography, Tag, Button, Popconfirm } from "antd";
//react icons
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { FaEuroSign } from "react-icons/fa";
import { AiFillClockCircle } from "react-icons/ai";
//moment
import moment from "moment";
//api
import { fetchServices } from "@/services/services";
//session
import { useSession } from "next-auth/react";
//components
import CustomInput from "../shared/input/CustomInput";
//modals
import AddNewServiceModal from "./modals/AddNewServiceModal";
//routing
import Link from "next/link";

const { Text } = Typography;

const { Column } = Table;

const Services = () => {
  //session
  const { data: session, status: sessionStatus } = useSession();
  //search for table
  const [searchedText, setSearchedText] = useState("");
  const [services, setServices] = useState();
  const [servicesError, setServicesError] = useState(false);

  //fetch services
  useEffect(() => {
    const fetchServicesFunction = async () => {
      if (
        sessionStatus === "authenticated" &&
        session?.user?.company_id &&
        !services
      ) {
        const companyId = session.user.company_id;
        const data = await fetchServices(companyId);
        if (data.success) {
          setServices(data.data);
          setServicesError(false);
        } else {
          setServicesError(true);
        }
      }
    };

    fetchServicesFunction();
  }, [session, sessionStatus, services]);

  const onDeleteServicesClick = (record) => {};

  return (
    <>
      <div className=" w-full min-h-full pl-6 pr-6 pt-6">
        {/* search bar */}
        <div className="w-full flex justify-between">
          <div className=" w-64 mb-4">
            <CustomInput placeholder="Filtriraj Servise" />
          </div>
          <Button type="primary">Dodaj Novi</Button>
        </div>

        {/* table */}
        {servicesError ? (
          <h1>Nemožemo dohvatiti servise</h1>
        ) : (
          <Table
            size="small"
            pagination={{ pageSize: 25 }}
            dataSource={services}
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
                    <MdOutlineMiscellaneousServices
                      color={"#722ed1"}
                      size={17}
                    />
                    <Text strong style={{ fontSize: 14, marginLeft: 4 }}>
                      {record.name}
                    </Text>
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
                      color="#f50"
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
                        {moment(record.discount_endtime)
                          .format("LL")
                          .toString()}
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
                  <Tag color="#2db7f5">
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
                      <Button
                        id={record.id}
                        // onClick={(e) => onEditRowClick(record)}
                        type="primary"
                        size="small"
                        style={{ marginRight: 8, background: "#FFCC00" }}
                      >
                        Edit
                      </Button>
                    </Link>

                    {/* delete service */}
                    <Popconfirm
                      title="Brisanje Servisa"
                      description="Jeste li sigurni da želite izbrisati servis?"
                      okText="Da"
                      cancelText="Ne"
                      onConfirm={(e) => onDeleteServicesClick(record)}
                    >
                      <Button type="primary" size="small" danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  </>
                );
              }}
            />
          </Table>
        )}
      </div>
    </>
  );
};

export default Services;
