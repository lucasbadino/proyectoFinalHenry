import React, { useState } from "react";
import GardenerCalendar from "../GardenerCalendar/GardenerCalendar";

interface CalendarGardenerProps {
  id: string;
}

const CalendarGardener: React.FC<CalendarGardenerProps> = ({ id }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };
  return (
    <div>
      <section className="text-center my-10">
        <h1 className="text-2xl font-bold text-[#263238]">
          Calendario del Jardinero
        </h1>
        <p className="mt-2 text-[#8BC34A]">
          Planifica tu semana con el calendario.
        </p>
      </section>

      <div>
        <GardenerCalendar gardenerId={id} onDateSelect={handleDateSelect} />
      </div>
    </div>
  );
};

export default CalendarGardener;
