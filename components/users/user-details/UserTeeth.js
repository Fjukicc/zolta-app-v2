import React from "react";
//image
import Image from "next/image";
//icon
import { FaCircle } from "react-icons/fa6";
import { Popconfirm, ConfigProvider } from "antd";

const UserTeeth = () => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Image
        src="/assets/teeth.jpg" // Path to the image in the public directory
        alt="Teeth"
        // width={1000} // Width of the image
        // height={600} // Height of the image
        objectFit="contain"
        layout="fill"
      />
      <Popconfirm
        placement="bottom"
        title={"ZUBI"}
        description={"ovaj zub je zdrav"}
        okText="Yes"
        cancelText="No"
      >
        <FaCircle
          style={{ zIndex: 99, position: "absolute", top: "42%", left: "15.5%" }}
          color="#000"
          size={24}
        />
      </Popconfirm>


      {/* <FaCircle
        style={{ zIndex: 99, position: "absolute", top: "42%", left: "16%" }}
        color="#000"
      />
      <FaCircle
        style={{ zIndex: 99, position: "absolute", top: "42%", left: "16%" }}
        color="#000"
      />
      <FaCircle
        style={{ zIndex: 99, position: "absolute", top: "42%", left: "16%" }}
        color="#000"
      /> */}
    </div>
  );
};

export default UserTeeth;
