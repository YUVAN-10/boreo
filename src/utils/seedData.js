import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export async function seedSampleData() {
  try {
    console.log("Seeding BOREO dummy data into Cloud Firestore...");

    // 1. Members (2 Dummy Records)
    await setDoc(doc(db, "members", "boreo-mem-1"), {
      uid: "boreo-mem-1",
      fullName: "Rajesh Sharma",
      companyName: "Supreme Traders",
      businessName: "Supreme Traders",
      phone: "9876543210",
      ridNo: "BOREO13001",
      email: "rajesh@supremetraders.com",
      status: "Active",
      powerTeam: "IT & Digital",
      position: "President",
      termId: "Term 13",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, "members", "boreo-mem-2"), {
      uid: "boreo-mem-2",
      fullName: "Anitha V",
      companyName: "VeeVin Tech Solutions",
      businessName: "VeeVin Tech Solutions",
      phone: "9123456789",
      ridNo: "BOREO13002",
      email: "anitha@veevin.com",
      status: "Active",
      powerTeam: "IT & Digital",
      position: "Vice President",
      termId: "Term 13",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 2. Meetings & Attendance (2 Dummy Records)
    const today = new Date().toISOString().split("T")[0];
    
    await setDoc(doc(db, "meetings", "boreo-mtg-1"), {
      id: "boreo-mtg-1",
      meetingName: "BOREO Weekly Business Forum",
      meetingDate: today,
      meetingTime: "07:30 AM",
      place: "Grand Residency Convention Centre",
      status: "upcoming",
      termId: "Term 13",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "meetings", "boreo-mtg-1", "attendance", "boreo-mem-1"), {
      memberUid: "boreo-mem-1",
      memberName: "Rajesh Sharma",
      businessName: "Supreme Traders",
      phone: "9876543210",
      status: "present",
      markedBy: "admin",
      markedAt: serverTimestamp(),
      termId: "Term 13",
    });

    await setDoc(doc(db, "meetings", "boreo-mtg-1", "attendance", "boreo-mem-2"), {
      memberUid: "boreo-mem-2",
      memberName: "Anitha V",
      businessName: "VeeVin Tech Solutions",
      phone: "9123456789",
      status: "present",
      markedBy: "admin",
      markedAt: serverTimestamp(),
      termId: "Term 13",
    });

    await setDoc(doc(db, "meetings", "boreo-mtg-2"), {
      id: "boreo-mtg-2",
      meetingName: "BOREO Power Team Strategy Meet",
      meetingDate: today,
      meetingTime: "04:00 PM",
      place: "BOREO Executive Lounge",
      status: "upcoming",
      termId: "Term 13",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "meetings", "boreo-mtg-2", "attendance", "boreo-mem-1"), {
      memberUid: "boreo-mem-1",
      memberName: "Rajesh Sharma",
      businessName: "Supreme Traders",
      phone: "9876543210",
      status: "present",
      markedBy: "admin",
      markedAt: serverTimestamp(),
      termId: "Term 13",
    });

    // 3. One to One Meetings (2 Dummy Records)
    await setDoc(doc(db, "oneToOne", "boreo-oto-1"), {
      fromMemberId: "boreo-mem-1",
      fromMemberName: "Rajesh Sharma",
      toMemberId: "boreo-mem-2",
      toMemberName: "Anitha V",
      meetingLocation: "From Member Office",
      meetingOfficeName: "Supreme Traders Office",
      date: today,
      time: "10:00 AM",
      status: "Completed",
      termId: "Term 13",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "oneToOne", "boreo-oto-2"), {
      fromMemberId: "boreo-mem-2",
      fromMemberName: "Anitha V",
      toMemberId: "boreo-mem-1",
      toMemberName: "Rajesh Sharma",
      meetingLocation: "To Member Office",
      meetingOfficeName: "VeeVin Tech Office",
      date: today,
      time: "02:30 PM",
      status: "Completed",
      termId: "Term 13",
      createdAt: serverTimestamp(),
    });

    // 4. Visitors (2 Dummy Records)
    await setDoc(doc(db, "visitors", "boreo-vis-1"), {
      visitorName: "Vikram Patel",
      inviteById: "boreo-mem-1",
      inviteByName: "Rajesh Sharma",
      phone: "9988776655",
      companyName: "Apex Logistics Ltd",
      status: "Pending",
      visitDate: today,
      termId: "Term 13",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "visitors", "boreo-vis-2"), {
      visitorName: "Meera Nair",
      inviteById: "boreo-mem-2",
      inviteByName: "Anitha V",
      phone: "9887766554",
      companyName: "Nair Financial Advisory",
      status: "Joined",
      visitDate: today,
      termId: "Term 13",
      createdAt: serverTimestamp(),
    });

    // 5. Referrals (2 Dummy Records)
    await setDoc(doc(db, "referrals", "boreo-ref-1"), {
      type: "self",
      referrerId: "boreo-mem-1",
      referrerName: "Rajesh Sharma",
      referredUserId: "boreo-mem-2",
      referredUserName: "Anitha V",
      status: "active",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "referrals", "boreo-ref-2"), {
      type: "connect",
      referrerId: "boreo-mem-2",
      referrerName: "Anitha V",
      connectorId: "boreo-mem-1",
      connectorName: "Rajesh Sharma",
      referredUserId: "boreo-mem-1",
      referredUserName: "Rajesh Sharma",
      status: "active",
      createdAt: serverTimestamp(),
    });

    // 6. News & Events (2 Dummy Records)
    await setDoc(doc(db, "news", "boreo-evt-1"), {
      eventName: "BOREO Annual Leadership Summit 2026",
      title: "BOREO Annual Leadership Summit 2026",
      eventDate: today,
      eventTime: "09:00 AM",
      place: "Grand Hyatt Ballroom",
      description: "Annual gathering of business leaders and exchange delegates.",
      termId: "Term 13",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "news", "boreo-evt-2"), {
      eventName: "BOREO Strategic Networking Masterclass",
      title: "BOREO Strategic Networking Masterclass",
      eventDate: today,
      eventTime: "05:00 PM",
      place: "BOREO Conference Center",
      description: "Interactive session on referral growth and strategic partnerships.",
      termId: "Term 13",
      createdAt: serverTimestamp(),
    });

    // 7. Thank Notes (2 Dummy Records)
    await setDoc(doc(db, "thankNotes", "boreo-tn-1"), {
      fromMemberId: "boreo-mem-1",
      fromMemberName: "Rajesh Sharma",
      fromName: "Rajesh Sharma",
      toMemberId: "boreo-mem-2",
      toMemberName: "Anitha V",
      toName: "Anitha V",
      value: 150000,
      comments: "Thank you for the tech project referral!",
      termId: "Term 13",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "thankNotes", "boreo-tn-2"), {
      fromMemberId: "boreo-mem-2",
      fromMemberName: "Anitha V",
      fromName: "Anitha V",
      toMemberId: "boreo-mem-1",
      toMemberName: "Rajesh Sharma",
      toName: "Rajesh Sharma",
      value: 75000,
      comments: "Thank you for the trading software contract!",
      termId: "Term 13",
      createdAt: serverTimestamp(),
    });

    // 8. Terms Master (2 Dummy Terms)
    await setDoc(doc(db, "terms", "Term 13"), {
      termId: "Term 13",
      name: "Term 13 (2026)",
      isCurrent: true,
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "terms", "Term 12"), {
      termId: "Term 12",
      name: "Term 12 (2025)",
      isCurrent: false,
      createdAt: serverTimestamp(),
    });

    // 9. Masters Dropdowns
    await setDoc(doc(db, "masters", "dropdowns"), {
      positions: ["President", "Vice President", "Secretary", "Treasurer"],
      directors: ["Membership Director", "Event Director"],
      coordinators: ["Visitor Coordinator", "Education Coordinator"],
      powerTeams: ["IT & Digital", "Construction & Real Estate"],
      updatedAt: serverTimestamp(),
    });

    console.log("All BOREO collections successfully populated with dummy records!");
    return true;
  } catch (err) {
    console.error("Error seeding sample data:", err);
    throw err;
  }
}
