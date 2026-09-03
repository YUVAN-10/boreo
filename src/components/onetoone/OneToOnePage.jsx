import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Handshake,
  Search,
  Filter,
  FileSpreadsheet,
  Trash2,
  Eye,
  Building
} from "lucide-react";
import { getOneToOnes, deleteOneToOne } from "../../services/oneToOneService";
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
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
                    <td className="px-5 py-4 font-bold text-gray-900">
                      <Link to={`/one-to-one/${rec.id}`} className="hover:text-[#EA580C] hover:underline">
                        {rec.fromMemberName || "Member"}
                      </Link>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">
                      <Link to={`/one-to-one/${rec.id}`} className="hover:text-[#EA580C] hover:underline">
                        {rec.toMemberName || "Member"}
                      </Link>
                    </td>
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
                        <Link
                          to={`/one-to-one/${rec.id}`}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
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
    </div>
  );
}
