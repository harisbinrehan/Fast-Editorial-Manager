import "./App.css";
import Home from "./pages/home/Home";
import Author from "./pages/author/Author";
import NavigationBar from "./components/Navbar.Component/NavigationBar";
import MyStepper from "./pages/author/Stepper";
import SignIn from "./pages/home/SignIn";
import SignUp from "./pages/home/SignUp";
import DrawerMain from "./components/Drawer.component/Drawer.main";
import AboutUs from "./pages/home/AboutUs";
import NewInvitations from "./pages/Reviewer/NewInvitations";
import Authorroutes from "./routes/Authorroutes";
import StartReview from "./pages/Reviewer/StartReview";
import PendingReviews from "./pages/Reviewer/PendingReviews";
import Editor from "./pages/Editor/Editor";
import ContactUs from "./pages/home/ContactUs";
import ReviewerDecisions from "./pages/Editor/ReviewerDecisions";
import { UserContext } from "./context/Users/User";
import { useContext } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import NavigationBarMain from "./components/Navbar.Component/NavigationBarMain";
import Reviewer from "./pages/Reviewer/Reviewer";
import { ManuscriptProvider } from "./context/Manuscript/Manuscript";
import DrawerRev from "./components/Drawer.component/DrawerRev";
import DrawerEditor from "./components/Drawer.component/DrawerEditor";
import AssignReviewers from "./pages/Editor/AssignReviewers";
import Testing from "./pages/home/Testing";
import NewSubmissions from "./pages/Editor/NewSubmissions";
import PendingDecisions from "./pages/Editor/PendingDecisions";
import FinalDecisions from "./pages/Editor/FinalDecisions";
import IncompleteSubmission from "./pages/author/incomplete";
import ReSubmittedPapers from "./pages/Editor/ReSubmitted";
import SubmissionNeedingRevision from "./pages/author/SubmissionNeedingRevision";
import RevisionsBeingProcessed from "./pages/author/RevisionsBeingProcessed";
import EditManuscriptDetails from "./pages/author/EditManuscriptDetails";
import Declined from "./pages/author/Declined";
import SubmissionsWithDecision from "./pages/author/SubmissionsWithDecisions";
import ResetPasswordForm from "./pages/home/ResetPasswordForm";
import EditProfileAuthor from "./pages/author/EditProfileAuthor";
import EditProfileRev from "./pages/Reviewer/EditProfileReviewer";
import CompletedSubmissions from "./pages/author/CompletedSubmissions";
import CompletedReviews from "./pages/Reviewer/CompletedReviews";
import EditProfileEditor from "./pages/Editor/EditProfileEditor";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useContext(UserContext);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const location = useLocation();
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading component or spinner
  }
  return (
    <div>
      {location.pathname.startsWith("/Home") ||
        location.pathname.startsWith("/SignIn") ||
        location.pathname.startsWith("/AboutUs") ||
        location.pathname.startsWith("/ContactUs") ||
        location.pathname.startsWith("/Password-reset") ||
        location.pathname.startsWith("/SignUp") ? (
        <NavigationBar />
      ) : (
        <NavigationBarMain handleDrawerToggle={handleDrawerToggle} user={user} />
      )}
      <ManuscriptProvider>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/Password-reset/:token" element={<ResetPasswordForm />} />

          {/* <Route
            path="/Author"
            element={
              <DrawerMain
                handleDrawerToggle={handleDrawerToggle}
                mobileOpen={mobileOpen}
              />
            }>
            <Route path="main" element={<Author />} />
            <Route path="stepper" element={<MyStepper />} />
            <Route path="incomplete-submission" element={<IncompleteSubmission />} />
          </Route> */}

          <Route
            path="/Author"
            element={
              <ProtectedRoutes>
                <DrawerMain
                  handleDrawerToggle={handleDrawerToggle}
                  mobileOpen={mobileOpen}
                />
              </ProtectedRoutes>
            }
          >
            <Route path="main" element={<Author />} />
            <Route path="stepper" element={<MyStepper />} />
            <Route
              path="incomplete-submission"
              element={<IncompleteSubmission />}
            />
            <Route path="Submissions-Needing-Revision" element={<SubmissionNeedingRevision />} />
            <Route path="Revisions-Being-Processed" element={<RevisionsBeingProcessed />} />
            <Route path="Declined-Manuscripts" element={<Declined />} />
            <Route path="Show-decision" element={<EditManuscriptDetails />} />
            <Route path="Submissions-with-Decision" element={<SubmissionsWithDecision />} />
            <Route path="Edit-Profile-Author" element={<EditProfileAuthor />} />
            <Route path="Completed-Submission" element={<CompletedSubmissions />} />
          </Route>

          <Route
            path="/Reviewer"
            element={
              <ProtectedRoutes>

                <DrawerRev
                  handleDrawerToggle={handleDrawerToggle}
                  mobileOpen={mobileOpen}
                />
              </ProtectedRoutes>

            }>
            <Route path="main" element={<Reviewer />} />
            <Route path="NewInvitations" element={<NewInvitations />} />
            {/* <Route path="Testing" element={<Testing />} /> */}
            <Route path="StartReview/:manuscriptId" element={<StartReview />} />
            <Route path="PendingReviews" element={<PendingReviews />} />
            <Route path="Edit-Profile-Reviewer" element={<EditProfileRev />} />
            <Route path="Completed-Reviews" element={<CompletedReviews />} />
            {/* <Route path="CompletedReviews" element={<CompletedReviews />} /> */}

          </Route>
          <Route
            path="/Editor"
            element={
              <ProtectedRoutes>
                <DrawerEditor
                  handleDrawerToggle={handleDrawerToggle}
                  mobileOpen={mobileOpen}
                />
              </ProtectedRoutes>
            }>
            <Route path="main" element={<Editor />} />
            <Route path="NewSubmission" element={<NewSubmissions />} />
            <Route path="AssignReviewers" element={<AssignReviewers />} />
            <Route path="PendingReviews" element={<PendingReviews />} />
            <Route path="PendingDecisions" element={<PendingDecisions />} />
            <Route path="ReSubmitted" element={<ReSubmittedPapers />} />
            <Route path="FinalDecisions" element={<FinalDecisions />} />
            <Route path="ReviewerDecisions/:manuscriptId" element={<ReviewerDecisions />} />
            <Route path="Edit-Profile-Editor" element={<EditProfileEditor />} />
            {/* <Route path="NewInvitations" element={<NewInvitations />} />
            <Route path="Testing" element={<Testing />} /> 
            {/* <Route path="stepper" element={<MyStepper />} /> */}
          </Route>
        </Routes>
      </ManuscriptProvider>
      {/* <MyComponent/> */}
    </div>

  );
}
export default App;
