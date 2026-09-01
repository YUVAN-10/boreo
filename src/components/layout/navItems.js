import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UsersRound,
  Handshake,
  UserPlus,
  Share2,
  Newspaper,
  HeartHandshake,
  Settings,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Members", to: "/members", icon: Users },
  { label: "Meetings", to: "/meetings", icon: CalendarDays },
  { label: "Power Team Meetings", to: "/power-team-meetings", icon: UsersRound },
  { label: "One to One", to: "/one-to-one", icon: Handshake },
  { label: "Visitors", to: "/visitors", icon: UserPlus },
  { label: "Referrals", to: "/referrals", icon: Share2 },
  { label: "News & Events", to: "/news-events", icon: Newspaper },
  { label: "Thank Notes", to: "/thank-notes", icon: HeartHandshake },
  { label: "Settings", to: "/settings", icon: Settings },
];
