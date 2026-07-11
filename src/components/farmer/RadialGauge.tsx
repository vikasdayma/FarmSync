export default function RadialGauge() {
  const rings = [
    { r: 42, pct: 61, color: "#CFE8B0", track: "#EEF4E5" },
    { r: 32, pct: 36, color: "#8FBF6B", track: "#E7F0DC" },
    { r: 22, pct: 79, color: "#2F5D3A", track: "#DCE9D0" },
  ];
  const c = (r: number) => 2 * Math.PI * r;

  return (
    <div className="relative mx-auto h-[190px] w-[190px]">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        {rings.map((ring) => (
          <g key={ring.r}>
            <circle
              cx="50"
              cy="50"
              r={ring.r}
              fill="none"
              stroke={ring.track}
              strokeWidth={7}
            />
            <circle
              cx="50"
              cy="50"
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={`${(ring.pct / 100) * c(ring.r)} ${c(
                ring.r
              )}`}
            />
          </g>
        ))}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] text-[#142B1D]/50">Overall Score</span>
        <span className="text-2xl font-bold text-[#142B1D]">72%</span>
      </div>

      <span className="absolute -left-3 top-3 rounded-md bg-[#F4F8F0] px-1.5 py-0.5 text-[10px] font-semibold text-[#142B1D]/70 shadow-sm">
        61%
      </span>
      <span className="absolute -right-3 top-3 rounded-md bg-[#F4F8F0] px-1.5 py-0.5 text-[10px] font-semibold text-[#142B1D]/70 shadow-sm">
        36%
      </span>
      <span className="absolute -right-2 bottom-6 rounded-md bg-[#F4F8F0] px-1.5 py-0.5 text-[10px] font-semibold text-[#142B1D]/70 shadow-sm">
        79%
      </span>
    </div>
  );
}