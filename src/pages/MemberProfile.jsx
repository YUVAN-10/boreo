import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  SquarePen,
  User,
  Briefcase,
  FileCheck,
} from "lucide-react";
import { useMembers } from "../context/MembersContext";
import MemberAvatar from "../components/members/MemberAvatar";
import MemberStatusBadge from "../components/members/MemberStatusBadge";
import { ProfileSection, ProfileField } from "../components/members/ProfileSection";
import { formatDate } from "../utils/formatDate";

function TopClientsList({ topClients }) {
  if (!Array.isArray(topClients) || !topClients.some((c) => c && String(c).trim())) return null;
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

  return (
    <div className="sm:col-span-2">
      <dt className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
        Top 10 Most Valued Clients
      </dt>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {topClients.map((client, idx) => {
          if (!client || !String(client).trim()) return null;
          return (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs font-medium"
            >
              <span className="font-bold text-[#EA580C]">{ROMAN[idx]})</span>
              <span className="text-gray-900">{client}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MemberProfile() {
  const { id } = useParams();
  const { members, loading } = useMembers();

  const member = useMemo(() => {
    if (!id || !members) return null;
    return members.find(
      (m) =>
        m.id === id ||
        m.uid === id ||
        String(m.id) === String(id) ||
        String(m.uid) === String(id)
    );
  }, [members, id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#EA580C] border-t-transparent"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-4">
        <Link
          to="/members"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#EA580C]"
        >
          <ArrowLeft size={16} />
          Back to Members
        </Link>
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm font-medium text-gray-500">
          Member record not found (ID: {id}).
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <Link
        to="/members"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#EA580C] transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Members
      </Link>

      {/* Profile header */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <MemberAvatar name={member.fullName} image={member.profileImage} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-[#1E3A8A]">{member.fullName}</h1>
              <p className="text-sm font-semibold text-gray-500">
                {member.ridNo ? `${member.ridNo} • ` : ""}
                {member.companyName}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <MemberStatusBadge status={member.status} />
                {member.representingCategory && (
                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1E3A8A]">
                    {member.representingCategory}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            to={`/members/${member.uid || member.id}/edit`}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#EA580C] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#c2410c] transition-all"
          >
            <SquarePen size={16} />
            Edit Member
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProfileSection title="Personal Information" icon={User}>
          <ProfileField label="Date of Joining" value={formatDate(member.joiningDate || member.applicationDate)} />
          <ProfileField label="Applicant Name" value={member.fullName} />
          <ProfileField label="Date of Birth" value={formatDate(member.dateOfBirth)} />
          <ProfileField label="Age" value={member.age ? `${member.age} yrs` : null} />
          <ProfileField label="Sex" value={member.sex} />
          <ProfileField label="Blood Group" value={member.bloodGroup} />
          <ProfileField label="Mobile No" value={member.phone} />
          <ProfileField label="Whatsapp No" value={member.whatsappNo} />
          <ProfileField label="Office Landline" value={member.officeNo} />
          <ProfileField label="Mail Id" value={member.email} />
          <ProfileField label="Website" value={member.websiteUrl} />
          <ProfileField label="Aadhar No" value={member.aadharNo} />
          <ProfileField label="PAN No" value={member.panNo} />
        </ProfileSection>

        <ProfileSection title="Business Information" icon={Briefcase}>
          <ProfileField label="Company Name" value={member.companyName} full />
          <ProfileField label="Firm Type" value={member.firmType} />
          <ProfileField label="Profession Details" value={member.professionDetails} />
          <ProfileField label="Staff Working in Office" value={member.totalStaff} />
          <ProfileField label="GST No" value={member.gstNo} />
          <ProfileField label="Annual Turnover" value={member.annualTurnover} full />
          <ProfileField label="Office Address" value={member.officeAddress} full />
        </ProfileSection>

        <ProfileSection title="BOREO Application & Clients" icon={FileCheck}>
          <ProfileField
            label="How do you know about BOREO ?"
            value={
              member.howDoYouKnow === "Others" && member.howDoYouKnowOthers
                ? `Others (${member.howDoYouKnowOthers})`
                : member.howDoYouKnow
            }
            full
          />
          <ProfileField label="Representing Category in BOREO" value={member.representingCategory} full />
          <ProfileField label="Is Proxy Available" value={member.proxyAvailable} full />
          <TopClientsList topClients={member.topClients} />
        </ProfileSection>
      </div>
    </div>
  );
}
