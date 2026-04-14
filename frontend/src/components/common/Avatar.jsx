const COLORS = [
  "bg-blue-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

const sizes = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

export default function Avatar({ name, size = "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={`${sizes[size]} ${getColor(name)} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
