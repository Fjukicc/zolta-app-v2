"use client";
import React, { useState } from "react";
import { Card } from "antd";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { postData } from "@/services/api";

const LoginCard = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(false)

  //on login
  const handleFormSubmit = async (e) => {
    debugger;
    e.preventDefault();

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const response = await postData("http://3.75.131.109/admin/login", data);
    if(response.result === true){
        setError(false);

    }
    else{
        setError(true);
    }
  };

  return (
    <Card title="Login" bordered={false} className="p-3 pl-6 pr-6 w-3/12">
      <form onSubmit={handleFormSubmit}>
        <div className="grid gap-6 mb-6 max-w-2xl">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm text-left font-medium text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm text-left font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="*****"
                required
              />
              {!passwordVisible ? (
                <AiOutlineEye
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  size={20}
                  color="rgb(108 43 217)"
                  className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                />
              ) : (
                <AiOutlineEyeInvisible
                  size={20}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  color="rgb(108 43 217)"
                  className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full  flex flex-row justify-between items-center">
          <a
            href="/login"
            className="text-purple-600 hover:scale-105 cursor-pointer"
          >
            Need Account? Register
          </a>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 focus:outline-none"
          >
            Login
          </button>
        </div>
        {
            error && <p className="text-red-600 text-left font-semibold">Wrong username or password :(</p>
        }
      </form>
    </Card>
  );
};

export default LoginCard;
