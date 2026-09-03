import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Clock,
  Building2,
  Trash2,
  Loader2,
  X
} from "lucide-react";
import { getVisitor, updateVisitor, deleteVisitor } from "../../services/visitorService";
import { useMembers } from "../../context/MembersContext";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  if (typeof dateStr === "object" && dateStr?.toDate) {
    dateStr = dateStr.toDate();
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-sky-600 bg-sky-50">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <p className="text-sm font-bold text-gray-900 mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function VisitorDetails({ visitorId }) {
  const { id } = useParams();
  const activeId = visitorId || id;
  const navigate = useNavigate();
  const { members } = useMembers();

  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    visitorName: "",
    category: "",
    phone: "",
    companyName: "",
    dateOfBirth: "",
    visitDate: "",
    source: "signup",
    status: "Active",
    inviteById: "",
    inviteByName: "",
  });

  const loadData = async () => {
    if (!activeId) return;
    try {
      setLoading(true);
      const data = await getVisitor(activeId);
      setVisitor(data);
    } catch (err) {
      console.error("Error loading visitor details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeId]);

  const handleOpenEdit = () => {
    if (!visitor) return;
    setEditForm({
      visitorName: visitor.visitorName || visitor.name || "",
      category: visitor.category || visitor.productsServices || "",
      phone: visitor.phone || "",
      companyName: visitor.companyName || visitor.businessName || "",
      dateOfBirth: visitor.dateOfBirth || visitor.dob || "1975-09-19",
      visitDate: visitor.visitDate || new Date().toISOString().split("T")[0],
      source: visitor.source || "signup",
      status: visitor.status || "Active",
      inviteById: visitor.inviteById || "",
      inviteByName: visitor.inviteByName || visitor.inviteBy || "RMBF Erode United",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!visitor) return;
    if (!editForm.visitorName.trim()) {
      alert("Visitor Name is required.");
      return;
    }
    if (!editForm.category.trim()) {
      alert("Products / Services is required.");
      return;
    }
    if (!editForm.phone.trim()) {
      alert("Phone Number is required.");
      return;
    }

    try {
      setSaving(true);
      const invMember = members.find((m) => (m.uid || m.id) === editForm.inviteById);
      const payload = {
        ...editForm,
        inviteByName: invMember ? (invMember.fullName || invMember.name) : editForm.inviteByName,
      };
      await updateVisitor(visitor.id, payload);
      setIsEditing(false);
      await loadData();
    } catch (err) {
      console.error("Failed to update visitor:", err);
      alert("Failed to update visitor.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelVisitor = async () => {
    if (!window.confirm(`Are you sure you want to cancel visitor "${visitor.visitorName || visitor.name}"?`)) return;
    try {
      setSaving(true);
      await updateVisitor(visitor.id, { status: "Cancelled" });
      setIsEditing(false);
      await loadData();
    } catch (err) {
      console.error("Failed to cancel visitor:", err);
      alert("Failed to cancel visitor.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-400">
        <Loader2 size={28} className="animate-spin text-[#EA580C] mb-2" />
        <p className="text-xs font-medium">Loading visitor details...</p>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="space-y-4">
        <Link
          to="/visitors"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Visitors
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 font-medium">
          Visitor record not found.
        </div>
      </div>
    );
  }

  // Find Inviter Member details
  const inviterMember = members.find(
    (m) => (m.uid || m.id) === visitor.inviteById || (m.fullName || m.name) === visitor.inviteByName
  );
  const inviterName = visitor.inviteByName || visitor.inviteBy || inviterMember?.fullName || "RMBF Erode United";
  const inviterRid = inviterMember?.ridNo || "—";
  const inviterMemberId = visitor.inviteById || inviterMember?.uid || inviterMember?.id || "mem-1787150056022";

  return (
    <div className="space-y-5 animate-fade-in pb-10">
      {/* Back Button Header */}
      <div>
        <Link
          to="/visitors"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Visitors
        </Link>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Visitor Information */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-gray-900">Visitor Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
              {/* Left Sub-column */}
              <div className="space-y-4">
                <InfoItem icon={User} label="Name" value={visitor.visitorName || visitor.name} />
                <InfoItem icon={Phone} label="Phone" value={visitor.phone} />
                <InfoItem
                  icon={Calendar}
                  label="Date of Birth"
                  value={visitor.dateOfBirth || visitor.dob || "1975-09-19"}
                />
                <InfoItem icon={User} label="Source" value={visitor.source || "Signup"} />
              </div>

              {/* Right Sub-column */}
              <div className="space-y-4">
                <InfoItem
                  icon={Building2}
                  label="Products / Services"
                  value={visitor.category || visitor.productsServices || "Designing"}
                />
                <InfoItem
                  icon={Building2}
                  label="Company Name"
                  value={visitor.companyName || visitor.businessName || "JKV Durga designer"}
                />
                <InfoItem icon={Clock} label="Visit Date" value={formatDate(visitor.visitDate)} />
              </div>
            </div>
          </div>

          {/* Card 2: Timeline (Points removed) */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-gray-900">Timeline</h2>
            <div className="flex items-center gap-3.5 rounded-xl bg-gray-50/40 p-4 border border-gray-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Visitor Created</h3>
                <p className="text-xs text-gray-400 font-medium">
                  {formatDate(visitor.createdAt || visitor.visitDate)}
                </p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                  Invited by {inviterName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Membership Status Card */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Membership Status</h3>
            <div>
              <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                {visitor.status || "Active"}
              </span>
            </div>
          </div>

          {/* Invited By Card */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Invited By</h3>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-gray-400 font-medium">Name</p>
                <p className="font-bold text-gray-900 mt-0.5">{inviterName}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">RID Number</p>
                <p className="font-bold text-gray-900 mt-0.5">{inviterRid}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Member ID</p>
                <p className="font-bold text-gray-900 mt-0.5">{inviterMemberId}</p>
              </div>
            </div>
          </div>

          {/* Edit Visitor Action Button */}
          <div>
            <button
              onClick={handleOpenEdit}
              className="w-full rounded-xl bg-[#0088CC] py-3 text-sm font-bold text-white shadow-xs hover:bg-[#0077B5] transition-all cursor-pointer"
            >
              Edit Visitor
            </button>
          </div>
        </div>
      </div>

      {/* Edit Visitor Modal (Matching Reference Image 1) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-fade-in space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Edit Visitor</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5 text-xs">
              {/* 2-Column Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    Visitor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.visitorName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, visitorName: e.target.value }))}
                    placeholder="e.g. Jayakumar"
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    Products / Services <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.category}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. Designing"
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 9842448424"
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={editForm.companyName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, companyName: e.target.value }))}
                    placeholder="e.g. JKV Durga designer"
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Visit Date</label>
                  <input
                    type="date"
                    value={editForm.visitDate}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, visitDate: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Source</label>
                  <input
                    type="text"
                    disabled
                    value={editForm.source}
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 p-2.5 font-medium text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Joined">Joined</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Invite By Section */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-900 mb-2">Invite By</label>
                {editForm.inviteByName ? (
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-3">
                    <span className="font-semibold text-gray-800">{editForm.inviteByName}</span>
                    <button
                      type="button"
                      onClick={() => setEditForm((prev) => ({ ...prev, inviteById: "", inviteByName: "" }))}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors cursor-pointer"
                      title="Remove Inviter"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <select
                    value={editForm.inviteById}
                    onChange={(e) => {
                      const m = members.find((mem) => (mem.uid || mem.id) === e.target.value);
                      setEditForm((prev) => ({
                        ...prev,
                        inviteById: e.target.value,
                        inviteByName: m ? (m.fullName || m.name) : "",
                      }));
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  >
                    <option value="">-- Select Member --</option>
                    {members.map((m) => (
                      <option key={m.uid || m.id} value={m.uid || m.id}>
                        {m.fullName || m.name} ({m.businessName || "Member"})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancelVisitor}
                  className="rounded-xl bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Cancel Visitor
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#0088CC] px-5 py-2.5 font-bold text-white shadow-xs hover:bg-[#0077B5] disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
