import { useState } from "react";
import { Settings as SettingsIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { useMasters } from "../context/MastersContext";
import MeetingLimitsCard from "../components/settings/MeetingLimitsCard";
import TermCard from "../components/settings/TermCard";

function MasterList({ title, items, category, onAdd, onRemove }) {
  const [newValue, setNewValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newValue.trim() && !items.includes(newValue.trim())) {
      setIsSubmitting(true);
      try {
        await onAdd(category, newValue.trim());
        setNewValue("");
      } catch (err) {
        console.error("Failed to add master item:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs overflow-hidden flex flex-col h-full">
      <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-100">
        <h3 className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">{title}</h3>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Add ${title.toLowerCase()}`}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs font-medium text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newValue.trim() || isSubmitting}
            className="flex shrink-0 items-center justify-center rounded-xl bg-[#EA580C] px-3 py-1.5 text-white transition-colors hover:bg-[#c2410c] disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          </button>
        </form>

        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
          {items.length === 0 ? (
            <div className="text-xs text-gray-400 text-center py-4">No items found</div>
          ) : (
            items.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/40 px-3 py-2 text-xs font-semibold text-gray-800 group">
                <span>{item}</span>
                <button
                  onClick={() => onRemove(category, item)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { masters, addMasterItem, removeMasterItem } = useMasters();

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E3A8A] text-white shadow-xs">
          <SettingsIcon size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A]">Organization Settings</h1>
          <p className="text-sm font-medium text-gray-500">
            Manage term system, meeting limits, and master options
          </p>
        </div>
      </div>

      {/* Meeting Limits & Term Management Cards */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MeetingLimitsCard />
        <TermCard />
      </div>

      {/* Dropdown Master Settings */}
      <div>
        <h2 className="text-base font-bold text-[#1E3A8A] mb-3">Master Dropdown Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[350px]">
          <MasterList
            title="Positions"
            items={masters.positions}
            category="positions"
            onAdd={addMasterItem}
            onRemove={removeMasterItem}
          />
          <MasterList
            title="Directors"
            items={masters.directors}
            category="directors"
            onAdd={addMasterItem}
            onRemove={removeMasterItem}
          />
          <MasterList
            title="Coordinators"
            items={masters.coordinators}
            category="coordinators"
            onAdd={addMasterItem}
            onRemove={removeMasterItem}
          />
          <MasterList
            title="Power Team"
            items={masters.powerTeams}
            category="powerTeams"
            onAdd={addMasterItem}
            onRemove={removeMasterItem}
          />
        </div>
      </div>
    </div>
  );
}
