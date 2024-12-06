// helpers/calendarHelper.ts

import dayjs from "dayjs";
import { message } from "antd";

// Obtiene el token del almacenamiento local
const getAuthToken = (): string | null => {
  try {
    const tokenData = localStorage.getItem("userSession");

    if (!tokenData) {
      message.error("No se encontró el token de autenticación. Inicia sesión nuevamente.");
      return null;
    }

    const parsedToken: { token?: string } = JSON.parse(tokenData);
    if (!parsedToken || !parsedToken.token) {
      message.error("Token inválido o no encontrado.");
      return null;
    }
    
    return parsedToken.token; // Regresa solo el valor del token
  } catch (error) {
    console.error("Error al acceder a localStorage:", error);
    message.error("Error al verificar el token de autenticación.");
    return null;
  }
};

// Fetch días reservados del backend utilizando fetch
export const fetchReservedDays = async (gardenerId: string): Promise<Set<string>> => {
  console.log("ID del jardinero:", gardenerId);

  if (!gardenerId) {
    message.error("El ID del jardinero no está disponible.");
    return new Set<string>();
  }

  const token = getAuthToken();
  if (!token) {
    console.error("Token es inválido o no se encuentra.");
    throw new Error("Token es inválido o no se encuentra.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/gardener/${gardenerId}/reservedDays`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error en la solicitud al servidor: ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    const reservedDays = Array.isArray(data) ? data : data.reservedDays;

    if (!Array.isArray(reservedDays)) {
      console.error("Estructura de datos inesperada", data);
      throw new Error("Estructura de datos inesperada en la respuesta del servidor.");
    }

    const formattedDays = new Set<string>(
      reservedDays
        .filter((day: unknown): day is string => typeof day === "string")
        .map((day: string) => dayjs(day).format("YYYY-MM-DD"))
    );

    console.log("Días formateados:", Array.from(formattedDays));
    return formattedDays;
  } catch (error) {
    console.error("Error al obtener los días reservados:", error);
    message.error("No se pudieron cargar los días reservados.");
    return new Set<string>(); // Devolver un Set vacío en caso de error
  }
};


// Deshabilitar fechas pasadas y reservadas
export const disabledDate = (current: dayjs.Dayjs, reservedDays: Set<string>): boolean => {
  if (!current) return false;

  const isPast = current.isBefore(dayjs().startOf("day"));
  const isReserved = reservedDays.has(current.format("YYYY-MM-DD"));

  return isPast || isReserved;
};
