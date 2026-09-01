import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, SquarePen, Ban, CheckCircle2, Loader2 } from "lucide-react";
import MemberAvatar from "./MemberAvatar";
import MemberStatusBadge from "./MemberStatusBadge";
import { updateMemberStatus } from "../../services/memberService";

export default function MemberRow({ member, serialNo }) {
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
    <tr className="border-b border-gray-100 transition-colors last:border-0 hover:bg-blue-50/30">
      <td className="px-4 py-3 text-[#1E3A8A] font-semibold">{serialNo}</td>
      <td className="px-4 py-3">
        <MemberAvatar name={member.fullName} image={member.profileImage} size="sm" />
      </td>
      <td className="px-4 py-3 font-bold text-[#1E3A8A]">{member.ridNo || "—"}</td>
      <td className="px-4 py-3 font-bold text-gray-900">{member.fullName}</td>
      <td className="px-4 py-3 text-gray-600 font-medium">{member.phone}</td>
      <td className="px-4 py-3 text-gray-700 font-medium">{member.companyName || member.businessName || "—"}</td>
      <td className="px-4 py-3">
        <MemberStatusBadge status={member.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link
            to={`/members/${memberId}`}
            className="flex items-center gap-1.5 rounded-xl border border-[#1E3A8A] px-3 py-1.5 text-xs font-bold text-[#1E3A8A] transition-colors hover:bg-blue-50 cursor-pointer"
          >
            <Eye size={14} />
            View
          </Link>
          <Link
            to={`/members/${memberId}/edit`}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
          >
            <SquarePen size={14} />
            Edit
          </Link>
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={statusSaving}
            className={[
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
              isActive
                ? "bg-red-50 text-red-700 hover:bg-red-100"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
            ].join(" ")}
          >
            {statusSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isActive ? (
              <Ban size={14} />
            ) : (
              <CheckCircle2 size={14} />
            )}
            {isActive ? "Active" : "Inactive"}
          </button>
        </div>
      </td>
    </tr>
  );
}
