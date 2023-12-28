import React from "react";
import { Button } from "antd";
import { IoIosRefresh } from "react-icons/io";

const Header = ({
  setIsAddServiceCategoryModalOpen,
  mutateServiceCategories,
}) => {
  const refreshButtonClickHandler = async () => {
    await mutateServiceCategories();
  };
  return (
    <div className="h-16 flex flex-row justify-end w-full items-center">
      <Button
        type="primary"
        shape="circle"
        icon={<IoIosRefresh size={20} onClick={refreshButtonClickHandler} />}
        className="mr-3"
      />
      <Button
        onClick={() => setIsAddServiceCategoryModalOpen(true)}
        type="primary"
      >
        Dodaj Kategoriju Servisa
      </Button>
    </div>
  );
};

export default Header;
