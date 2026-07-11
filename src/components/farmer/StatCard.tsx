function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-black/4 bg-white p-4 shadow-sm shadow-black/12">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#142B1D]/55">
          {label}
        </span>
        <button
          aria-label="More options"
          className="flex h-6 w-6 items-center justify-center rounded-full text-[#142B1D]/40 hover:bg-black/5"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="19" cy="12" r="1.6" />
          </svg>
        </button>
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-[26px] font-bold leading-none tracking-tight text-[#142B1D]">
          {value}
        </span>
        <span className="text-[13px] text-[#142B1D]/45">{unit}</span>
      </div>
    </div>
  );
}
