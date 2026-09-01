import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, SquarePen, Phone, Building2, Ban, CheckCircle2, Loader2 } from "lucide-react";
import MemberAvatar from "./MemberAvatar";
import MemberStatusBadge from "./MemberStatusBadge";
import { updateMemberStatus } from "../../services/memberService";

export default function MemberCard({ member }) {
  const [statusSaving, setStatusSaving] = useState(false);
  const isActive = member.status === "Active";
  const memberId = member.uid || member.id;

  const handleToggleStatus = async () => {
    if (isActive && !window.confirm(`Disable ${member.fullName}? They will lose access to the member app.`)) {
      return;
    }
    setStatusSaving(true);
    try {
      await updateMemberStatus(memberId, isActive ? "Inactive" : "Active");
    } catch (error) {
      console.error("Error updating member status:", error);
      alert("Failed to update member status. Please try again.");
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <MemberAvatar name={member.fullName} image={member.profileImage} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-gray-900">{member.fullName}</p>
          <p className="text-xs font-semibold text-[#1E3A8A]">{member.ridNo}</p>
        </div>
        <MemberStatusBadge status={member.status} />
      </div>

      <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-xs text-gray-600 font-medium">
        <p className="flex items-center gap-1.5">
          <Phone size={13} className="text-[#EA580C]" />
          {member.phone}
        </p>
        <p className="flex items-center gap-1.5">
          <Building2 size={13} className="text-[#1E3A8A]" />
          {member.companyName || member.businessName || "—"}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
        <Link
          to={`/members/${memberId}`}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#1E3A8A] px-3 py-2 text-xs font-bold text-[#1E3A8A] transition-colors hover:bg-blue-50 cursor-pointer"
        >
          <Eye size={15} />
          View
        </Link>
        <Link
          to={`/members/${memberId}/edit`}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
        >
          <SquarePen size={15} />
          Edit
        </Link>
        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={statusSaving}
          className={[
            "flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            isActive ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
          ].join(" ")}
        >
          {statusSaving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : isActive ? (
            <Ban size={15} />
          ) : (
            <CheckCircle2 size={15} />
          )}
          {isActive ? "Active" : "Inactive"}
        </button>
      </div>
    </div>
  );
}
