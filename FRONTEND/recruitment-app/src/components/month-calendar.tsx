"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface CalendarProps {
    events: {
        title: string;
        date: string;
    }[];
}

const MonthCalendar: React.FC<CalendarProps> = ({ events }) => {
    return (
        <div style={{ background: "white", padding: "1rem", borderRadius: "10px" }}>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "",
                    center: "title",
                    right: "",
                }}
                height="auto"
                events={events}
            />
        </div>
    );
};

export default MonthCalendar;
