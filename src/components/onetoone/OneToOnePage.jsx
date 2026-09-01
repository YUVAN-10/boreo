import { useState, useEffect, useMemo } from "react";
import {
  Handshake,
  Search,
  Filter,
  FileSpreadsheet,
  Trash2,
  Edit,
  Eye,
  Building,
  X
} from "lucide-react";
import { getOneToOnes, updateOneToOne, deleteOneToOne } from "../../services/oneToOneService";
import { useMembers } from "../../context/MembersContext";
import { exportToExcel } from "../../utils/exportExcel";

const EXPORT_COLUMNS = [
  { key: "fromMemberName", header: "From Member" },
  { key: "toMemberName", header: "To Member" },
  { key: "meetingLocation", header: "Office Location" },
  { key: "date", header: "Date" },
  { key: "time", header: "Time" },
  { key: "status", header: "Status" },
];

export default function OneToOnePage() {
  const { members } = useMembers();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State for Editing
  const [formData, setFormData] = useState({
    fromMemberId: "",
    fromMemberName: "",
    toMemberId: "",
    toMemberName: "",
    meetingLocation: "From Member Office",
    meetingOfficeName: "From Member Office",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    status: "Completed",
    termId: "Term 13",
  });

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await getOneToOnes();
      setRecords(data);
    } catch (err) {
      console.error("Error loading One to One records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const getOfficeLabel = (rec) => {
    if (!rec) return "From Member Office";
    if (rec.meetingLocation === "From Member Office") {
      return rec.fromMemberName ? `From Member Office (${rec.fromMemberName})` : "From Member Office";
    }
    if (rec.meetingLocation === "To Member Office") {
      return rec.toMemberName ? `To Member Office (${rec.toMemberName})` : "To Member Office";
    }
    return rec.meetingLocation || rec.meetingOfficeName || "From Member Office";
  };

  const handleOpenEditModal = (rec) => {
    setEditingRecord(rec);
    setFormData({
      fromMemberId: rec.fromMemberId || "",
      fromMemberName: rec.fromMemberName || "",
      toMemberId: rec.toMemberId || "",
      toMemberName: rec.toMemberName || "",
      meetingLocation: rec.meetingLocation || "From Member Office",
      meetingOfficeName: rec.meetingOfficeName || rec.meetingLocation || "From Member Office",
      date: rec.date || new Date().toISOString().split("T")[0],
      time: rec.time || "10:00 AM",
      status: rec.status || "Completed",
      termId: rec.termId || "Term 13",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;

    try {
      setSaving(true);
      const fromMem = members.find((m) => (m.uid || m.id) === formData.fromMemberId);
      const toMem = members.find((m) => (m.uid || m.id) === formData.toMemberId);

      const payload = {
        ...formData,
        fromMemberName: fromMem ? (fromMem.fullName || fromMem.name) : formData.fromMemberName,
        toMemberName: toMem ? (toMem.fullName || toMem.name) : formData.toMemberName,
      };

      await updateOneToOne(editingRecord.id, payload);
      setEditingRecord(null);
      await loadRecords();
    } catch (err) {
      console.error("Failed to update One to One record:", err);
      alert("Failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this One to One record?")) return;
    try {
      await deleteOneToOne(id);
      await loadRecords();
    } catch (err) {
      console.error("Failed to delete One to One record:", err);
      alert("Failed to delete record.");
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        (rec.fromMemberName || "").toLowerCase().includes(q) ||
        (rec.toMemberName || "").toLowerCase().includes(q) ||
        (rec.meetingLocation || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" || (rec.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const handleExport = () => {
    const exportRows = filteredRecords.map((r) => ({
      ...r,
      meetingLocation: getOfficeLabel(r),
    }));
    exportToExcel({
      filename: "one-to-one-meetings",
      sheetName: "One to One",
      columns: EXPORT_COLUMNS,
      rows: exportRows,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A] flex items-center gap-2.5">
            <Handshake size={28} className="text-[#EA580C]" />
            One to One Meetings
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500">
            View member one-to-one interaction meetings submitted from client application
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
            placeholder="Search by member or office location..."
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
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* One to One Table */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[800px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-5 py-3.5">From Member</th>
                <th className="px-5 py-3.5">To Member</th>
                <th className="px-5 py-3.5">Office</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                    Loading One to One records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                    No One to One records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900">{rec.fromMemberName || "Member"}</td>
                    <td className="px-5 py-4 font-bold text-gray-900">{rec.toMemberName || "Member"}</td>
                    <td className="px-5 py-4 text-gray-700 font-medium">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1E3A8A]">
                        <Building size={14} />
                        {getOfficeLabel(rec)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{rec.date || "Today"}</td>
                    <td className="px-5 py-4 text-gray-600">{rec.time || "10:00 AM"}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          rec.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : rec.status === "Cancelled"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {rec.status || "Completed"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingRecord(rec)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(rec)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
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

      {/* Modal: Edit One to One */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1E3A8A]">Edit One to One Meeting</h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1E3A8A] mb-1">From Member</label>
                <select
                  value={formData.fromMemberId}
                  onChange={(e) => {
                    const m = members.find((mem) => (mem.uid || mem.id) === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      fromMemberId: e.target.value,
                      fromMemberName: m ? (m.fullName || m.name) : "",
                    }));
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-semibold text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.uid || m.id} value={m.uid || m.id}>
                      {m.fullName || m.name} ({m.businessName || m.companyName || "Member"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1E3A8A] mb-1">To Member</label>
                <select
                  value={formData.toMemberId}
                  onChange={(e) => {
                    const m = members.find((mem) => (mem.uid || mem.id) === e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      toMemberId: e.target.value,
                      toMemberName: m ? (m.fullName || m.name) : "",
                    }));
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-semibold text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.uid || m.id} value={m.uid || m.id}>
                      {m.fullName || m.name} ({m.businessName || m.companyName || "Member"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1E3A8A] mb-1">Meeting Conducted At (Office)</label>
                <select
                  value={formData.meetingLocation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meetingLocation: e.target.value,
                      meetingOfficeName: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-semibold text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none"
                >
                  <option value="From Member Office">From Member Office</option>
                  <option value="To Member Office">To Member Office</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E3A8A] mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-semibold text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1E3A8A] mb-1">Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    placeholder="e.g. 10:30 AM"
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-semibold text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1E3A8A] mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-semibold text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none"
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="rounded-xl border border-[#1E3A8A] px-4 py-2 font-semibold text-[#1E3A8A] hover:bg-blue-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#EA580C] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#c2410c] disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View One to One Record */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#1E3A8A]">One to One Details</h3>
              <button
                onClick={() => setViewingRecord(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-gray-500 font-medium">From Member:</p>
                <p className="text-sm font-bold text-gray-900">{viewingRecord.fromMemberName}</p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-gray-500 font-medium">To Member:</p>
                <p className="text-sm font-bold text-gray-900">{viewingRecord.toMemberName}</p>
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-gray-500 font-medium">Conducted At:</p>
                <p className="text-xs font-semibold text-[#1E3A8A] flex items-center gap-1.5 mt-1">
                  <Building size={15} className="text-[#EA580C]" />
                  {getOfficeLabel(viewingRecord)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-gray-500 font-medium">Date:</p>
                  <p className="font-semibold text-gray-800">{viewingRecord.date}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-gray-500 font-medium">Time:</p>
                  <p className="font-semibold text-gray-800">{viewingRecord.time}</p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-gray-500 font-medium">Status:</p>
                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                    viewingRecord.status === "Completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : viewingRecord.status === "Cancelled"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {viewingRecord.status || "Completed"}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
              <button
                onClick={() => setViewingRecord(null)}
                className="rounded-xl bg-[#1E3A8A] px-5 py-2 font-bold text-white hover:bg-blue-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
