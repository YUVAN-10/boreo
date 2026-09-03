import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import PowerTeamMemberPicker from "./PowerTeamMemberPicker";
import { useMasters } from "../../context/MastersContext";
import { useMembers } from "../../context/MembersContext";
import { useTerms } from "../../context/TermsContext";
import { validateMeetingForm } from "../../utils/meetingValidation";
import { slugifyPowerTeamName } from "../../utils/powerTeam";

function fieldClasses(hasError) {
  return [
    "w-full rounded-lg border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-1",
    hasError
      ? "border-danger focus:border-danger focus:ring-danger"
      : "border-border focus:border-primary focus:ring-primary",
  ].join(" ");
}

function Field({ label, error, full, children }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium text-text">
        {label} <span className="text-danger">*</span>
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function PowerTeamMeetingForm({ initialData, onSubmit, onCancel, submitLabel, isSubmitting = false }) {
  const { masters } = useMasters();
  const { members } = useMembers();
  const { activeTerm } = useTerms();

  const [formData, setFormData] = useState(() => ({
    ...initialData,
    meetingName: initialData?.powerTeamName ? initialData?.meetingName || "" : "",
    powerTeamName: initialData?.powerTeamName || initialData?.meetingName || "",
    memberIds: initialData?.eligibleMemberIds || initialData?.memberIds || [],
  }));
  const [errors, setErrors] = useState({});
  const previousTeamRef = useRef(formData.powerTeamName);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleMembersChange = (memberIds) => {
    setFormData((prev) => ({ ...prev, memberIds }));
  };

  useEffect(() => {
    if (previousTeamRef.current === formData.powerTeamName) return;
    previousTeamRef.current = formData.powerTeamName;

    const teamMemberIds = members
      .filter((m) => (m.status || "").toLowerCase() === "active" && m.powerTeam === formData.powerTeamName)
      .map((m) => m.uid);
    setFormData((prev) => ({ ...prev, memberIds: teamMemberIds }));
  }, [formData.powerTeamName, members]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateMeetingForm(formData);
    if (!formData.powerTeamName) {
      validationErrors.powerTeamName = "Power Team is required";
    }
    if (formData.memberIds.length === 0) {
      validationErrors.memberIds = "Select at least one eligible member";
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        meetingName: formData.meetingName,
        powerTeamName: formData.powerTeamName,
        powerTeamId: slugifyPowerTeamName(formData.powerTeamName),
        meetingDate: formData.meetingDate,
        meetingTime: formData.meetingTime,
        place: formData.place,
        eligibleMemberIds: formData.memberIds,
        eligibleMemberCount: formData.memberIds.length,
        termId: activeTerm?.termNumber ?? null,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
        <h2 className="mb-4 text-sm font-semibold text-secondary">Meeting Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Meeting Name" error={errors.meetingName} full>
            <input
              type="text"
              value={formData.meetingName}
              onChange={handleChange("meetingName")}
              placeholder="e.g. August Power Team Meeting"
              className={fieldClasses(errors.meetingName)}
            />
          </Field>

          <Field label="Power Team" error={errors.powerTeamName} full>
            <select
              value={formData.powerTeamName}
              onChange={handleChange("powerTeamName")}
              className={fieldClasses(errors.powerTeamName)}
            >
              <option value="">-- Select Power Team --</option>
              {masters.powerTeams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
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
              placeholder="e.g. RMBF Hall, Erode"
              className={fieldClasses(errors.place)}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in">
        <h2 className="mb-4 text-sm font-semibold text-secondary">Members</h2>
        {errors.memberIds && <p className="mb-2 text-xs text-danger">{errors.memberIds}</p>}
        <PowerTeamMemberPicker
          members={members}
          selectedIds={formData.memberIds}
          onChange={handleMembersChange}
          powerTeamName={formData.powerTeamName}
        />
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
