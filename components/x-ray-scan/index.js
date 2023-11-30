"use client";
import React, { useState } from "react";
//ant d
import { Upload, Button, message, Row, Col, Typography } from "antd";
//and icons
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Title } = Typography;

const XRayScan = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      console.log(info.file);
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const imageBase64 = await resizeAndLoadImageBase64(file, 640);

      fetch(
        "https://detect.roboflow.com/dentai/2?api_key=g1AkQexoG775Jz6GHQbL",
        {
          method: "POST",
          body: imageBase64,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          onSuccess();
        })
        .catch((error) => {
          console.error(error);
          onError(error);
        });
    } catch (error) {
      console.error(error.message);
      onError(error);
    }
  };

  const resizeAndLoadImageBase64 = (file, maxWidth) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const aspectRatio = img.width / img.height;
          const newHeight = maxWidth / aspectRatio;
          canvas.width = maxWidth;
          canvas.height = newHeight;

          ctx.drawImage(img, 0, 0, maxWidth, newHeight);

          const resizedImageBase64 = canvas.toDataURL("image/jpeg");
          resolve(resizedImageBase64);
        };

        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.readAsDataURL(file);
    });
  };

  //   const loadImageBase64 = (file) => {
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = (error) => reject(error);
  //     });
  //   };

  return (
    <>
      <Row className="p-4">
        <Col span={24}>
          <Row>
            <p className=" text-4xl text-purple-700 font-bold">
              Image Analysis
            </p>
          </Row>
          <Row>
            <p className="text-base text-black">
              Upload Patient X-Ray Photo And Let AI help you with the work
            </p>
          </Row>
        </Col>
      </Row>
      <Row className="p-4">
        <Upload
          customRequest={customRequest}
          showUploadList={false}
          onChange={handleChange}
        >
          <Col span={6}>
            <Button icon={<UploadOutlined />}>Upload Image to Analyse</Button>
          </Col>
        </Upload>
      </Row>
      <Row>
        {imageUrl && (
          <div>
            <h2>Uploaded Image</h2>
            <Image src={imageUrl} alt="Uploaded" width={640} height={300} />
          </div>
        )}
      </Row>
    </>
  );
};

export default XRayScan;
