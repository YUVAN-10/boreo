import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import MeetingStatusBadge from "./MeetingStatusBadge";
import AttendanceTable from "./AttendanceTable";
import MemberMiniProfile from "../rtor/MemberMiniProfile";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";

export default function PowerTeamMeetingDetails({ meeting, activeMembers = [] }) {
  const eligibleIds = meeting.eligibleMemberIds ?? meeting.memberIds ?? [];
  const trackedMembers =
    eligibleIds.length > 0 ? activeMembers.filter((member) => eligibleIds.includes(member.uid || member.id)) : activeMembers;

  const hasInviteList = eligibleIds.length > 0;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <Link
        to="/power-team-meetings"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#EA580C] transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Power Team Meetings
      </Link>

      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A8A]">{meeting.meetingName}</h1>
            <p className="mt-1 text-xs font-medium text-gray-500">Created {formatDate(meeting.createdAt)}</p>
          </div>
          <MeetingStatusBadge meeting={meeting} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <CalendarDays size={16} className="text-[#EA580C]" />
            {formatDate(meeting.meetingDate)}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <Clock size={16} className="text-[#EA580C]" />
            {formatTime(meeting.meetingTime)}
          </div>
          {meeting.place && (
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <MapPin size={16} className="text-[#1E3A8A]" />
              {meeting.place}
            </div>
          )}
          {meeting.powerTeamName && (
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <Users size={16} className="text-[#1E3A8A]" />
              Power Team: {meeting.powerTeamName}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <Users size={18} className="text-[#1E3A8A]" />
          <h2 className="text-sm font-bold text-[#1E3A8A]">Power Team Members</h2>
          <span className="text-xs text-gray-500 font-medium">
            {hasInviteList ? `(${trackedMembers.length})` : "(All active members)"}
          </span>
        </div>

        {hasInviteList ? (
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {trackedMembers.map((member) => (
              <MemberMiniProfile
                key={member.uid || member.id}
                name={member.fullName}
                ridNo={member.ridNo}
                image={member.profileImage}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            No specific members were invited — every active member is tracked for attendance.
          </p>
        )}
      </div>

      <AttendanceTable meetingId={meeting.id} activeMembers={trackedMembers} termId={meeting.termId || "Term 13"} />
    </div>
  );
}
