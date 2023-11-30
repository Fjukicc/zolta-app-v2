import React from "react";

const CustomInput = ({ onChange, value, placeholder }) => {
  return (
    <input
      placeholder={placeholder ? placeholder : ""}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="text"
      id="small-input"
      className="block w-full p-2 text-gray-900 border rounded-lg sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      style={{borderColor: "#d9d9d9"}}
    />
  );
};

export default CustomInput;
