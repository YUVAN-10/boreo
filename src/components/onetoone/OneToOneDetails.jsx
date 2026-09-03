import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Edit3, Trash2, Loader2, X } from "lucide-react";
import { getOneToOneById, updateOneToOne, deleteOneToOne } from "../../services/oneToOneService";
import { useMembers } from "../../context/MembersContext";

function formatDateLong(dateStr) {
  if (!dateStr) return "03 September 2026";
  if (typeof dateStr === "object" && dateStr?.toDate) {
    dateStr = dateStr.toDate();
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name) {
  if (!name) return "RR";
  const parts = name.trim().split(" ");
  let initials = parts[0]?.[0] || "";
  if (parts.length > 1) {
    initials += parts[parts.length - 1]?.[0] || "";
  }
  return initials.toUpperCase().slice(0, 2);
}

export default function OneToOneDetails({ recordId }) {
  const { id } = useParams();
  const activeId = recordId || id;
  const navigate = useNavigate();
  const { members } = useMembers();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Meeting Location State
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationValue, setLocationValue] = useState("");
  const [savingLocation, setSavingLocation] = useState(false);

  const loadData = async () => {
    if (!activeId) return;
    try {
      setLoading(true);
      const data = await getOneToOneById(activeId);
      setRecord(data);
    } catch (err) {
      console.error("Error loading One to One details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeId]);

  const handleOpenEditLocation = () => {
    if (!record) return;
    setLocationValue(record.meetingLocation || record.meetingOfficeName || "From Member Office");
    setIsEditingLocation(true);
  };

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    if (!record) return;
    try {
      setSavingLocation(true);
      await updateOneToOne(record.id, {
        meetingLocation: locationValue,
        meetingOfficeName: locationValue,
      });
      setIsEditingLocation(false);
      await loadData();
    } catch (err) {
      console.error("Failed to update location:", err);
      alert("Failed to update location.");
    } finally {
      setSavingLocation(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!record) return;
    if (!window.confirm("Are you sure you want to delete this R to R record?")) return;

    try {
      await deleteOneToOne(record.id);
      navigate("/one-to-one");
    } catch (err) {
      console.error("Failed to delete record:", err);
      alert("Failed to delete R to R record.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-400">
        <Loader2 size={28} className="animate-spin text-[#EA580C] mb-2" />
        <p className="text-xs font-medium">Loading R to R details...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="space-y-4">
        <Link
          to="/one-to-one"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to R to R
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 font-medium">
          R to R record not found.
        </div>
      </div>
    );
  }

  // Find Members
  const fromMem = members.find((m) => (m.uid || m.id) === record.fromMemberId);
  const toMem = members.find((m) => (m.uid || m.id) === record.toMemberId);

  const fromName = record.fromMemberName || fromMem?.fullName || "Rtn. Member";
  const fromRid = fromMem?.ridNo || record.fromMemberRid || "BOUR013001";

  const toName = record.toMemberName || toMem?.fullName || "Rtn. Member";
  const toRid = toMem?.ridNo || record.toMemberRid || "BOUR013002";

  const meetingLocation = record.meetingLocation || record.meetingOfficeName || "From Member Office";

  return (
    <div className="space-y-5 animate-fade-in pb-10 max-w-6xl mx-auto">
      {/* Back Button */}
      <div>
        <Link
          to="/one-to-one"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to R to R
        </Link>
      </div>

      {/* Main Container Card matching reference layout */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-6">
        {/* Card Top Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              R TO R DETAILS
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">Office-Based Connection</h1>
          </div>

          <button
            onClick={handleOpenEditLocation}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Edit3 size={14} className="text-gray-500" />
            Edit Meeting Location
          </button>
        </div>

        {/* Section 1: Connection Card (From Member -> To Member) */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/40 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 text-center sm:text-left">
            {/* From Member */}
            <div className="flex flex-col items-center sm:items-start space-y-1.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase">FROM MEMBER</span>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold text-lg my-1">
                {getInitials(fromName)}
              </div>
              <p className="font-bold text-gray-900 text-sm">{fromName}</p>
              <p className="text-xs text-gray-400 font-normal">RID: {fromRid}</p>
            </div>

            {/* Arrow Center */}
            <div className="flex justify-center py-2 sm:py-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                <ArrowRight size={20} />
              </div>
            </div>

            {/* To Member */}
            <div className="flex flex-col items-center sm:items-start space-y-1.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase">TO MEMBER</span>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold text-lg my-1">
                {getInitials(toName)}
              </div>
              <p className="font-bold text-gray-900 text-sm">{toName}</p>
              <p className="text-xs text-gray-400 font-normal">RID: {toRid}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Meeting Conducted At */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/40 p-5 space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase block">
            MEETING CONDUCTED AT
          </span>
          <div>
            <span className="inline-block rounded-full bg-sky-50 border border-sky-200/60 px-3.5 py-1 text-xs font-semibold text-sky-700">
              {meetingLocation}
            </span>
          </div>
        </div>

        {/* Section 3: Member Cards (Host & Visitor) - Points Removed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-200/60 bg-white p-4 space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase block">
              HOST MEMBER
            </span>
            <p className="font-bold text-gray-900 text-xs sm:text-sm">{fromName}</p>
          </div>

          <div className="rounded-2xl border border-gray-200/60 bg-white p-4 space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase block">
              VISITOR MEMBER
            </span>
            <p className="font-bold text-gray-900 text-xs sm:text-sm">{toName}</p>
          </div>
        </div>

        {/* Section 4: Metadata Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-100 pt-5 text-xs">
          <div>
            <span className="text-gray-400 font-medium block mb-1">MEETING DATE</span>
            <p className="font-bold text-gray-900">{formatDateLong(record.date)}</p>
          </div>
          <div>
            <span className="text-gray-400 font-medium block mb-1">MEETING TIME</span>
            <p className="font-bold text-gray-900">{record.time || "10:00 AM"}</p>
          </div>
          <div>
            <span className="text-gray-400 font-medium block mb-1">CREATED AT</span>
            <p className="font-bold text-gray-900">
              {formatDateLong(record.createdAt || record.date)}, {record.time || "10:00 AM"}
            </p>
          </div>
          <div>
            <span className="text-gray-400 font-medium block mb-1">TERM</span>
            <p className="font-bold text-gray-900">{record.termId || "Term 13"}</p>
          </div>
        </div>

        {/* Section 5: Bottom Delete Action Button */}
        <div className="flex justify-end border-t border-gray-100 pt-5">
          <button
            onClick={handleDeleteRecord}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            Delete R to R
          </button>
        </div>
      </div>

      {/* Edit Location Modal */}
      {isEditingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Edit Meeting Location</h3>
              <button
                onClick={() => setIsEditingLocation(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Meeting Location</label>
                <input
                  type="text"
                  required
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  placeholder="e.g. From Member Office"
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingLocation(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLocation}
                  className="rounded-xl bg-[#0088CC] px-4 py-2 font-bold text-white shadow-xs hover:bg-[#0077B5] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {savingLocation ? "Saving..." : "Save Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
