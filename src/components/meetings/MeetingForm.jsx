import { useState } from "react";
import { Loader2 } from "lucide-react";
import { validateMeetingForm } from "../../utils/meetingValidation";

function fieldClasses(hasError) {
  return [
    "w-full rounded-xl border bg-gray-50/50 px-3.5 py-2.5 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
      : "border-gray-200 focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]",
  ].join(" ");
}

function Field({ label, error, full, children }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-bold text-[#1E3A8A]">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}

export default function MeetingForm({ initialData, onSubmit, onCancel, submitLabel, isSubmitting = false }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateMeetingForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs animate-fade-in">
        <h2 className="mb-4 text-base font-bold text-[#1E3A8A]">Meeting Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Meeting Name" error={errors.meetingName} full>
            <input
              type="text"
              value={formData.meetingName}
              onChange={handleChange("meetingName")}
              placeholder="e.g. Weekly Regular Meeting"
              className={fieldClasses(errors.meetingName)}
            />
          </Field>

          <Field label="Date" error={errors.meetingDate}>
            <input
              type="date"
              value={formData.meetingDate}
              onChange={handleChange("meetingDate")}
              className={fieldClasses(errors.meetingDate)}
            />
          </Field>

          <Field label="Time" error={errors.meetingTime}>
            <input
              type="time"
              value={formData.meetingTime}
              onChange={handleChange("meetingTime")}
              className={fieldClasses(errors.meetingTime)}
            />
          </Field>

          <Field label="Place" error={errors.place} full>
            <input
              type="text"
              value={formData.place}
              onChange={handleChange("place")}
              placeholder="e.g. Hotel Grand, Erode"
              className={fieldClasses(errors.place)}
            />
          </Field>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold text-[#1E3A8A]">Description / Agenda</label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={handleChange("description")}
              placeholder="Optional meeting details or agenda notes..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#EA580C] focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="rounded-xl border border-[#1E3A8A] px-5 py-2.5 text-xs font-semibold text-[#1E3A8A] hover:bg-blue-50 disabled:opacity-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#EA580C] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#c2410c] disabled:opacity-50 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
