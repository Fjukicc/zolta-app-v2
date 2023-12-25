"use client";
import React, { useState, useEffect } from "react";
//swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";
//antd
import { Table, Tag, Typography } from "antd";
//icons
import { MdOutlineRoomService } from "react-icons/md";
import { FaEuroSign } from "react-icons/fa";
import { AiFillClockCircle } from "react-icons/ai";

const { Column } = Table;
const { Text } = Typography;

const ServicesSubtable = ({ service_category_id }) => {
  //fetch service categories
  const {
    data: servicesInCategoryData,
    error: servicesInCategoryError,
    isLoading: servicesInCategoryLoading,
  } = useSWR(
    `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service?service_category_id=${service_category_id}`,
    fetcher
  );

  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    if (servicesInCategoryData) {
      setTableData(servicesInCategoryData);
    }
  }, [servicesInCategoryData]);

  return (
    <>
      {tableData && (
        <Table
          pagination={false}
          size="small"
          dataSource={tableData}
          rowKey="id"
          className="w-full"
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
          />
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
        </Table>
      )}
    </>
  );
};

export default ServicesSubtable;
