import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  SquarePen,
  User,
  Users,
  Briefcase,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import { useMembers } from "../context/MembersContext";
import MemberAvatar from "../components/members/MemberAvatar";
import MemberStatusBadge from "../components/members/MemberStatusBadge";
import { ProfileSection, ProfileField } from "../components/members/ProfileSection";
import { formatDate } from "../utils/formatDate";

function memberLabel(members, uid) {
  if (!uid) return "—";
  const member = members.find((m) => m.uid === uid || m.id === uid);
  return member ? `${member.ridNo || 'RID'} - ${member.fullName}` : uid;
}

function ChildrenList({ title, children }) {
  if (!Array.isArray(children) || children.length === 0) return null;
  return (
    <div className="sm:col-span-2">
      <dt className="mb-2 text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">{title}</dt>
      <div className="space-y-2">
        {children.map((child, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-xs sm:grid-cols-4 font-medium"
          >
            <div>
              <p className="text-[11px] text-gray-500">Name</p>
              <p className="text-gray-900 font-bold">{child.name || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500">DOB</p>
              <p className="text-gray-800">{formatDate(child.dob) || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500">Blood</p>
              <p className="text-gray-800">{child.blood || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500">Qualification</p>
              <p className="text-gray-800">{child.qualification || "—"}</p>
            </div>
          </div>
        ))}
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
              <p className="text-sm font-semibold text-gray-500">{member.ridNo || member.businessName}</p>
              <div className="mt-2">
                <MemberStatusBadge status={member.status} />
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
          <ProfileField label="Full Name" value={member.fullName} />
          <ProfileField label="Date of Birth" value={formatDate(member.dateOfBirth)} />
          <ProfileField label="Blood Group" value={member.bloodGroup} />
          <ProfileField label="Phone" value={member.phone} />
          <ProfileField label="Email" value={member.email} />
          <ProfileField label="Education" value={member.education} />
          <ProfileField label="Address" value={member.address} full />
        </ProfileSection>

        <ProfileSection title="Business Information" icon={Briefcase}>
          <ProfileField label="Company Name" value={member.companyName || member.businessName} />
          <ProfileField label="Business Type" value={member.businessType || member.category} />
          <ProfileField label="Business Address" value={member.businessAddress} full />
          <ProfileField label="Office Number" value={member.officeNo} />
          <ProfileField label="Website" value={member.websiteUrl} />
          <ProfileField label="Social Media" value={member.socialMedia} full />
          <ProfileField label="Business Start Date" value={formatDate(member.businessStartDate)} />
          <ProfileField label="Experience (years)" value={member.experienceYears} />
          <ProfileField label="Business Expertise" value={member.businessExpertise} full />
          <ProfileField label="Why should someone buy from you?" value={member.whyBuyFromYou} full />
          <ProfileField label="About Business" value={member.aboutBusiness} full />
          <ProfileField label="Business Mission" value={member.businessMission} full />
          <ProfileField label="Business Vision" value={member.businessVision} full />
          <ProfileField label="Flyer" value={member.flyer} />
        </ProfileSection>

        <ProfileSection title="Membership Information" icon={IdCard}>
          <ProfileField label="RID Number" value={member.ridNo} />
          <ProfileField label="Joining Date" value={formatDate(member.joiningDate)} />
          <ProfileField label="Status" value={member.status} />
        </ProfileSection>

        <ProfileSection title="Team & Sponsorship" icon={ShieldCheck}>
          <ProfileField label="Power Team" value={member.powerTeam} />
          <ProfileField label="Position" value={member.position} />
          <ProfileField label="Director" value={member.director} />
          <ProfileField label="Coordinator" value={member.coordinator} />
          <ProfileField label="Introduced By" value={memberLabel(members, member.introducedBy)} />
          <ProfileField label="Authenticated By" value={memberLabel(members, member.authenticatedBy)} />
        </ProfileSection>

        <ProfileSection title="Family Information" icon={Users}>
          <ProfileField label="Father's Name" value={member.fatherName} />
          <ProfileField label="Member Qualification" value={member.memberQualification} />
          <ProfileField label="Wife Name" value={member.wifeName} />
          <ProfileField label="Wife DOB" value={formatDate(member.wifeDob)} />
          <ProfileField label="Wife Blood Group" value={member.wifeBloodGroup} />
          <ProfileField label="Wife Qualification" value={member.wifeQualification} />
          <ChildrenList title="Sons" children={member.sons} />
          <ChildrenList title="Daughters" children={member.daughters} />
        </ProfileSection>
      </div>
    </div>
  );
}
