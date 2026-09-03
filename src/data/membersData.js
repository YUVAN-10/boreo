// Definitions and data structure for RMBF Erode United member application form.

export const sexOptions = ["Male", "Female", "Transgender"];
export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const firmTypeOptions = ["Proprietorship", "Partnership"];
export const professionOptions = ["Trader", "Manufacturer", "Service Provide", "Consultant"];
export const sourceOptions = [
  "Friends",
  "Radio Advt",
  "Newspaper Advt",
  "Social Media Promotions",
  "Others",
];
export const proxyOptions = ["Yes", "No"];
export const memberStatuses = ["Active", "Inactive"];

export const initialMembers = [];

export const emptyMember = {
  uid: "",
  // Photo & Date
  profileImage: null,
  applicationDate: "",

  // 1 to 21 Form Fields strictly matching the application form:
  fullName: "",             // 1. Applicant Name
  dateOfBirth: "",          // 2. Date of Birth
  age: "",                  // 2. Age
  sex: "",                  // 3. Sex (Male / Female / Transgender)
  bloodGroup: "",           // 4. Blood Group
  companyName: "",          // 5. Company Name
  firmType: "",             // 6. Firm Type (Proprietorship / Partnership)
  totalStaff: "",           // 7. Total No. of Staff Working in Office
  officeAddress: "",        // 8. Office Address
  gstNo: "",                // 9. GST No
  annualTurnover: "",       // 10. Annual Turnover
  phone: "",                // 11. Mobile No
  whatsappNo: "",           // 11. Whatsapp No
  officeNo: "",             // 12. Office Landline
  email: "",                // 13. Mail Id
  websiteUrl: "",           // 14. Website
  aadharNo: "",             // 15. Aadhar No
  panNo: "",                // 16. PAN No
  professionDetails: "",    // 17. Profession Details
  howDoYouKnow: "",         // 18. How do you know about BOREO ?
  howDoYouKnowOthers: "",   // 18. Others please Specify
  representingCategory: "", // 19. Your Representing Category in BOREO ?
  proxyAvailable: "",       // 20. Is Proxy Available, In-case of absence?
  topClients: Array(10).fill(""), // 21. Your Top 10 Most Valued Clients (I to X)

  // Admin Identification & Status
  ridNo: "",
  status: "Active",

  createdAt: "",
  updatedAt: "",
};
