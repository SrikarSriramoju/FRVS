import { useState } from "react";

function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  if (endAngle - startAngle >= 360) endAngle = startAngle + 359.99;
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
}

export default function PieChart({ data, title, subtitle }) {
  const [hovered, setHovered] = useState(null);

  const segments = [
    {
      key: "positive",
      label: "Positive",
      value: data.positive,
      color: "#10b981",
      hoverColor: "#059669",
    },
    {
      key: "neutral",
      label: "Neutral",
      value: data.neutral,
      color: "#64748b",
      hoverColor: "#475569",
    },
    {
      key: "negative",
      label: "Negative",
      value: data.negative,
      color: "#f43f5e",
      hoverColor: "#e11d48",
    },
  ];
  const hoveredSegment = segments.find((seg) => seg.key === hovered);

  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let currentAngle = 0;
  const cx = 100,
    cy = 100,
    r = 75,
    innerR = 42;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
      <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-base mb-0.5 transition-colors">
        {title}
      </h3>
      {subtitle && (
        <p className="text-slate-400 dark:text-slate-500 text-xs mb-4 transition-colors">
          {subtitle}
        </p>
      )}

      <div className="flex items-center gap-6 flex-wrap">
        <div className="relative flex-shrink-0">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {segments.map((seg) => {
              const sweep = (seg.value / total) * 360;
              const startA = currentAngle;
              currentAngle += sweep;
              const isHov = hovered === seg.key;
              const scale = isHov ? 1.05 : 1;
              return (
                <path
                  key={seg.key}
                  d={arcPath(cx, cy, r, startA, startA + sweep)}
                  fill={isHov ? seg.hoverColor : seg.color}
                  transform={`scale(${scale}) translate(${cx * (1 - scale)}, ${cy * (1 - scale)})`}
                  style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                  onMouseEnter={() => setHovered(seg.key)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
            <circle
              cx={cx}
              cy={cy}
              r={innerR}
              fill="currentColor"
              className="text-white dark:text-slate-900 transition-colors"
            />
            <text
              x={cx}
              y={cy - 8}
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
              className="text-slate-500 dark:text-slate-400 transition-colors"
            >
              Overall
            </text>
            <text
              x={cx}
              y={cy + 8}
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fill={
                data.overall === "POSITIVE"
                  ? "#10b981"
                  : data.overall === "NEGATIVE"
                    ? "#f43f5e"
                    : "currentColor"
              }
              className={
                data.overall === "NEUTRAL"
                  ? "text-slate-500 dark:text-slate-400 transition-colors"
                  : ""
              }
            >
              {data.overall}
            </text>
            {hoveredSegment && (
              <text
                x={cx}
                y={cy + 28}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                className="text-slate-400 dark:text-slate-500 transition-colors"
              >
                {hoveredSegment.label}: {Math.round(hoveredSegment.value * 100)}
                %
              </text>
            )}
          </svg>
        </div>

        <div className="flex-1 space-y-3 min-w-32">
          {segments.map((seg) => (
            <div
              key={seg.key}
              className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-default ${
                hovered === seg.key
                  ? "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  : "border border-transparent"
              }`}
              onMouseEnter={() => setHovered(seg.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: seg.color }}
                />
                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors">
                  {seg.label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-bold transition-colors">
                  {Math.round(seg.value * 100)}%
                </p>
                <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1 transition-colors">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${seg.value * 100}%`,
                      background: seg.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
