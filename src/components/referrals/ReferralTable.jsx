import { Link } from "react-router-dom";
import { ArrowDown, Eye } from "lucide-react";
import ReferralRow from "./ReferralRow";
import MemberMiniProfile from "../rtor/MemberMiniProfile";
import { formatReferralDate } from "../../utils/formatReferralDate";

export default function ReferralTable({ referrals, startSerialNo, getMember }) {
  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-gray-200/80 bg-white shadow-xs md:block">
        <table className="w-full min-w-[760px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-5 py-3.5">S.No</th>
              <th className="px-5 py-3.5">Referrer</th>
              <th className="px-5 py-3.5">Referred Member</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            {referrals.map((referral, index) => (
              <ReferralRow
                key={referral.id}
                referral={referral}
                serialNo={startSerialNo + index}
                getMember={getMember}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {referrals.map((referral) => {
          const referrerMember = getMember(referral.referrerId);
          const referredMember = getMember(referral.referredUserId || referral.referredMemberId);
          const status = referral.status || "Joined";

          return (
            <div
              key={referral.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs"
            >
              <div className="mb-3 flex items-center justify-between">
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
                <span className="text-xs font-medium text-gray-500">
                  {formatReferralDate(referral.createdAt || referral.date)}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <MemberMiniProfile
                  name={referral.referrerName || referrerMember?.fullName || "Referrer"}
                  ridNo={referrerMember?.ridNo}
                  image={referrerMember?.profileImage}
                  layout="column"
                  size="md"
                />
                <ArrowDown size={16} className="text-gray-300" />
                <MemberMiniProfile
                  name={referral.referredUserName || referral.referredMemberName || referredMember?.fullName || "Referred Member"}
                  ridNo={referredMember?.ridNo}
                  image={referredMember?.profileImage}
                  layout="column"
                  size="md"
                />
              </div>

              <Link
                to={`/referrals/${referral.id}`}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-xs font-bold text-[#1E3A8A] hover:bg-blue-50 transition-colors"
              >
                <Eye size={13} />
                View Details
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
