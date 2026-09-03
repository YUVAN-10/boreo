import { useState } from "react";
import {
  User,
  Briefcase,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
} from "lucide-react";
import ProfileImageUpload from "./ProfileImageUpload";
import MemberFormStepper from "./MemberFormStepper";
import {
  bloodGroups,
  sexOptions,
  firmTypeOptions,
  professionOptions,
  sourceOptions,
  proxyOptions,
  memberStatuses,
} from "../../data/membersData";
import { validateFields, STEP_FIELDS } from "../../utils/memberValidation";

const STEPS = [
  { key: "personal", label: "Personal Information", icon: User },
  { key: "business", label: "Business Information", icon: Briefcase },
  { key: "boreo", label: "BOREO Details & Clients", icon: FileCheck },
];

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

function FormSection({ title, icon: Icon, children, description }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs animate-fade-in space-y-4">
      <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Icon size={16} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-secondary">{title}</h2>
          {description && <p className="text-xs text-text-secondary">{description}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function fieldClasses(hasError) {
  return [
    "w-full rounded-xl border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-text-secondary transition-all focus:outline-none focus:ring-2",
    hasError
      ? "border-danger focus:border-danger focus:ring-danger/20"
      : "border-border focus:border-primary focus:ring-primary/20",
  ].join(" ");
}

function Field({ label, error, full, required, children, helpText }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-bold text-text uppercase tracking-wider">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {helpText && <p className="mt-1 text-[11px] text-text-secondary">{helpText}</p>}
      {error && <p className="mt-1 text-xs font-semibold text-danger">{error}</p>}
    </div>
  );
}

function RadioPillGroup({ options, value, onChange, name }) {
  return (
    <div className="flex flex-wrap gap-2.5 mt-1">
      {options.map((opt) => {
        const isSelected = value === opt;
        return (
          <label
            key={opt}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
              isSelected
                ? "border-primary bg-primary-light text-primary shadow-xs"
                : "border-border bg-card text-text-secondary hover:border-primary/50 hover:bg-bg"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={isSelected}
              onChange={onChange}
              className="h-3.5 w-3.5 text-primary accent-primary"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
}

export default function MemberForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() => {
    const clients = Array.isArray(initialData?.topClients)
      ? [...initialData.topClients]
      : Array(10).fill("");
    while (clients.length < 10) clients.push("");
    return {
      ...initialData,
      topClients: clients,
    };
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const stepKey = STEPS[currentStep].key;
  const isLastStep = currentStep === STEPS.length - 1;

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDobChange = (e) => {
    const dob = e.target.value;
    let computedAge = formData.age;
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (!isNaN(age) && age >= 0) {
        computedAge = String(age);
      }
    }
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: dob,
      age: computedAge,
    }));
  };

  const handleTopClientChange = (index, value) => {
    setFormData((prev) => {
      const clients = [...(prev.topClients || Array(10).fill(""))];
      clients[index] = value;
      return { ...prev, topClients: clients };
    });
  };

  const handleImageChange = (dataUrl) => {
    setFormData((prev) => ({ ...prev, profileImage: dataUrl }));
  };

  const goToStep = (index) => {
    if (index < 0 || index >= STEPS.length) return;
    setErrors({});
    setCurrentStep(index);
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    const stepErrors = validateFields(formData, STEP_FIELDS[stepKey]);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    goToStep(Math.max(0, currentStep - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLastStep) {
      handleNext(e);
      return;
    }

    const stepErrors = validateFields(formData, STEP_FIELDS[stepKey]);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
      <MemberFormStepper steps={STEPS} currentStep={currentStep} onStepClick={goToStep} />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* STEP 1: PERSONAL INFORMATION */}
        {stepKey === "personal" && (
          <>
            <div className="rounded-2xl border border-border bg-bg p-5 flex flex-col sm:flex-row items-center gap-6">
              <ProfileImageUpload
                image={formData.profileImage}
                onChange={handleImageChange}
                name={formData.fullName}
              />
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-secondary">Passport Size Photo</h3>
                <p className="text-xs text-text-secondary">
                  Upload applicant passport size photo
                </p>
              </div>
            </div>

            <FormSection title="Personal Information" icon={User}>
              <Field label="Date of Joining" error={errors.joiningDate || errors.applicationDate}>
                <input
                  type="date"
                  value={formData.joiningDate || formData.applicationDate || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      joiningDate: val,
                      applicationDate: val,
                    }));
                  }}
                  className={fieldClasses(errors.joiningDate || errors.applicationDate)}
                />
              </Field>

              <Field label="Applicant Name" error={errors.fullName} required>
                <input
                  type="text"
                  value={formData.fullName || ""}
                  onChange={handleChange("fullName")}
                  placeholder="Enter full applicant name"
                  className={fieldClasses(errors.fullName)}
                />
              </Field>

              <Field label="Date of Birth" error={errors.dateOfBirth}>
                <input
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={handleDobChange}
                  className={fieldClasses(errors.dateOfBirth)}
                />
              </Field>

              <Field label="Age" error={errors.age}>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age || ""}
                  onChange={handleChange("age")}
                  placeholder="Age"
                  className={fieldClasses(errors.age)}
                />
              </Field>

              <Field label="Sex" error={errors.sex} full>
                <RadioPillGroup
                  options={sexOptions}
                  value={formData.sex || ""}
                  onChange={handleChange("sex")}
                  name="sex"
                />
              </Field>

              <Field label="Blood Group" error={errors.bloodGroup}>
                <select
                  value={formData.bloodGroup || ""}
                  onChange={handleChange("bloodGroup")}
                  className={fieldClasses(errors.bloodGroup)}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Mobile No" error={errors.phone} required>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phone || ""}
                  onChange={handleChange("phone")}
                  placeholder="10-digit Mobile No"
                  className={fieldClasses(errors.phone)}
                />
              </Field>

              <Field label="Whatsapp No" error={errors.whatsappNo}>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.whatsappNo || ""}
                  onChange={handleChange("whatsappNo")}
                  placeholder="Whatsapp No"
                  className={fieldClasses(errors.whatsappNo)}
                />
              </Field>

              <Field label="Office Landline" error={errors.officeNo}>
                <input
                  type="tel"
                  value={formData.officeNo || ""}
                  onChange={handleChange("officeNo")}
                  placeholder="Office Landline"
                  className={fieldClasses(errors.officeNo)}
                />
              </Field>

              <Field label="Mail Id" error={errors.email}>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange("email")}
                  placeholder="Mail Id"
                  className={fieldClasses(errors.email)}
                />
              </Field>

              <Field label="Website" error={errors.websiteUrl}>
                <input
                  type="url"
                  value={formData.websiteUrl || ""}
                  onChange={handleChange("websiteUrl")}
                  placeholder="Website"
                  className={fieldClasses(errors.websiteUrl)}
                />
              </Field>

              <Field label="Aadhar No" error={errors.aadharNo}>
                <input
                  type="text"
                  maxLength={14}
                  value={formData.aadharNo || ""}
                  onChange={handleChange("aadharNo")}
                  placeholder="Aadhar No"
                  className={fieldClasses(errors.aadharNo)}
                />
              </Field>

              <Field label="PAN No" error={errors.panNo}>
                <input
                  type="text"
                  maxLength={10}
                  value={formData.panNo || ""}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setFormData((prev) => ({ ...prev, panNo: val }));
                  }}
                  placeholder="PAN No (e.g. ABCDE1234F)"
                  className={fieldClasses(errors.panNo)}
                />
              </Field>
            </FormSection>
          </>
        )}

        {/* STEP 2: BUSINESS & FIRM DETAILS */}
        {stepKey === "business" && (
          <>
            <FormSection title="Business Information" icon={Briefcase}>
              <Field label="Company Name" error={errors.companyName} full>
                <input
                  type="text"
                  value={formData.companyName || ""}
                  onChange={handleChange("companyName")}
                  placeholder="Company Name"
                  className={fieldClasses(errors.companyName)}
                />
              </Field>

              <Field label="Firm Type" error={errors.firmType} full>
                <RadioPillGroup
                  options={firmTypeOptions}
                  value={formData.firmType || ""}
                  onChange={handleChange("firmType")}
                  name="firmType"
                />
              </Field>

              <Field label="Profession Details?" error={errors.professionDetails} full>
                <RadioPillGroup
                  options={professionOptions}
                  value={formData.professionDetails || ""}
                  onChange={handleChange("professionDetails")}
                  name="professionDetails"
                />
              </Field>

              <Field label="Total No. of Staff Working in Office" error={errors.totalStaff}>
                <input
                  type="number"
                  min="0"
                  value={formData.totalStaff || ""}
                  onChange={handleChange("totalStaff")}
                  placeholder="Total staff count"
                  className={fieldClasses(errors.totalStaff)}
                />
              </Field>

              <Field label="GST No" error={errors.gstNo}>
                <input
                  type="text"
                  value={formData.gstNo || ""}
                  onChange={handleChange("gstNo")}
                  placeholder="GST No"
                  className={fieldClasses(errors.gstNo)}
                />
              </Field>

              <Field label="Annual Turnover" error={errors.annualTurnover} full>
                <input
                  type="text"
                  value={formData.annualTurnover || ""}
                  onChange={handleChange("annualTurnover")}
                  placeholder="Annual Turnover"
                  className={fieldClasses(errors.annualTurnover)}
                />
              </Field>

              <Field label="Office Address" error={errors.officeAddress} full>
                <textarea
                  rows={3}
                  value={formData.officeAddress || ""}
                  onChange={handleChange("officeAddress")}
                  placeholder="Office Address"
                  className={fieldClasses(errors.officeAddress)}
                />
              </Field>
            </FormSection>
          </>
        )}

        {/* STEP 3: BOREO DETAILS & TOP CLIENTS */}
        {stepKey === "boreo" && (
          <>
            <FormSection title="BOREO Application Details" icon={FileCheck}>
              <Field label="How do you know about BOREO ?" error={errors.howDoYouKnow} full>
                <RadioPillGroup
                  options={sourceOptions}
                  value={formData.howDoYouKnow || ""}
                  onChange={handleChange("howDoYouKnow")}
                  name="howDoYouKnow"
                />
              </Field>

              {formData.howDoYouKnow === "Others" && (
                <Field label="Others please Specify" error={errors.howDoYouKnowOthers} full>
                  <input
                    type="text"
                    value={formData.howDoYouKnowOthers || ""}
                    onChange={handleChange("howDoYouKnowOthers")}
                    placeholder="Specify how you heard about BOREO"
                    className={fieldClasses(errors.howDoYouKnowOthers)}
                  />
                </Field>
              )}

              <Field label="Your Representing Category in BOREO ?" error={errors.representingCategory} full>
                <input
                  type="text"
                  value={formData.representingCategory || ""}
                  onChange={handleChange("representingCategory")}
                  placeholder="Representing Category"
                  className={fieldClasses(errors.representingCategory)}
                />
              </Field>

              <Field label="Is Proxy Available, In-case of absence?" error={errors.proxyAvailable} full>
                <RadioPillGroup
                  options={proxyOptions}
                  value={formData.proxyAvailable || ""}
                  onChange={handleChange("proxyAvailable")}
                  name="proxyAvailable"
                />
              </Field>
            </FormSection>

            <FormSection
              title="Your Top 10 Most Valued Clients"
              icon={FileText}
              description="List your top 10 most valued clients"
            >
              <div className="sm:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ROMAN_NUMERALS.map((roman, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-8 text-right font-bold text-xs text-primary">{roman})</span>
                    <input
                      type="text"
                      value={(formData.topClients && formData.topClients[idx]) || ""}
                      onChange={(e) => handleTopClientChange(idx, e.target.value)}
                      placeholder={`Client ${idx + 1}`}
                      className={fieldClasses()}
                    />
                  </div>
                ))}
              </div>
            </FormSection>

            <FormSection title="Admin Identification & Status" icon={User}>
              <Field label="RID Number" error={errors.ridNo} required>
                <input
                  type="text"
                  value={formData.ridNo || ""}
                  onChange={handleChange("ridNo")}
                  placeholder="e.g. BOREO13001"
                  className={fieldClasses(errors.ridNo)}
                />
              </Field>

              <Field label="Status" error={errors.status}>
                <select
                  value={formData.status || "Active"}
                  onChange={handleChange("status")}
                  className={fieldClasses(errors.status)}
                >
                  {memberStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </FormSection>
          </>
        )}

        {/* BOTTOM NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between border-t border-border pt-5">
          <div>
            {currentStep > 0 && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePrevious}
                className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-[#64748B] transition-all hover:bg-bg disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onCancel}
              className="rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-[#64748B] transition-all hover:bg-bg disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            {isLastStep ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-[#EA580C] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#c2410c] disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  submitLabel
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl bg-[#EA580C] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#c2410c] cursor-pointer shadow-xs"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
