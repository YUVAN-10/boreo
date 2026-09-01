import { NavLink, useNavigate } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import { navItems } from "./navItems";
import { useAuth } from "../../context/AuthContext";

function SidebarContent({ onNavigate }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#1E3A8A] text-white">
      {/* Logo Header */}
      <div className="flex flex-col items-center justify-center px-4 py-4 border-b border-blue-800/60 bg-[#172e6e]">
        <div className="rounded-xl bg-white p-2 shadow-sm w-full flex items-center justify-center">
          <img
            src="/boreo-logo.jpg"
            alt="BOREO Logo"
            className="h-12 w-auto max-w-full object-contain"
          />
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1.5">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200",
                isActive
                  ? "bg-[#EA580C] text-white shadow-md font-bold translate-x-1"
                  : "text-blue-100 hover:bg-blue-800/70 hover:text-white",
              ].join(" ")
            }
          >
            <Icon size={18} strokeWidth={2} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-blue-800/60 px-4 py-4 space-y-2.5 bg-[#172e6e]">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <p className="text-[10px] text-blue-300 px-1 text-center font-medium">
          &copy; {new Date().getFullYear()} BOREO Admin Panel
        </p>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-blue-900 lg:bg-[#1E3A8A]">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <div
        className={[
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          onClick={onClose}
        />
        <div
          className={[
            "absolute inset-y-0 left-0 w-72 max-w-[85%] bg-[#1E3A8A] shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-blue-800 z-10"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
          <SidebarContent onNavigate={onClose} />
        </div>
      </div>
    </>
  );
}
