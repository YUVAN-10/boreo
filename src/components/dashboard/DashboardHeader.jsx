import { Calendar, CalendarRange } from "lucide-react";
import ProfileDropdown from "../layout/ProfileDropdown";
import { useTerms } from "../../context/TermsContext";
import { formatTermLabel } from "../../utils/termPeriod";

export default function DashboardHeader({ termFilter, setTermFilter }) {
  const { terms, activeTerm } = useTerms();

  return (
    <div className="relative z-30 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-center animate-fade-in border-b border-gray-200 pb-5">
      {/* Left: Title & Subtitle */}
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight text-[#1E3A8A]">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 font-medium">
          Corporate Admin Dashboard & Organization Overview
        </p>
        {activeTerm && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#EA580C] border border-orange-200/80">
            <CalendarRange size={13} />
            Current Active: {formatTermLabel(activeTerm)}
          </div>
        )}
      </div>

      {/* Center: Term Selector */}
      <div className="flex items-center justify-start lg:justify-center">
        <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-xs hover:border-[#EA580C]/50 transition-colors">
          <Calendar size={18} className="text-[#EA580C] shrink-0" />
          <select
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
            className="border-0 bg-transparent text-sm font-semibold text-gray-800 focus:ring-0 cursor-pointer outline-none pr-2"
          >
            <option value="all">All Terms</option>
            {terms.map((t) => (
              <option key={t.id || t.termNumber} value={t.termName || `Term ${t.termNumber}`}>
                {t.termName || `Term ${t.termNumber}`} ({t.status === 'active' ? 'Active' : t.status})
              </option>
            ))}
            {terms.length === 0 && (
              <>
                <option value="Term 13">Term 13</option>
                <option value="Term 14">Term 14</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Right: Admin Profile */}
      <div className="hidden lg:flex items-center justify-end">
        <ProfileDropdown />
      </div>
    </div>
  );
}
