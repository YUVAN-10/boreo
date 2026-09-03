import { Link } from "react-router-dom";
import { Eye, ArrowDown } from "lucide-react";
import ReferralRow from "./ReferralRow";
import ReferralTypeBadge from "./ReferralTypeBadge";
import { formatReferralDate, formatReferralTime } from "../../utils/formatReferralDate";

export default function ReferralTable({ referrals, startSerialNo, getMember }) {
  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-gray-200/80 bg-white shadow-xs md:block">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">
              <th className="px-4 py-3.5">S.NO</th>
              <th className="px-4 py-3.5">TYPE</th>
              <th className="px-4 py-3.5">REFERRER</th>
              <th className="px-4 py-3.5">CONNECTOR</th>
              <th className="px-4 py-3.5">REFERRED TO</th>
              <th className="px-4 py-3.5">DATE</th>
              <th className="px-4 py-3.5">TIME</th>
              <th className="px-4 py-3.5 text-center">ACTION</th>
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
        {referrals.map((referral, index) => {
          const referrerMember = getMember(referral.referrerId);
          const connectorMember = getMember(referral.connectorId);
          const referredMember = getMember(referral.referredUserId || referral.referredMemberId);

          const isConnect = referral.type === "connect";
          const referrerName = referral.referrerName || referrerMember?.fullName || "Referrer";
          const connectorName = referral.connectorName || connectorMember?.fullName || connectorMember?.companyName;
          const referredName = referral.referredUserName || referral.referredMemberName || referredMember?.fullName || "Referred Member";

          const createdAt = referral.createdAt || referral.date;

          return (
            <div
              key={referral.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">#{startSerialNo + index}</span>
                <ReferralTypeBadge type={referral.type} />
                <span className="text-[11px] font-medium text-gray-500">
                  {formatReferralDate(createdAt)} {formatReferralTime(createdAt)}
                </span>
              </div>

              <div className="space-y-1.5 border-t border-b border-gray-100 py-2.5 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Referrer:</span>
                  <p className="font-bold text-gray-900">{referrerName}</p>
                  {(referrerMember?.ridNo || referral.referrerRidNo) && (
                    <p className="text-[10px] text-gray-400">RID: {referrerMember?.ridNo || referral.referrerRidNo}</p>
                  )}
                </div>

                {isConnect && connectorName && (
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Connector:</span>
                    <p className="font-bold text-gray-800">{connectorName}</p>
                  </div>
                )}

                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Referred To:</span>
                  <p className="font-bold text-gray-900">{referredName}</p>
                  {(referredMember?.ridNo || referral.referredRidNo) && (
                    <p className="text-[10px] text-gray-400">RID: {referredMember?.ridNo || referral.referredRidNo}</p>
                  )}
                </div>
              </div>

              <Link
                to={`/referrals/${referral.id}`}
                className="flex items-center justify-center gap-1.5 rounded-full border border-gray-200 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye size={13} />
                View
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
