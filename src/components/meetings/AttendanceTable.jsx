import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Save, FileSpreadsheet, CheckCircle2, XCircle, Clock, Users } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";
import { saveMeetingAttendance, getMeetingAttendance } from "../../services/meetingService";
import { useAuth } from "../../context/AuthContext";

const EXPORT_COLUMNS = [
  { key: "sNo", header: "S.No" },
  { key: "memberName", header: "Member Name" },
  { key: "businessName", header: "Business Name" },
  { key: "phone", header: "Phone Number" },
  { key: "status", header: "Attendance Status" },
];

export default function AttendanceTable({ meetingId, activeMembers = [], termId = "Term 13" }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [attendanceData, setAttendanceData] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load existing attendance from Firestore for this meeting
  useEffect(() => {
    async function loadAttendance() {
      if (!meetingId) return;
      try {
        setLoading(true);
        const existing = await getMeetingAttendance(meetingId);
        
        // Initialize attendance map for all active members
        const initialMap = {};
        activeMembers.forEach((member) => {
          const uid = member.uid || member.id;
          const rec = existing[uid];
          initialMap[uid] = {
            memberUid: uid,
            memberName: member.fullName || member.name || "",
            businessName: member.businessName || member.companyName || "",
            phone: member.phone || member.mobileNumber || "",
            status: rec ? rec.status.toLowerCase() : "present", // Default to present
          };
        });
        setAttendanceData(initialMap);
      } catch (err) {
        console.error("Error loading attendance:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, [meetingId, activeMembers]);

  // Status toggle handler
  const handleStatusChange = (memberUid, newStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [memberUid]: {
        ...prev[memberUid],
        status: newStatus.toLowerCase(),
      },
    }));
  };

  // Save / Update Attendance
  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      setSavedSuccess(false);
      const attendanceList = Object.values(attendanceData);
      await saveMeetingAttendance(meetingId, attendanceList, user?.uid || "admin", termId);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save attendance:", err);
      alert("Failed to save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Filtered rows for table view
  const rows = useMemo(() => {
    return activeMembers.map((member, index) => {
      const uid = member.uid || member.id;
      const att = attendanceData[uid] || {
        memberUid: uid,
        memberName: member.fullName || "",
        businessName: member.businessName || "",
        phone: member.phone || "",
        status: "present",
      };
      return {
        sNo: index + 1,
        uid,
        memberName: member.fullName || member.name || "Member",
        businessName: member.businessName || "—",
        phone: member.phone || "—",
        status: att.status,
      };
    });
  }, [activeMembers, attendanceData]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        row.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || row.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [rows, searchTerm, statusFilter]);

  // Counts for Summary Cards
  const totalCount = rows.length;
  const presentCount = rows.filter((r) => r.status === "present").length;
  const absentCount = rows.filter((r) => r.status === "absent").length;
  const leaveCount = rows.filter((r) => r.status === "leave").length;

  const handleExport = () => {
    const formattedRows = filteredRows.map((r) => ({
      ...r,
      status: r.status.toUpperCase(),
    }));
    exportToExcel({
      filename: `meeting-attendance-${meetingId}`,
      sheetName: "Attendance",
      columns: EXPORT_COLUMNS,
      rows: formattedRows,
    });
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-sm font-medium text-gray-500">
        Loading attendance records...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#1E3A8A]">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">Total Members</p>
            <p className="text-xl font-bold text-gray-900">{totalCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-800">Present Count</p>
            <p className="text-xl font-bold text-emerald-900">{presentCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-700">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-red-800">Absent Count</p>
            <p className="text-xl font-bold text-red-900">{absentCount}</p>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-800">Leave Count</p>
            <p className="text-xl font-bold text-blue-900">{leaveCount}</p>
          </div>
        </div>
      </div>

      {/* Main Attendance Table Container */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs animate-fade-in">
        {/* Table Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5">
          <div>
            <h2 className="text-base font-bold text-[#1E3A8A]">Manual Attendance Management</h2>
            <p className="text-xs text-gray-500">Mark member attendance for this meeting</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 sm:w-64 rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3 py-2 text-xs font-medium text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-medium">
              <Filter size={15} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-gray-800 focus:outline-none cursor-pointer font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="leave">Leave</option>
              </select>
            </div>

            {/* Export Excel Button */}
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl border border-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-[#1E3A8A] hover:bg-blue-50 transition-colors"
            >
              <FileSpreadsheet size={15} />
              Export
            </button>

            {/* Save / Update Attendance Button */}
            <button
              type="button"
              onClick={handleSaveAttendance}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#EA580C] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#c2410c] disabled:opacity-50 transition-all"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-100 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Attendance updated and saved successfully!
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-5 py-3.5">S.No</th>
                <th className="px-5 py-3.5">Member Name</th>
                <th className="px-5 py-3.5">Business Name</th>
                <th className="px-5 py-3.5">Phone Number</th>
                <th className="px-5 py-3.5 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No member records found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.uid} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4 text-gray-500 font-semibold">{row.sNo}</td>
                    <td className="px-5 py-4 font-bold text-gray-900">{row.memberName}</td>
                    <td className="px-5 py-4 text-gray-600">{row.businessName}</td>
                    <td className="px-5 py-4 text-gray-600">{row.phone}</td>
                    <td className="px-5 py-4 text-center">
                      <select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.uid, e.target.value)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold border focus:outline-none cursor-pointer transition-all ${
                          row.status === "present"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : row.status === "absent"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-blue-100 text-blue-800 border-blue-300"
                        }`}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="leave">Leave</option>
                      </select>
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
