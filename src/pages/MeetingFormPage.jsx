import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MeetingForm from "../components/meetings/MeetingForm";
import { useMeetings } from "../context/MeetingsContext";
import { emptyMeeting } from "../data/meetingsData";
import { isMeetingEditable } from "../utils/meetingStatus";
import { MeetingLimitError } from "../services/meetingService";

export default function MeetingFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMeetingById, addMeeting, updateMeeting, loading } = useMeetings();
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
          to="/meetings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:text-[#EA580C]"
        >
          <ArrowLeft size={16} />
          Back to Meetings
        </Link>
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm font-medium text-gray-500">
          Meeting not found.
        </div>
      </div>
    );
  }

  if (isEdit && existingMeeting && !isMeetingEditable(existingMeeting)) {
    return (
      <div className="space-y-4">
        <Link
          to={`/meetings/${existingMeeting.id}`}
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

  const initialData = isEdit ? existingMeeting : { ...emptyMeeting };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateMeeting(existingMeeting.id, formData);
        navigate(`/meetings/${existingMeeting.id}`);
      } else {
        const created = await addMeeting(formData);
        navigate(`/meetings/${created.id || created}`);
      }
    } catch (error) {
      console.error("Error saving meeting:", error);
      alert(error instanceof MeetingLimitError ? error.message : "Failed to save meeting. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(isEdit ? `/meetings/${existingMeeting.id}` : "/meetings");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <Link
          to={isEdit ? `/meetings/${existingMeeting.id}` : "/meetings"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#EA580C] transition-colors"
        >
          <ArrowLeft size={16} />
          {isEdit ? "Back to Meeting" : "Back to Meetings"}
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-[#1E3A8A]">
          {isEdit ? "Edit Meeting" : "Create Meeting"}
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500">
          {isEdit
            ? `Update details for ${existingMeeting.meetingName}`
            : "Fill in the details to schedule a new meeting."}
        </p>
      </div>

      <MeetingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isEdit ? "Update Meeting" : "Create Meeting"}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
