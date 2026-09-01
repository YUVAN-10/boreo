import { useState, useEffect } from "react";
import { Building, Mail, Phone, MapPin, Upload, Save, CheckCircle2 } from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { uploadFile } from "../../services/storageService";

export default function GeneralSettingsCard() {
  const [generalData, setGeneralData] = useState({
    orgName: "RMBF Admin Panel",
    logoUrl: "",
    contactEmail: "admin@organization.org",
    phone: "9876543210",
    address: "Erode, Tamil Nadu, India",
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    async function loadGeneralSettings() {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGeneralData((prev) => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) {
        console.error("Error loading general settings:", err);
      }
    }
    loadGeneralSettings();
  }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const url = await uploadFile(file, `settings/logo_${Date.now()}`);
      setGeneralData((prev) => ({ ...prev, logoUrl: url }));
    } catch (err) {
      console.error("Failed to upload logo:", err);
      alert("Failed to upload logo image.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const docRef = doc(db, "settings", "general");
      await setDoc(docRef, {
        ...generalData,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save general settings:", err);
      alert("Failed to save general settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs animate-fade-in">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#EA580C]">
          <Building size={20} />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#1E3A8A]">General Settings</h2>
          <p className="text-xs text-gray-500">Manage organization info, logo, and contact details</p>
        </div>
      </div>

      {savedSuccess && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          General settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-bold text-[#1E3A8A] mb-1">Organization Name *</label>
            <input
              type="text"
              required
              value={generalData.orgName}
              onChange={(e) => setGeneralData((prev) => ({ ...prev, orgName: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 font-semibold text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E3A8A] mb-1">Contact Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={generalData.contactEmail}
                onChange={(e) => setGeneralData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3 py-2.5 font-semibold text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1E3A8A] mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={generalData.phone}
                onChange={(e) => setGeneralData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3 py-2.5 font-semibold text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1E3A8A] mb-1">Organization Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={generalData.address}
                onChange={(e) => setGeneralData((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3 py-2.5 font-semibold text-gray-800 focus:bg-white focus:border-[#EA580C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#1E3A8A] mb-1">Organization Logo</label>
          <div className="flex items-center gap-4">
            {generalData.logoUrl ? (
              <img
                src={generalData.logoUrl}
                alt="Logo"
                className="h-12 w-12 object-contain rounded-xl border border-gray-200 p-1"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400 font-bold">
                LOGO
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#1E3A8A] px-4 py-2 text-xs font-semibold text-[#1E3A8A] hover:bg-blue-50 transition-colors">
              <Upload size={15} />
              {uploadingLogo ? "Uploading..." : "Upload Logo"}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#EA580C] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#c2410c] disabled:opacity-50 transition-all"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save General Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
