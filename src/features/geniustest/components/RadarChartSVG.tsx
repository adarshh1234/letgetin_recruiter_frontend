"use client";

import React from "react";

export function RadarChartSVG() {
  // Center coordinates and outer radius
  const cx = 140;
  const cy = 125;
  const maxRadius = 72;

  // 5 axes starting from top (-90 degrees)
  const angles = [-90, -18, 54, 126, 198].map((deg) => (deg * Math.PI) / 180);

  const getPoint = (angle: number, radiusRatio: number) => {
    const r = maxRadius * radiusRatio;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Concentric pentagon rings (4 levels)
  const ringLevels = [0.25, 0.5, 0.75, 1.0];

  const getPolygonPoints = (ratio: number) =>
    angles.map((a) => getPoint(a, ratio)).map((p) => `${p.x},${p.y}`).join(" ");

  // Data values ratio matching reference image
  const dataRatios = [0.72, 0.85, 0.65, 0.70, 0.78];
  const dataPoints = angles.map((a, i) => getPoint(a, dataRatios[i]));
  const dataPolygonString = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Labels info
  const labels: Array<{
    text: string;
    x: number;
    y: number;
    anchor: "end" | "middle" | "start";
  }> = [
    { text: "Left Hemispheric", x: cx, y: cy - maxRadius - 14, anchor: "middle" },
    { text: "Logical", x: cx + maxRadius + 18, y: cy - 10, anchor: "start" },
    { text: "Problem Solving", x: cx + maxRadius - 5, y: cy + maxRadius + 15, anchor: "start" },
    { text: "Linguistic", x: cx - maxRadius + 5, y: cy + maxRadius + 15, anchor: "end" },
    { text: "Aptitude", x: cx - maxRadius - 18, y: cy - 10, anchor: "end" },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none py-2">
      <svg viewBox="0 0 280 260" className="w-full max-w-[270px] h-auto overflow-visible">
        {/* Background Grid Rings */}
        {ringLevels.map((level, idx) => (
          <polygon
            key={idx}
            points={getPolygonPoints(level)}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={idx === ringLevels.length - 1 ? "1.5" : "1"}
            strokeDasharray={idx < ringLevels.length - 1 ? "2,2" : undefined}
          />
        ))}

        {/* Axis Lines */}
        {angles.map((angle, idx) => {
          const outerPt = getPoint(angle, 1.0);
          return (
            <line
              key={idx}
              x1={cx}
              y1={cy}
              x2={outerPt.x}
              y2={outerPt.y}
              stroke="#CBD5E1"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Radar Data Shape */}
        <polygon
          points={dataPolygonString}
          fill="rgba(59, 130, 246, 0.18)"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Data Vertices */}
        {dataPoints.map((pt, idx) => (
          <circle
            key={idx}
            cx={pt.x}
            cy={pt.y}
            r="4.5"
            fill="#2563EB"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        ))}

        {/* Axis Labels */}
        {labels.map((lbl, idx) => (
          <text
            key={idx}
            x={lbl.x}
            y={lbl.y}
            textAnchor={lbl.anchor}
            fill="#334155"
            fontSize="10.5"
            fontWeight="600"
            className="font-sans select-none"
          >
            {lbl.text}
          </text>
        ))}
      </svg>
    </div>
  );
}
