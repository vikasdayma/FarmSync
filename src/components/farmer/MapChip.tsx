export default function MapChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`absolute rounded-xl bg-black/40 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-md ${className}`}
    >
      {children}
    </span>
  );
}