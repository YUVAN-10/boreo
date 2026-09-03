import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import ReferralTypeBadge from "./ReferralTypeBadge";
import { formatReferralDate, formatReferralTime } from "../../utils/formatReferralDate";

function InitialsAvatar({ name, image, colorScheme = "sky" }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name || "Avatar"}
        className="h-7 w-7 rounded-full object-cover shrink-0 border border-gray-200"
      />
    );
  }

  if (!name) return null;
  const parts = name.trim().split(" ");
  let initials = parts[0]?.[0] || "";
  if (parts.length > 1) {
    initials += parts[parts.length - 1]?.[0] || "";
  }
  initials = initials.toUpperCase().slice(0, 2);

  const bgClasses =
    colorScheme === "teal"
      ? "bg-teal-100 text-teal-700"
      : "bg-sky-100 text-sky-700";

  return (
    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${bgClasses} text-[11px] font-bold`}>
      {initials}
    </div>
  );
}

export default function ReferralRow({ referral, serialNo, getMember }) {
  const referrerMember = getMember(referral.referrerId);
  const connectorMember = getMember(referral.connectorId);
  const referredMember = getMember(referral.referredUserId || referral.referredMemberId);

  const isConnect = referral.type === "connect";

  const referrerName = referral.referrerName || referrerMember?.fullName || "Referrer";
  const referrerRid = referrerMember?.ridNo || referral.referrerRidNo;

  const connectorName = referral.connectorName || connectorMember?.fullName || connectorMember?.companyName;
  const connectorImage = connectorMember?.profileImage;

  const referredName = referral.referredUserName || referral.referredMemberName || referredMember?.fullName || "Referred Member";
  const referredRid = referredMember?.ridNo || referral.referredRidNo;
  const referredImage = referredMember?.profileImage;

  const createdAt = referral.createdAt || referral.date;

  return (
    <tr className="border-b border-gray-100 transition-colors last:border-0 hover:bg-slate-50/70 text-xs">
      {/* S.NO */}
      <td className="px-4 py-3.5 font-medium text-gray-500">{serialNo}</td>

      {/* TYPE */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <ReferralTypeBadge type={referral.type} />
      </td>

      {/* REFERRER */}
      <td className="px-4 py-3.5">
        <div>
          <p className="font-bold text-gray-900 text-xs">{referrerName}</p>
          {referrerRid && <p className="text-[11px] font-normal text-gray-400">RID: {referrerRid}</p>}
        </div>
      </td>

      {/* CONNECTOR */}
      <td className="px-4 py-3.5">
        {isConnect && connectorName ? (
          <div className="flex items-center gap-2">
            <InitialsAvatar name={connectorName} image={connectorImage} colorScheme="sky" />
            <span className="font-semibold text-gray-800 text-xs">{connectorName}</span>
          </div>
        ) : (
          <span className="text-gray-400 font-light text-xs">—</span>
        )}
      </td>

      {/* REFERRED TO */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <InitialsAvatar name={referredName} image={referredImage} colorScheme="teal" />
          <div>
            <p className="font-bold text-gray-900 text-xs">{referredName}</p>
            {referredRid && <p className="text-[11px] font-normal text-gray-400">RID: {referredRid}</p>}
          </div>
        </div>
      </td>

      {/* DATE */}
      <td className="px-4 py-3.5 whitespace-nowrap text-gray-600 font-medium">
        {formatReferralDate(createdAt)}
      </td>

      {/* TIME */}
      <td className="px-4 py-3.5 whitespace-nowrap text-gray-600 font-medium">
        {formatReferralTime(createdAt)}
      </td>

      {/* ACTION */}
      <td className="px-4 py-3.5 text-center">
        <Link
          to={`/referrals/${referral.id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
        >
          <Eye size={13} className="text-gray-500" />
          View
        </Link>
      </td>
    </tr>
  );
}
