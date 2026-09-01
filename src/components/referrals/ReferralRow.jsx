import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import MemberMiniProfile from "../rtor/MemberMiniProfile";
import { formatReferralDate } from "../../utils/formatReferralDate";

export default function ReferralRow({ referral, serialNo, getMember }) {
  const referrerMember = getMember(referral.referrerId);
  const referredMember = getMember(referral.referredUserId || referral.referredMemberId);

  const status = referral.status || "Joined";

  return (
    <tr className="border-b border-gray-100 transition-colors last:border-0 hover:bg-blue-50/30 text-xs">
      <td className="px-5 py-4 font-semibold text-gray-500">{serialNo}</td>
      <td className="px-5 py-4">
        <MemberMiniProfile
          name={referral.referrerName || referrerMember?.fullName || "Referrer"}
          ridNo={referrerMember?.ridNo}
          image={referrerMember?.profileImage}
        />
      </td>
      <td className="px-5 py-4">
        <MemberMiniProfile
          name={referral.referredUserName || referral.referredMemberName || referredMember?.fullName || "Referred Member"}
          ridNo={referredMember?.ridNo}
          image={referredMember?.profileImage}
        />
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-gray-600 font-medium">
        {formatReferralDate(referral.createdAt || referral.date)}
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
            status === "Joined"
              ? "bg-emerald-100 text-emerald-800"
              : status === "Cancelled"
              ? "bg-gray-100 text-gray-700"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <Link
          to={`/referrals/${referral.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] hover:bg-blue-50 transition-colors"
        >
          <Eye size={13} />
          View
        </Link>
      </td>
    </tr>
  );
}
