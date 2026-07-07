
function StatusBadge({ status }: { status: "Complete" | "Progress" | "Waiting" }) {
  const dot =
    status === "Complete"
      ? "bg-[#7BC96F]"
      : status === "Progress"
      ? "bg-[#F2B84B]"
      : "bg-white";
  return (
    <span className="flex w-fit items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
export function TaskCard({
  status,
  title,
  imgHint,
}: {
  status: "Complete" | "Progress" | "Waiting";
  title: string;
  imgHint: string;
}) {
  return (
    <div className="relative h-[160px] overflow-hidden rounded-2xl border border-black/[0.04]">
      {/* Swap for: <img src="/your-photo.jpg" className="absolute inset-0 h-full w-full object-cover" /> */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#E4EDDD] text-center text-[10px] uppercase tracking-wide text-[#142B1D]/40">
        {imgHint}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
      <div className="absolute inset-0 flex flex-col justify-between p-3.5">
        <StatusBadge status={status} />
        <p className="text-[13px] font-semibold leading-snug text-white">
          {title}
        </p>
      </div>
    </div>
  );
}
