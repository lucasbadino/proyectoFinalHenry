"use client";

import React from 'react';
import Image from 'next/image';
import { IProviderCardProps } from '@/interfaces/IServiceProvider';
import { Rate } from 'antd';

const ProviderCard: React.FC<IProviderCardProps> = ({
  name,
  experience,
  profileImageUrl,
  calification,
}) => {
  const flooredRating =
    typeof calification === 'number' && !isNaN(calification)
      ? Math.floor(calification)
      : 0;

  return (
    <div className="w-full max-w-xs bg-gray-100 border border-[#388E3C] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer transform hover:scale-105 hover:shadow-xl hover:shadow-[#FFEB3B] transition duration-300 ease-in-out h-[500px] flex flex-col hover:translate-y-2">
      {/* Imagen */}
      <div className="w-full min-h-[300px] overflow-hidden rounded-t-lg">
        <Image
          className="object-cover min-h-[300px]"
          src={profileImageUrl || '/images/nuevo_usuarioGardener.webp'}
          alt={`${name} image`}
          width={1920}
          height={1080}
        />
      </div>

      {/* Información */}
      <div className="p-4 flex flex-col justify-between flex-grow min-h-[200px]">
        {/* Nombre */}
        <h5 className="text-lg font-semibold tracking-tight text-[#263238] dark:text-white">
          {name}
        </h5>

        {/* Experiencia */}
        <p className="text-sm text-gray-500 dark:text-gray-400 my-2">
          {experience}
        </p>

        {/* Disponibilidad */}
        <div className="flex items-center mt-2">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block mr-2"></span>
            <span className="text-sm font-medium text-[#8BC34A] dark:text-gray-400">
              Disponible
            </span>
          </span>
        </div>

        {/* Calificación */}
        <div className="flex items-center mt-2">
          <Rate disabled allowHalf defaultValue={calification || 0} />
          <span className="ml-2 text-sm font-medium text-[#263238] dark:text-gray-400">
            {calification ? calification.toFixed(1) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
