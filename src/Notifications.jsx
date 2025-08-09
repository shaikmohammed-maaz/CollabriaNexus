import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import dayjs from "dayjs";
import NoNotiImg from "./assets/NoNotification.png"; // Assuming you have a placeholder image for no notifications
import { img } from "framer-motion/client";

const initialNotifications = [
  {
    id: 1,
    message: "You’ve completed 5 tasks today. Great job! 🎯",
    time: "2025-08-07T10:15:00",
  },
  {
    id: 2,
    message: "New challenge available: 'Focus Sprint' 🔔",
    time: "2025-08-07T08:00:00",
  },
  {
    id: 3,
    message: "2 friends joined your team! 🤝",
    time: "2025-08-06T18:45:00",
  },
  {    id: 4,
    message: "Your streak is at 7 days! Keep it up! 🌟",
    time: "2025-08-06T12:30:00",  
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleDismiss = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="w-full h-full flex flex-col">

      {notifications.length === 0 ? (
        // <p className="text-text-muted text-sm text-center mt-4">No new notifications 🎉</p>
        <div className="flex flex-1 items-center justify-center">
  <img
    src={NoNotiImg}
    alt="No Notifications"
    className="w-[200px] h-[200px] object-contain"
  />
</div>

      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[220px] pr-4 py-4">
          {notifications.map((note) => (
            <div
              key={note.id}
              className="relative group bg-[#2a2a3c] text-sm text-text-muted px-4 py-3 rounded-md shadow-card border border-border transition-all duration-300"
            >
              <p>{note.message}</p>
              <span className="block text-xs text-gray-500 mt-1">
                {dayjs(note.time).format("MMM D, hh:mm A")}
              </span>

<button
  onClick={() => handleDismiss(note.id)}
  className="absolute -top-2 -right-2 bg-[#2a2a3c] rounded-full p-1 text-text-muted hover:text-violet-400 transition text-xs shadow-md"
  aria-label="Dismiss"
>
  <FaTimes />
</button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
