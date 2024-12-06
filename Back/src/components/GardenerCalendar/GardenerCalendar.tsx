import React, { useEffect, useState, useCallback } from "react";
import { Calendar, message, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { fetchReservedDays, disabledDate } from "@/helpers/calendarHelper";
import { GardenerCalendarProps } from "@/interfaces/IGardenerCalendar";

const GardenerCalendar: React.FC<GardenerCalendarProps> = ({
  gardenerId,
  onDateSelect,
}) => {
  const [reservedDays, setReservedDays] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Asegúrate de que gardenerId esté disponible antes de realizar la llamada
    if (!gardenerId) {
      message.error("El ID del jardinero no está disponible.");
      setLoading(false);
      return;
    }

    const fetchReserved = async () => {
      try {
        setLoading(true);
        const days = await fetchReservedDays(gardenerId);
        console.log("Días reservados obtenidos A:", days); // Verifica si los datos son correctos
        setReservedDays(new Set(days));
        console.log("Días reservados:", days);
      } catch (error) {
        throw new Error("Error al obtener los días reservados");
      } finally {
        setLoading(false); // Finaliza el loading después de la carga
      }
    };
    fetchReserved();
  }, [gardenerId]); // Solo se vuelve a ejecutar cuando gardenerId cambia

  // Manejador de selección de fecha
  const handleSelect = useCallback(
    (value: Dayjs) => {
      const selectedDate = value.format("YYYY-MM-DD");

      // Verifica si la fecha está reservada
      if (reservedDays.has(selectedDate)) {
        message.warning("Este día ya está reservado.");
        return;
      }

      // Si la función de selección está definida, la llama
      if (onDateSelect && typeof onDateSelect === "function") {
        onDateSelect(selectedDate);
      } else {
        console.warn(
          "La función 'onDateSelect' no está definida o no es válida."
        );
      }
    },
    [reservedDays, onDateSelect] // Dependencias del hook useCallback
  );

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Calendario del Jardinero
      </h2> */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#888",
          }}
        >
          Cargando los días reservados...
          <Spin style={{ marginLeft: 8 }} />
        </div>
      ) : (
        <Calendar
          cellRender={(value) => {
            const date = value.format("YYYY-MM-DD");
            if (reservedDays.has(date)) {
              return (
                <div
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    borderRadius: "2%",
                    textAlign: "center",
                    padding: "2px 0",
                  }}
                >
                  Reservado
                </div>
              );
            }
            return null;
          }}
          onSelect={handleSelect} // Usa la función optimizada
          disabledDate={(current) => disabledDate(current, reservedDays)}
        />
      )}
    </div>
  );
};

export default GardenerCalendar;
