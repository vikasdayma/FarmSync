const SOIL_ICON: Record<string, string> = {
  CLAY: "🟤",
  SANDY: "🟡",
  LOAMY: "🌱",
  SILTY: "⚫",
  PEATY: "🟫",
  CHALKY: "⚪",
  MIXED: "🌍",
};

const IRRIGATION_ICON: Record<string, string> = {
  DRIP: "💧",
  SPRINKLER: "🌧️",
  FLOOD: "🌊",
  FURROW: "〰️",
  CENTER_PIVOT: "🎡",
  MANUAL: "🪣",
};

type FarmProfileCardProps = {
  soilType?: string | null;
  irrigationType?: string | null;
  status: string;
  isVerified: boolean;
  registrationNo?: string | null;
  createdAt: string;
  soilReportsCount: number;
  onViewSoilReports?: () => void;
};

export function FarmProfileCard({
  soilType,
  irrigationType,
  status,
  isVerified,
  registrationNo,
  createdAt,
  soilReportsCount,
  onViewSoilReports,
}: FarmProfileCardProps) {
  const registeredDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const statusActive = status === "ACTIVE";

  return (
    <div className="rounded-2xl border  border-black/[0.04] bg-white p-5 shadow-xs shadow-green-400">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#142B1D]/55">
          Farm Profile
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
            statusActive
              ? "border border-[#3F7A3E]/25 bg-[#3F7A3E]/10 text-[#3F7A3E]"
              : "border border-black/10 bg-black/[0.04] text-[#142B1D]/50"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              statusActive ? "bg-[#3F7A3E]" : "bg-[#142B1D]/30"
            }`}
          />
          {status}
        </span>
      </div>

      {/* soil + irrigation — the two real setup fields you have */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gradient-to-b from-[#6FA35A] to-[#3F7A3E] p-3.5">
          <span className="text-lg leading-none">
            {soilType ? SOIL_ICON[soilType] ?? "🌍" : "❓"}
          </span>
          <p className="mt-2 text-[14px] uppercase tracking-wide text-white">
            Soil Type
          </p>
          {soilType ? (
            <p className="mt-0.5 text-sm font-semibold text-white">
              {soilType.charAt(0) + soilType.slice(1).toLowerCase()}
            </p>
          ) : (
            <p className="mt-0.5 text-sm font-medium text-[#142B1D]/35">
              Not set
            </p>
          )}
        </div>

        <div className="rounded-xl bg-gradient-to-b from-[#6FA35A] to-[#3F7A3E] p-3.5">
          <span className="text-lg leading-none">
            {irrigationType ? IRRIGATION_ICON[irrigationType] ?? "🚿" : "❓"}
          </span>
          <p className="mt-2 text-[14px] uppercase tracking-wide
          text-white">
            Irrigation
          </p>
          {irrigationType ? (
            <p className="mt-0.5 text-sm font-semibold text-white">
              {irrigationType.charAt(0) + irrigationType.slice(1).toLowerCase()}
            </p>
          ) : (
            <p className="mt-0.5 text-sm font-medium text-[#142B1D]/35">
              Not set
            </p>
          )}
        </div>
      </div>

      {/* verification + records — all fields you already have, nothing invented */}
      <div className="mt-4 space-y-2.5 border-t border-[#f0ece8] pt-4">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-[#142B1D]/50">Verification</span>
          <span
            className={`font-medium ${
              isVerified ? "text-[#3F7A3E]" : "text-amber-600"
            }`}
          >
            {isVerified ? "✓ Verified" : "⏳ Pending"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <span className="text-[#142B1D]/50">Registration No.</span>
          <span className="font-medium text-[#142B1D]">
            {registrationNo ?? "Not assigned"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <span className="text-[#142B1D]/50">Registered on</span>
          <span className="font-medium text-[#142B1D]">{registeredDate}</span>
        </div>

        <button
          onClick={onViewSoilReports}
          className="mt-1 flex w-full items-center justify-between rounded-lg bg-[#142B1D]/[0.03] px-3 py-2.5 text-[13px] transition-colors hover:bg-[#142B1D]/[0.06]"
        >
          <span className="text-[#142B1D]/70">
            {soilReportsCount > 0
              ? `${soilReportsCount} soil report${soilReportsCount > 1 ? "s" : ""} logged`
              : "No soil reports yet"}
          </span>
          <span className="font-medium text-[#3F7A3E]">
            {soilReportsCount > 0 ? "View →" : "Log one →"}
          </span>
        </button>
      </div>
    </div>
  );
}