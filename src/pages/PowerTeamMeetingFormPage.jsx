import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PowerTeamMeetingForm from "../components/meetings/PowerTeamMeetingForm";
import { usePowerTeamMeetings } from "../context/PowerTeamMeetingsContext";
import { emptyPowerTeamMeeting } from "../data/powerTeamMeetingsData";
import { isMeetingEditable } from "../utils/meetingStatus";
import { MeetingLimitError } from "../services/powerTeamMeetingService";

export default function PowerTeamMeetingFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMeetingById, addMeeting, updateMeeting, loading } = usePowerTeamMeetings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === "edit";
  const existingMeeting = isEdit ? getMeetingById(id) : null;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#EA580C] border-t-transparent"></div>
      </div>
    );
  }

  if (isEdit && !existingMeeting) {
    return (
      <div className="space-y-4">
        <Link
          to="/power-team-meetings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:text-[#EA580C]"
        >
          <ArrowLeft size={16} />
          Back to Power Team Meetings
        </Link>
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm font-medium text-gray-500">
          Power Team Meeting not found.
        </div>
      </div>
    );
  }

  if (isEdit && existingMeeting && !isMeetingEditable(existingMeeting)) {
    return (
      <div className="space-y-4">
        <Link
          to={`/power-team-meetings/${existingMeeting.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:text-[#EA580C]"
        >
          <ArrowLeft size={16} />
          Back to Meeting
        </Link>
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm font-medium text-gray-500">
          Only upcoming meetings can be edited.
        </div>
      </div>
    );
  }

  const initialData = isEdit ? existingMeeting : { ...emptyPowerTeamMeeting };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateMeeting(existingMeeting.id, formData);
        navigate(`/power-team-meetings/${existingMeeting.id}`);
      } else {
        const created = await addMeeting(formData);
        navigate(`/power-team-meetings/${created.id || created}`);
      }
    } catch (error) {
      console.error("Error saving power team meeting:", error);
      alert(error instanceof MeetingLimitError ? error.message : "Failed to save meeting. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(isEdit ? `/power-team-meetings/${existingMeeting.id}` : "/power-team-meetings");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <Link
          to={isEdit ? `/power-team-meetings/${existingMeeting.id}` : "/power-team-meetings"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#EA580C] transition-colors"
        >
          <ArrowLeft size={16} />
          {isEdit ? "Back to Meeting" : "Back to Power Team Meetings"}
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-[#1E3A8A]">
          {isEdit ? "Edit Power Team Meeting" : "Create Power Team Meeting"}
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500">
          {isEdit
            ? `Update details for ${existingMeeting.meetingName}`
            : "Fill in the details to schedule a new Power Team meeting."}
        </p>
      </div>

      <PowerTeamMeetingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isEdit ? "Update Meeting" : "Create Meeting"}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
