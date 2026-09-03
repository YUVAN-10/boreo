const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const PAN_REGEX = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
const URL_REGEX = /^https?:\/\/[^\s]+\.[^\s]+$/;

const FIELD_RULES = {
  // Personal & Contact Details
  fullName: { required: "Applicant Name is required" },
  applicationDate: {},
  dateOfBirth: {},
  age: {},
  sex: {},
  bloodGroup: {},
  phone: {
    required: "Mobile No is required",
    format: (v) =>
      PHONE_REGEX.test(v)
        ? null
        : "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9",
  },
  whatsappNo: {
    format: (v) =>
      !v || PHONE_REGEX.test(v)
        ? null
        : "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9",
  },
  officeNo: {},
  email: {
    format: (v) => (!v || EMAIL_REGEX.test(v) ? null : "Please enter a valid email address"),
  },
  websiteUrl: {
    format: (v) => (!v || URL_REGEX.test(v) ? null : "Please enter a valid website URL (https://...)"),
  },
  aadharNo: {
    format: (v) =>
      !v || /^\d{12}$/.test(v.replace(/\s/g, ""))
        ? null
        : "Please enter a valid 12-digit Aadhar number",
  },
  panNo: {
    format: (v) =>
      !v || PAN_REGEX.test(v)
        ? null
        : "Please enter a valid 10-character PAN (e.g. ABCDE1234F)",
  },

  // Business & Firm Details
  companyName: {},
  firmType: {},
  professionDetails: {},
  totalStaff: {},
  officeAddress: {},
  gstNo: {},
  annualTurnover: {},

  // BOREO Details & Admin
  representingCategory: {},
  howDoYouKnow: {},
  howDoYouKnowOthers: {},
  proxyAvailable: {},
  ridNo: { required: "RID No is required" },
  status: {},
};

export const STEP_FIELDS = {
  personal: [
    "fullName",
    "applicationDate",
    "dateOfBirth",
    "age",
    "sex",
    "bloodGroup",
    "phone",
    "whatsappNo",
    "officeNo",
    "email",
    "websiteUrl",
    "aadharNo",
    "panNo",
  ],
  business: [
    "companyName",
    "firmType",
    "professionDetails",
    "totalStaff",
    "officeAddress",
    "gstNo",
    "annualTurnover",
  ],
  boreo: [
    "representingCategory",
    "howDoYouKnow",
    "howDoYouKnowOthers",
    "proxyAvailable",
    "ridNo",
    "status",
  ],
};

export function validateFields(data, fieldNames) {
  const errors = {};
  if (!fieldNames) return errors;

  for (const field of fieldNames) {
    const rule = FIELD_RULES[field];
    if (!rule) continue;
    const value = data[field];
    const isEmpty = value === undefined || value === null || !String(value).trim();

    if (isEmpty) {
      if (rule.required) errors[field] = rule.required;
    } else if (rule.format) {
      const formatError = rule.format(String(value).trim());
      if (formatError) errors[field] = formatError;
    }
  }
  return errors;
}
