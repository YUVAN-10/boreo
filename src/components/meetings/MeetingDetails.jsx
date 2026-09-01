import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, MapPin, UserCheck, AlertCircle, FileText } from "lucide-react";
import MeetingStatusBadge from "./MeetingStatusBadge";
import AttendanceTable from "./AttendanceTable";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formatTime";

export default function MeetingDetails({ meeting, activeMembers = [] }) {
  const earlyGoingRequests = meeting.earlyGoingRequests || [];
  const leaveRequests = meeting.leaveRequests || [];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Back Link */}
      <Link
        to="/meetings"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#EA580C] transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Meetings
      </Link>

      {/* Meeting Overview Header Card */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A8A]">{meeting.meetingName}</h1>
            <p className="mt-1 text-xs font-medium text-gray-500">
              Created {formatDate(meeting.createdAt)}
            </p>
          </div>
          <MeetingStatusBadge meeting={meeting} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
            <CalendarDays size={18} className="text-[#EA580C]" />
            <span>{formatDate(meeting.meetingDate)}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
            <Clock size={18} className="text-[#EA580C]" />
            <span>{formatTime(meeting.meetingTime)}</span>
          </div>
          {meeting.place && (
            <div className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
              <MapPin size={18} className="text-[#1E3A8A]" />
              <span>{meeting.place}</span>
            </div>
          )}
        </div>

        {meeting.description && (
          <div className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-600">
            <p className="font-semibold text-gray-800 mb-1">Description:</p>
            <p>{meeting.description}</p>
          </div>
        )}
      </div>

      {/* Early Going & Leave Permission Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Early Going Permission Card */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-amber-200/60">
            <AlertCircle size={20} className="text-[#EA580C]" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">Early Going Permission Requests</h3>
              <p className="text-[11px] text-amber-700 font-medium">
                Members requesting permission to leave early (Attendance status remains Present)
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {earlyGoingRequests.length === 0 ? (
              <p className="text-xs text-gray-500 py-2">No early going permissions requested for this meeting.</p>
            ) : (
              earlyGoingRequests.map((req, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-white p-3 border border-amber-200/80 text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{req.memberName || req.name}</span>
                    <p className="text-[11px] text-gray-500">{req.reason || "Early exit request"}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                    Present (Permission Granted)
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Leave Permission Requests Card */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-blue-200/60">
            <FileText size={20} className="text-[#1E3A8A]" />
            <div>
              <h3 className="text-sm font-bold text-blue-900">Leave Requests</h3>
              <p className="text-[11px] text-blue-700 font-medium">
                Members requesting official leave for this meeting
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {leaveRequests.length === 0 ? (
              <p className="text-xs text-gray-500 py-2">No leave requests submitted for this meeting.</p>
            ) : (
              leaveRequests.map((req, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-white p-3 border border-blue-200/80 text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{req.memberName || req.name}</span>
                    <p className="text-[11px] text-gray-500">{req.reason || "Personal Leave"}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-800">
                    Leave Approved
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Manual Attendance Table */}
      <AttendanceTable meetingId={meeting.id} activeMembers={activeMembers} termId={meeting.termId || "Term 13"} />
    </div>
  );
}
