import React from "react";

export default function HeroMetricsSection() {
  const boxes = [
    {
      title: "Inspiring Articles & Proven Paths",
      desc: "Read real, verified stories and company blueprints—fuel your ambition with knowledge that works.",
    },
    {
      title: "Mine Insights, Build Your Future",
      desc: "Explore practical lessons and resources, curated for real-world growth. Every click, a step forward.",
    },
    {
      title: "Stay Ahead with Curated News",
      desc: "Motivation meets discovery: handpicked news and breakthrough ideas to keep you inspired every day.",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center mt-10 px-4 md:px-12 lg:px-24">
      {/* Headline Section */}
      <div className="text-center max-w-4xl mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
          Empower Your Journey: Discover, Learn, and Grow Beyond Limits
        </h1>
        <p className="text-gray-400 italic text-lg mt-4">
          Unlock global knowledge, real-world stories, and verified insights—
          all in one transformative platform.
        </p>
      </div>

      {/* Metric Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl z-10">
        {boxes.map((box, i) => (
          <div
            key={i}
            className="bg-black text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between hover:scale-105 transition-transform duration-300"
          >
            <h3 className="text-xl font-bold mb-3">{box.title}</h3>
            <p className="text-sm text-gray-300">{box.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
