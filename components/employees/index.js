"use client";
import React, { useEffect, useState } from "react";
//ant d
import { Table, Typography, Tag, Button, Popconfirm, message } from "antd";
//session
import { useSession } from "next-auth/react";
//routing
import Link from "next/link";
//swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";
//custom components
import { CustomInputWithIcon } from "../shared/input/CustomInput";
//icons
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoIosRefresh } from "react-icons/io";
import { AiOutlinePhone } from "react-icons/ai";
//modals
import DeleteEmployeeModal from "./employee-modals/DeleteEmployeeModal";
import AddEmployeModal from "./employee-modals/AddEmployeModal";

const { Text } = Typography;

const { Column } = Table;

const Employees = () => {
  //session
  const { data: session, status: sessionStatus } = useSession();
  //search for table
  const [searchedText, setSearchedText] = useState("");
  //modal
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isDeleteEmployeeModalOpen, setIsDeleteEmployeeModalOpen] =
    useState(false);
  //for messages
  const [messageApi, contextHolder] = message.useMessage();

  const [recordToDelete, setRecordToDelete] = useState(null);

  //fetch services
  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeLoading,
    mutate: mutateEmployees,
  } = useSWR(
    session
      ? `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/admin?company_id=${session.user.company_id}`
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

  //show success message when new service is created
  const successAddingNewService = (newService) => {
    messageApi.open({
      type: "success",
      content: `Uspješno ste dodali novi servis: ${newService.name} `,
    });
  };

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

  const handleAddNewAdmin = () => {
    setIsAddEmployeeModalOpen(true);
  };

  // refresh table
  const refreshButtonClickHandler = async () => {
    await mutateEmployees();
  };

  const handleDeletingAdmin = (record) => {
    setRecordToDelete(record);
    setIsDeleteEmployeeModalOpen(true);
  };

  //handle error fetching services
  if (employeeError) {
    return <div>Error</div>;
  }

  if (!session) {
    return "Loading...";
  }

  return (
    <>
      {contextHolder}
      <div className=" w-full min-h-full pl-6 pr-6 pt-1">
        <div className="h-16 flex flex-row justify-between w-full items-center">
          <div className="w-64">
            <CustomInputWithIcon
              value={searchedText}
              onChange={onServiceTextChange}
              placeholder="Filtriraj Servise"
            />
          </div>
          <div className="flex flex-row items-center">
            <Button
              type="primary"
              shape="circle"
              icon={
                <IoIosRefresh size={20} onClick={refreshButtonClickHandler} />
              }
              className="mr-3 hover:scale-110"
            />
            <Button onClick={handleAddNewAdmin} type="primary">
              Dodaj Zaposlenika
            </Button>
          </div>
        </div>
        <Table
          size="large"
          pagination={false}
          dataSource={employeeData}
          rowKey="id"
        >
          {/* Employee name */}
          <Column
            title={"Ime Zaposlenika"}
            dataIndex="name_of_provider"
            key="name_of_provider"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <FaRegUser size={16} className="mr-2" />{" "}
                  <div className="font-medium text-md">{record.name}</div>
                </div>
              );
            }}
          />

          {/* Employee email */}
          <Column
            title={"Email"}
            dataIndex="email"
            key="email"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <MdOutlineEmail size={16} className="mr-2" />{" "}
                  <div className="font-medium text-md">{record.email}</div>
                </div>
              );
            }}
          />

          {/* Employee Telephone */}
          <Column
            title={"Broj Telefona"}
            dataIndex="tel"
            key="tel"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <AiOutlinePhone size={16} className="mr-2" />{" "}
                  <div className="font-medium text-md">
                    {record.phone_number}
                  </div>
                </div>
              );
            }}
          />

          {/* Actions */}
          <Column
            title="Akcije"
            render={(text, record, index) => {
              return (
                <>
                  {/* edit employee */}
                  <Link
                    href={{
                      pathname: "/dashboard/employees/employee-details",
                      query: {
                        employeeId: record.id,
                      },
                    }}
                  >
                    <Button type="link">Uredi</Button>
                  </Link>

                  {/* delete employee */}
                  <Popconfirm
                    title="Brisanje Zaposlenika"
                    description="Jeste li sigurni da želite izbrisati Zaposlenika?"
                    okText="Da"
                    cancelText="Ne"
                    onConfirm={(e) => handleDeletingAdmin(record)}
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

        <DeleteEmployeeModal
          isDeleteEmployeeModalOpen={isDeleteEmployeeModalOpen}
          setIsDeleteEmployeeModalOpen={setIsDeleteEmployeeModalOpen}
          record={recordToDelete}
          setRecordToDelete={setRecordToDelete}
        />

        <AddEmployeModal
          isAddEmployeeModalOpen={isAddEmployeeModalOpen}
          setIsAddEmployeeModalOpen={setIsAddEmployeeModalOpen}
        />
      </div>
    </>
  );
};

export default Employees;
