import React from "react";

const PrimaryIconButton = ({ onClick, icon }) => {
  return (
    <button className="py-2 px-2 hover:bg-slate-200" onClick={onClick} style={{height: "auto"}} type="button">
      {icon}
    </button>
  );
};

export default PrimaryIconButton;
