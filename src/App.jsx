import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MemberProfile from "./pages/MemberProfile";
import MemberFormPage from "./pages/MemberFormPage";
import NewsEvents from "./pages/NewsEvents";
import EventDetailsPage from "./pages/EventDetailsPage";
import EventFormPage from "./pages/EventFormPage";
import ThankNotes from "./pages/ThankNotes";
import Meetings from "./pages/Meetings";
import MeetingDetailsPage from "./pages/MeetingDetailsPage";
import MeetingFormPage from "./pages/MeetingFormPage";
import PowerTeamMeetings from "./pages/PowerTeamMeetings";
import PowerTeamMeetingDetailsPage from "./pages/PowerTeamMeetingDetailsPage";
import PowerTeamMeetingFormPage from "./pages/PowerTeamMeetingFormPage";
import OneToOne from "./pages/OneToOne";
import OneToOneDetailsPage from "./pages/OneToOneDetailsPage";
import Visitors from "./pages/Visitors";
import VisitorDetailsPage from "./pages/VisitorDetailsPage";
import Referrals from "./pages/Referrals";
import ReferralDetailsPage from "./pages/ReferralDetailsPage";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              <Route path="/members/new" element={<MemberFormPage mode="add" />} />
              <Route path="/members/:id" element={<MemberProfile />} />
              <Route path="/members/:id/edit" element={<MemberFormPage mode="edit" />} />
              <Route path="/news-events" element={<NewsEvents />} />
              <Route path="/news-events/new" element={<EventFormPage mode="add" />} />
              <Route path="/news-events/:id" element={<EventDetailsPage />} />
              <Route path="/news-events/:id/edit" element={<EventFormPage mode="edit" />} />
              <Route path="/thank-notes" element={<ThankNotes />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/meetings/new" element={<MeetingFormPage mode="add" />} />
              <Route path="/meetings/:id" element={<MeetingDetailsPage />} />
              <Route path="/meetings/:id/edit" element={<MeetingFormPage mode="edit" />} />
              <Route path="/power-team-meetings" element={<PowerTeamMeetings />} />
              <Route path="/power-team-meetings/new" element={<PowerTeamMeetingFormPage mode="add" />} />
              <Route path="/power-team-meetings/:id" element={<PowerTeamMeetingDetailsPage />} />
              <Route path="/power-team-meetings/:id/edit" element={<PowerTeamMeetingFormPage mode="edit" />} />
              <Route path="/one-to-one" element={<OneToOne />} />
              <Route path="/one-to-one/:id" element={<OneToOneDetailsPage />} />
              <Route path="/r-to-r" element={<OneToOne />} />
              <Route path="/r-to-r/:id" element={<OneToOneDetailsPage />} />
              <Route path="/visitors" element={<Visitors />} />
              <Route path="/visitors/:id" element={<VisitorDetailsPage />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/referrals/:id" element={<ReferralDetailsPage />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
