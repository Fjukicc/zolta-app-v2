import React from "react";

const PrimaryIconButton = ({ onClick, icon }) => {
  return (
    <button className="py-2 px-2 hover:bg-slate-50 rounded-md" onClick={onClick} style={{height: "auto"}} type="button">
      {icon}
    </button>
  );
};

export default PrimaryIconButton;
