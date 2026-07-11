export default function MapPin({ color, className }: { color: string; className: string }) {
  return (
    <span
      className={`absolute h-3.5 w-3.5 rounded-full ring-4 ${className}`}
      style={{ backgroundColor: color, boxShadow: `0 0 0 4px ${color}33` }}
    />
  );
}