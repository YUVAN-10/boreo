import { TrendingUp } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  iconBgClass = "bg-orange-100 text-[#EA580C]",
  delay = 0,
}) {
  return (
    <div
      className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${iconBgClass}`}>
          <Icon size={24} strokeWidth={2.2} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-semibold text-gray-600">{label}</p>

      {subtext && (
        <p className="mt-3 border-t border-gray-100 pt-2.5 text-xs font-medium text-gray-500">
          {subtext}
        </p>
      )}
    </div>
  );
}
