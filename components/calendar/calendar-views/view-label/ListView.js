"use client";
import React, { useEffect, useState } from "react";
//ant d
import { Button, Table, Tag } from "antd";
//icons
import { FaUser, FaClock } from "react-icons/fa";
import { FaFileMedical } from "react-icons/fa6";
//moment js
import moment from "moment";

var { Column } = Table;

const ListView = ({ reservations, currentDate }) => {
  const [rentsToPrint, setRentsToPrint] = useState(null);

  //set all rents to print for current date
  useEffect(() => {
    let data = [];
    reservations.forEach((rent) => {
      if (
        moment(rent.date, "YYYY-MM-DD").format("YYYY-MM-DD").toString() ===
        moment(currentDate, "YYYY-MM-DD").format("YYYY-MM-DD").toString()
      ) {
        data.push({
          ...rent,
        });
      }
      setRentsToPrint(data);
    });
  }, [reservations, currentDate]);

  return (
    <div
      className="w-full overflow-y-scroll flex pt-4 "
      style={{ userSelect: "none", minHeight: "70vh", maxHeight: "70vh" }}
    >
      {/* table view of whole current services for day */}
      {rentsToPrint && (
        <Table
          pagination={false}
          size="large"
          dataSource={rentsToPrint}
          rowKey="id"
          className="w-full"
        >
          {/* Timeframe or rent */}
          <Column
            title={"Period"}
            dataIndex="period"
            key="period"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <FaClock size={16} className="mr-3" />
                  <div className="font-medium text-md">
                    {moment(record.start_time, "hh:mm:ss").format("hh:mm")} -{" "}
                    {moment(record.end_time, "hh:mm:ss").format("hh:mm")}
                  </div>
                </div>
              );
            }}
          />
          {/* Employee name */}
          <Column
            title={"Ime Zaposlenika"}
            dataIndex="name_of_provider"
            key="name_of_provider"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <FaUser size={16} className="mr-2" />{" "}
                  <div className="font-medium text-md">{record.admin_name}</div>
                </div>
              );
            }}
          />
          {/* user that is appointed */}
          <Column
            title={"Naručena Osoba"}
            dataIndex="name_of_user"
            key="name_of_user"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <div className="font-medium text-md">{record.name}</div>
                </div>
              );
            }}
          />
          {/* services */}
          <Column
            title={"Servisi"}
            dataIndex="service"
            key="service"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  {/* <FaFileMedical size={18} className="mr-2" /> */}
                  <div className="flex flex-row">
                    {record.services.map((service) => (
                      <Tag color="blue" key={service.id}>
                        {service.name}
                      </Tag>
                    ))}
                  </div>
                </div>
              );
            }}
          />
          {/* status */}
          <Column
            title={"Status"}
            dataIndex="status"
            key="status"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  {record.status === "Active" && (
                    <Tag color="success">Aktivna</Tag>
                  )}
                  {record.status === "Inactive" && (
                    <Tag color="error">Neaktivna</Tag>
                  )}
                </div>
              );
            }}
          />
          {/* <Button type="link" block>
      Link
    </Button> */}
          <Column
            title={"Akcije"}
            dataIndex="actions"
            key="action"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                    <Button type="link">
                      Uredi
                    </Button>
                    <Button type="link" className="text-red-500 hover:text-red-500">
                      Izbriši
                    </Button>
                </div>
              );
            }}
          />
        </Table>
      )}
    </div>
  );
};

export default ListView;
