"use client";
import {
  getCarrouselById,
  postCarrouselImage,
  updateCarrousel,
} from "@/helpers/gardeners.helpers";
import { IUserSession } from "@/interfaces/IUserSession";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Upload, Button, Carousel } from "antd";
import { LeftCircleOutlined, RightCircleOutlined, UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { Color } from "antd/es/color-picker";

const CarrouselGardener = () => {
  const [userSession, setUserSession] = useState<IUserSession | null>(null);
  const [carrousel, setCarrousel] = useState<string[]>([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedSession = JSON.parse(localStorage.getItem("userSession") || "");
      setUserSession(storedSession);
    }
  }, []);

  const fetchCarrousel = async () => {
    setLoader(true);
    try {
      const id = userSession?.user.id.toString();
      if (id) {
        const carrouselData = await getCarrouselById(id);
        setCarrousel(carrouselData?.imageUrl || []);
      }
    } catch (error) {
      console.error("Error buscando el carrousel:", error);
    } finally {
      setLoader(false);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gardener");

    const temporaryImageUrl = URL.createObjectURL(file);
    Swal.fire({
      icon: "success",
      title: "Imagen Subida",
      text: "Tu imagen se ha agregado correctamente al carrusel.",
      timer: 1500,
      showConfirmButton: false,
    });

    try {
      setCarrousel((prevCarrousel) => [...prevCarrousel, temporaryImageUrl]);

      const response = await postCarrouselImage(
        formData,
        userSession?.user.id.toString()
      );
      

      if (response?.imageUrl) {
        const newImageUrl = response.imageUrl;

        setCarrousel((prevCarrousel) =>
          prevCarrousel.map((url) =>
            url === temporaryImageUrl ? newImageUrl : url
          )
        );

        const id = userSession?.user.id.toString();
        if (id) {
          await updateCarrousel(id, [
            ...carrousel.filter((url) => url !== temporaryImageUrl),
            newImageUrl,
          ]);
        }
      } else {
        setCarrousel((prevCarrousel) =>
          prevCarrousel.filter((url) => url !== temporaryImageUrl)
        );
        throw new Error("No se obtuvo la URL de la imagen");
      }
    } catch (error) {
      setCarrousel((prevCarrousel) =>
        prevCarrousel.filter((url) => url !== temporaryImageUrl)
      );
      console.error("Error al subir la imagen:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al subir la imagen.",
      });
    }
  };

  const handleUpload = ({ file }: { file: any }) => {
    const convertedFile = file.originFileObj as File || file as File;

    if (!convertedFile) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se seleccionó ningún archivo.",
      });
      return;
    }

    const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(convertedFile.type)) {
      Swal.fire({
        icon: "error",
        title: "Tipo de archivo inválido",
        text: "Solo se permiten imágenes JPG, JPEG, PNG, GIF o WEBP.",
      });
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (convertedFile.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "Archivo muy grande",
        text: "El archivo no debe superar los 2MB.",
      });
      return;
    }

    uploadImage(convertedFile);
  };

  useEffect(() => {
    if (userSession?.user?.id) {
      fetchCarrousel();
    }
  }, [userSession]);

  const handleDelete = async (index: number) => {
    Swal.fire({
      icon: "success",
      title: "Imagen Eliminada",
      text: "La imagen ha sido eliminada del carrusel",
      timer: 1500,
      showConfirmButton: false,
    });
    const updatedCarrousel = carrousel.filter((_, i) => i !== index);
    setCarrousel(updatedCarrousel);

    const id = userSession?.user.id.toString();
    if (id) {
      await updateCarrousel(id, updatedCarrousel);
    }

  };
  
  if (loader) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <div className="w-16 h-16 border-4 border-green-300 border-t-green-500 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-[#263238]">
          Cargando la información...
        </h2>
      </div>
    );
  }

  const RightArrow = () => {
    return (
        <Button size="large"/>
    )
}

const LeftArrow = () => {
    return (
        <Button size="large"/>
    )
}

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Carrusel de imágenes:
        </h2>

        <div className="carousel-container my-6">
          <Carousel
            autoplay
            effect="scrollx"
            arrows
            prevArrow={LeftArrow()}
            nextArrow={RightArrow()}
          >
            {carrousel.map((imageUrl, index) => (
              <div
                key={index}
                className="w-full max-h-96 flex justify-center items-center overflow-hidden rounded-lg border-2 border-[#4CAF50]"
              >
                <Image
                  src={imageUrl}
                  alt={`Imagen ${index + 1}`}
                  width={1920}
                  height={1080}
                  className="object-cover"
                />
                <button
                  onClick={() => handleDelete(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  X
                </button>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-[#388E3C] mb-4">
          Subir imagen al carrusel:
        </h2>
        <Upload
          customRequest={({ file }) => handleUpload({ file })}
          showUploadList={false}
        >
          <Button
            style={{
              backgroundColor: "#4CAF50",
              borderColor: "#263238",
              color: "white",
            }}
            icon={<UploadOutlined />}
          >
            Sube tu imagen
          </Button>
        </Upload>
      </div>
    </div>
  );
};

export default CarrouselGardener;
