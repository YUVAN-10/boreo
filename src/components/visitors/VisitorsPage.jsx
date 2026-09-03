import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Search,
  Filter,
  FileSpreadsheet,
  Trash2,
  Edit,
  Eye,
  UserCheck,
  X
} from "lucide-react";
import { getVisitors, updateVisitor, deleteVisitor, convertVisitorToMember } from "../../services/visitorService";
import { useMembers } from "../../context/MembersContext";
import { exportToExcel } from "../../utils/exportExcel";

const EXPORT_COLUMNS = [
  { key: "visitorName", header: "Visitor Name" },
  { key: "inviteByName", header: "Invited By" },
  { key: "companyName", header: "Company / Business" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
  { key: "status", header: "Status" },
  { key: "visitDate", header: "Visit Date" },
];

export default function VisitorsPage() {
  const { members } = useMembers();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State for Editing
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State for Editing
  const [formData, setFormData] = useState({
    visitorName: "",
    category: "",
    phone: "",
    companyName: "",
    dateOfBirth: "",
    visitDate: new Date().toISOString().split("T")[0],
    source: "signup",
    status: "Active",
    inviteById: "",
    inviteByName: "",
  });

  const loadVisitors = async () => {
    try {
      setLoading(true);
      const data = await getVisitors();
      setVisitors(data);
    } catch (err) {
      console.error("Error loading visitors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleOpenEditModal = (vis) => {
    setEditingVisitor(vis);
    setFormData({
      visitorName: vis.visitorName || vis.name || "",
      category: vis.category || vis.productsServices || "",
      phone: vis.phone || "",
      companyName: vis.companyName || vis.businessName || "",
      dateOfBirth: vis.dateOfBirth || vis.dob || "1975-09-19",
      visitDate: vis.visitDate || new Date().toISOString().split("T")[0],
      source: vis.source || "signup",
      status: vis.status || "Active",
      inviteById: vis.inviteById || "",
      inviteByName: vis.inviteByName || vis.inviteBy || "RMBF Erode United",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingVisitor) return;
    if (!formData.visitorName.trim()) {
      alert("Please enter Visitor Name.");
      return;
    }
    if (!formData.category.trim()) {
      alert("Please enter Products / Services.");
      return;
    }
    if (!formData.phone.trim()) {
      alert("Please enter Phone Number.");
      return;
    }

    try {
      setSaving(true);
      const invMember = members.find((m) => (m.uid || m.id) === formData.inviteById);
      const payload = {
        ...formData,
        inviteByName: invMember ? (invMember.fullName || invMember.name) : formData.inviteByName,
      };

      await updateVisitor(editingVisitor.id, payload);
      setEditingVisitor(null);
      await loadVisitors();
    } catch (err) {
      console.error("Failed to save visitor:", err);
      alert("Failed to save visitor.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelVisitor = async () => {
    if (!editingVisitor) return;
    if (!window.confirm(`Are you sure you want to cancel visitor "${editingVisitor.visitorName || editingVisitor.name}"?`)) return;

    try {
      setSaving(true);
      await updateVisitor(editingVisitor.id, { status: "Cancelled" });
      setEditingVisitor(null);
      await loadVisitors();
    } catch (err) {
      console.error("Failed to cancel visitor:", err);
      alert("Failed to cancel visitor.");
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToMember = async (vis) => {
    if (!window.confirm(`Convert visitor "${vis.visitorName}" to a full member?`)) return;
    try {
      await convertVisitorToMember(vis);
      await loadVisitors();
      alert(`Visitor "${vis.visitorName}" successfully converted to member!`);
    } catch (err) {
      console.error("Failed to convert visitor to member:", err);
      alert("Failed to convert visitor to member.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visitor record?")) return;
    try {
      await deleteVisitor(id);
      await loadVisitors();
    } catch (err) {
      console.error("Failed to delete visitor:", err);
      alert("Failed to delete visitor.");
    }
  };

  const filteredVisitors = useMemo(() => {
    return visitors.filter((vis) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        (vis.visitorName || "").toLowerCase().includes(q) ||
        (vis.inviteByName || "").toLowerCase().includes(q) ||
        (vis.companyName || "").toLowerCase().includes(q) ||
        (vis.phone || "").includes(q);

      const matchesStatus =
        statusFilter === "All" || (vis.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [visitors, searchTerm, statusFilter]);

  const handleExport = () => {
    exportToExcel({
      filename: "visitors-list",
      sheetName: "Visitors",
      columns: EXPORT_COLUMNS,
      rows: filteredVisitors,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A] flex items-center gap-2.5">
            <UserPlus size={28} className="text-[#EA580C]" />
            Visitors Directory
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500">
            View guest visitors registered from member application
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-[#1E3A8A] px-4 py-2.5 text-xs font-semibold text-[#1E3A8A] hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search visitor by name, inviter, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2 text-xs font-medium text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-semibold text-gray-700">
          <Filter size={15} className="text-gray-500" />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer font-bold"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Joined">Joined</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[850px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-5 py-3.5">Visitor Name</th>
                <th className="px-5 py-3.5">Invite By</th>
                <th className="px-5 py-3.5">Company / Business</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Visit Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                    Loading visitors...
                  </td>
                </tr>
              ) : filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                    No visitor records found.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((vis) => (
                  <tr key={vis.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900">
                      <Link to={`/visitors/${vis.id}`} className="hover:text-[#EA580C] hover:underline">
                        {vis.visitorName || "Guest"}
                      </Link>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#1E3A8A]">
                      {vis.inviteByName || vis.inviteBy || "Member"}
                    </td>
                    <td className="px-5 py-4 text-gray-700">{vis.companyName || "—"}</td>
                    <td className="px-5 py-4 text-gray-600">{vis.phone || "—"}</td>
                    <td className="px-5 py-4 text-gray-600">{vis.visitDate || "Today"}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          vis.status === "Joined"
                            ? "bg-emerald-100 text-emerald-800"
                            : vis.status === "Cancelled"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        {vis.status || "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/visitors/${vis.id}`}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                          title="View Visitor Details"
                        >
                          <Eye size={16} />
                        </Link>
                        {vis.status !== "Joined" && (
                          <button
                            onClick={() => handleConvertToMember(vis)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Become Member"
                          >
                            <UserCheck size={14} />
                            Become Member
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(vis)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                          title="Edit Visitor"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit Visitor (Matching Reference Image 1) */}
      {editingVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-fade-in space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Edit Visitor</h3>
              <button
                onClick={() => setEditingVisitor(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* 2-Column Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    Visitor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.visitorName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, visitorName: e.target.value }))}
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
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
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
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 9842448424"
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                    placeholder="e.g. JKV Durga designer"
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Visit Date</label>
                  <input
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, visitDate: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-800 focus:border-[#0088CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">Source</label>
                  <input
                    type="text"
                    disabled
                    value={formData.source}
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 p-2.5 font-medium text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1.5">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
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
                {formData.inviteByName ? (
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-3">
                    <span className="font-semibold text-gray-800">{formData.inviteByName}</span>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, inviteById: "", inviteByName: "" }))}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors cursor-pointer"
                      title="Remove Inviter"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <select
                    value={formData.inviteById}
                    onChange={(e) => {
                      const m = members.find((mem) => (mem.uid || mem.id) === e.target.value);
                      setFormData((prev) => ({
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
                    onClick={() => setEditingVisitor(null)}
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
