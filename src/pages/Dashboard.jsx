import { useState, useEffect, useMemo } from "react";
import {
  Users,
  CalendarDays,
  Handshake,
  UserPlus,
  Share2,
  Image as ImageIcon,
} from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import { useMembers } from "../context/MembersContext";
import { useMeetings } from "../context/MeetingsContext";
import { useEvents } from "../context/EventsContext";
import { getVisitors } from "../services/visitorService";
import { getOneToOnes } from "../services/oneToOneService";
import { getReferrals } from "../services/referralService";

export default function Dashboard() {
  const { members } = useMembers();
  const { meetings } = useMeetings();
  const { events } = useEvents();

  const [termFilter, setTermFilter] = useState("all");
  const [visitors, setVisitors] = useState([]);
  const [oneToOnes, setOneToOnes] = useState([]);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [visList, otoList, refList] = await Promise.all([
          getVisitors().catch(() => []),
          getOneToOnes().catch(() => []),
          getReferrals().catch(() => []),
        ]);
        setVisitors(visList);
        setOneToOnes(otoList);
        setReferrals(refList);
      } catch (err) {
        console.error("Error loading dashboard extra data:", err);
      }
    }
    loadData();
  }, []);

  const filteredMeetings = useMemo(() => {
    if (termFilter === "all") return meetings;
    return meetings.filter((m) => m.termId === termFilter || m.term === termFilter);
  }, [meetings, termFilter]);

  const filteredEvents = useMemo(() => {
    if (termFilter === "all") return events;
    return events.filter((e) => e.termId === termFilter || e.term === termFilter);
  }, [events, termFilter]);

  const filteredOneToOnes = useMemo(() => {
    if (termFilter === "all") return oneToOnes;
    return oneToOnes.filter((o) => o.termId === termFilter || o.term === termFilter);
  }, [oneToOnes, termFilter]);

  const filteredVisitors = useMemo(() => {
    if (termFilter === "all") return visitors;
    return visitors.filter((v) => v.termId === termFilter || v.term === termFilter);
  }, [visitors, termFilter]);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Dashboard Top Header */}
      <DashboardHeader termFilter={termFilter} setTermFilter={setTermFilter} />

      {/* Statistics Cards (6 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={Users}
          label="Total Members"
          value={members.length}
          subtext="Active Directory"
          iconBgClass="bg-blue-100 text-[#1E3A8A]"
          delay={0}
        />
        <StatCard
          icon={CalendarDays}
          label="Total Meetings"
          value={filteredMeetings.length}
          subtext="Scheduled / Held"
          iconBgClass="bg-orange-100 text-[#EA580C]"
          delay={50}
        />
        <StatCard
          icon={Handshake}
          label="Total One to One"
          value={filteredOneToOnes.length}
          subtext="Conducted Meetings"
          iconBgClass="bg-indigo-100 text-indigo-800"
          delay={100}
        />
        <StatCard
          icon={UserPlus}
          label="Total Visitors"
          value={filteredVisitors.length}
          subtext="Guest Entries"
          iconBgClass="bg-emerald-100 text-emerald-700"
          delay={150}
        />
        <StatCard
          icon={Share2}
          label="Total Referrals"
          value={referrals.length}
          subtext="Business Passed"
          iconBgClass="bg-purple-100 text-purple-700"
          delay={200}
        />
        <StatCard
          icon={ImageIcon}
          label="Total Events"
          value={filteredEvents.length}
          subtext="News & Functions"
          iconBgClass="bg-amber-100 text-amber-700"
          delay={250}
        />
      </div>
    </div>
  );
}
