import { User, Users } from "lucide-react";

export default function ReferralTypeBadge({ type }) {
  const isConnect = type === "connect";

  if (isConnect) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/60 px-3 py-1 text-xs font-semibold text-teal-700">
        <Users size={13} className="text-teal-600" />
        Connect
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/60 px-3 py-1 text-xs font-semibold text-sky-600">
      <User size={13} className="text-sky-500" />
      Self
    </span>
  );
}
