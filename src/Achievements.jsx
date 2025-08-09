import React from "react";
import NoAchievements from "./assets/NoAchievements.png"; // Assuming you have a placeholder image for no achievements

const dummyAchievements = [
  {
    id: 1,
    emoji: "🏆",
    title: "First Steps",
    description: "Completed your first task. Keep it up!",
  },
  {
    id: 2,
    emoji: "🔥",
    title: "On Fire",
    description: "Achieved a 7-day streak of daily tasks.",
  },
  
  
];

export default function Achievements() {
  return (
    <div className="w-full flex flex-col">
      <div className="flex overflow-x-auto space-x-6 px-2 pb-2 scrollbar-hide">
        {          /* Map through dummy achievements */
          dummyAchievements.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <img
              src={NoAchievements}
              alt="No Achievements"
              className="w-[250px] h-[250px] object-contain"
            />
          </div>
        ): (
        
        dummyAchievements.map((item) => (
          <div
            key={item.id}
            className="min-w-[220px] max-w-[240px] h-[180px] bg-[#2a2a3c] border border-border rounded-xl p-4 flex flex-col justify-between shadow-lg flex-shrink-0"
          >
            <div className="text-4xl">{item.emoji}</div>
            <div className="mt-2">
              <h3 className="text-md font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-sm text-text-muted">{item.description}</p>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
}
