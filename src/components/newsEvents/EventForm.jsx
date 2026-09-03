import { useState } from "react";
import { Loader2 } from "lucide-react";
import EventImageUpload from "./EventImageUpload";
import { validateEventForm } from "../../utils/eventValidation";

function fieldClasses(hasError) {
  return [
    "w-full rounded-lg border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-1",
    hasError
      ? "border-danger focus:border-danger focus:ring-danger"
      : "border-border focus:border-primary focus:ring-primary",
  ].join(" ");
}

function Field({ label, error, full, required, children }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium text-text">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function EventForm({
  initialData,
  isEdit,
  activeCount,
  maxActive,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const wasActive = initialData.status === "Active";
  const activationBlocked = !wasActive && activeCount >= maxActive;

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageChange = (dataUrl) => {
    setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
    setErrors((prev) => ({ ...prev, imageUrl: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateEventForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
        <h2 className="mb-4 text-sm font-semibold text-secondary">Event Image</h2>
        <EventImageUpload image={formData.imageUrl} onChange={handleImageChange} error={errors.imageUrl} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
        <h2 className="mb-4 text-sm font-semibold text-secondary">Event Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Event Name" error={errors.name} required full>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="e.g. RMBF Business Networking Meet"
              className={fieldClasses(errors.name)}
            />
          </Field>

          <Field label="Description" full>
            <textarea
              rows={3}
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Briefly describe the event"
              className={fieldClasses(false)}
            />
          </Field>

          <Field label="Date" error={errors.eventDate} required>
            <input
              type="date"
              value={formData.eventDate}
              onChange={handleChange("eventDate")}
              className={fieldClasses(errors.eventDate)}
            />
          </Field>

          <Field label="Time" error={errors.eventTime} required>
            <input
              type="time"
              value={formData.eventTime}
              onChange={handleChange("eventTime")}
              className={fieldClasses(errors.eventTime)}
            />
          </Field>

          <Field label="Location">
            <input
              type="text"
              value={formData.location}
              onChange={handleChange("location")}
              placeholder="e.g. Erode"
              className={fieldClasses(false)}
            />
          </Field>

          {isEdit && (
            <Field label="Status">
              <select value={formData.status} onChange={handleChange("status")} className={fieldClasses(false)}>
                <option value="Active" disabled={activationBlocked}>
                  Active{activationBlocked ? " (limit reached)" : ""}
                </option>
                <option value="Inactive">Inactive</option>
              </select>
              {activationBlocked && (
                <p className="mt-1 text-xs text-danger">Maximum 5 active events allowed.</p>
              )}
            </Field>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
