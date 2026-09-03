import { useRef } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";

export function formatFriendlyDate(dateStr) {
  if (!dateStr) return "";
  // Split YYYY-MM-DD to avoid timezone shifting issues
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }); // e.g. "03 Sep 2026"
    }
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DatePicker({
  value,
  onChange,
  label,
  error,
  required,
  min,
  max,
  placeholder = "Select date",
  className = "",
  clearable = false,
}) {
  const inputRef = useRef(null);

  const formattedDisplay = value ? formatFriendlyDate(value) : "";

  const handleClick = () => {
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === "function") {
        try {
          inputRef.current.showPicker();
        } catch (_) {
          inputRef.current.focus();
        }
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div
        onClick={handleClick}
        className={[
          "relative flex items-center justify-between cursor-pointer rounded-xl border bg-card px-3.5 py-2.5 shadow-2xs transition-all hover:border-primary/60 hover:bg-orange-50/20",
          error
            ? "border-danger ring-1 ring-danger/20"
            : "border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100/80 text-[#EA580C]">
            <CalendarIcon size={15} />
          </div>
          <span
            className={`text-sm font-semibold truncate ${
              formattedDisplay ? "text-gray-900" : "text-gray-400 font-normal"
            }`}
          >
            {formattedDisplay || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {clearable && value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange({ target: { value: "" } });
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={14} />
            </button>
          )}
          <span className="text-xs font-bold text-[#EA580C] bg-orange-100/70 px-2.5 py-1 rounded-lg transition-colors group-hover:bg-orange-200/80">
            {value ? "Change" : "Select"}
          </span>
        </div>

        {/* Invisible date input overlaid over the entire box */}
        <input
          ref={inputRef}
          type="date"
          value={value || ""}
          onChange={onChange}
          min={min}
          max={max}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
        />
      </div>

      {error && <p className="mt-1 text-xs font-semibold text-danger">{error}</p>}
    </div>
  );
}
