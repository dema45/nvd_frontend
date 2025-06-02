import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//admin
import Sidebar from "./components/admin/sidebar/Sidebar";
import Navbar from "./components/admin/navbar/Navbar";
import Dashboard from "./components/admin/dashboard/Dashboard.jsx";
// import  StatisticsCards from "./components/admin/dashboard/statisticscar.jsx"

import Create_session from "./components/admin/manage_session/Create_session";
import View_session from "./components/admin/manage_session/View_session";
import Edit_session from "./components/admin/manage_session/Edit_session.jsx";

import Create_party from "./components/admin/manage_party/Create_party";
import View_party from "./components/admin/manage_party/View_party";
import Edit_party from "./components/admin/manage_party/Edit_party.jsx";

import Create_candidate from "./components/admin/manage_candidate/Create_candidate.jsx";
import View_candidate from "./components/admin/manage_candidate/View_candidate";
import Edit_candidate from "./components/admin/manage_candidate/Edit_candidate.jsx";

import Create_election from "./components/admin/manage_election_round/Create_election.jsx";
import View_election from "./components/admin/manage_election_round/View_election.jsx";
import Edit_election from "./components/admin/manage_election_round/Edit_election.jsx";

import Create_dzongkhag from "./components/admin/manage_dzongkhag/Create_dzongkhag.jsx";
import View_dzongkhag from "./components/admin/manage_dzongkhag/View_dzongkhag.jsx";
import Edit_dzongkhag from "./components/admin/manage_dzongkhag/Edit_dzongkhag.jsx";

import Create_constituency from "./components/admin/manage_constituency/Create_constituency.jsx";
import View_constituency from "./components/admin/manage_constituency/View_constituency.jsx";
import Edit_constituency from "./components/admin/manage_constituency/Edit_constituency.jsx";

import Voter_verification from "./components/admin/voter_verification/Voter_verification.jsx";

import Edit_profile from "./components/admin/admin_profile/Edit_profile.jsx";
import ProfilePage from "./components/admin/admin_profile/Profilepage.jsx.jsx";
import Reset_password from "./components/admin/admin_profile/Reset_password.jsx";
import AdminRegister from "./components/admin/adminlogin/admin-insert.jsx";
import AdminLogin from "./components/admin/adminlogin/admin-login.jsx";
import ForgotPassword from "./components/admin/Forgotpassword/Forgotpassword.jsx";

import Primaryresult from "./components/admin/result/primary_result.jsx"
import Generalresult from "./components/admin/result/general_result.jsx";
import Resultdashboard from "./components/admin/result/Resultpage.jsx"

//voter
// import SignUp from "./components/voter/SignUp";
import Login from "./components/voter/Login";
import SignUp from "./components/voter/SignUp.jsx";
import LandingPage from "./components/voter/LandingPage";
import PoliticalParties from "./components/voter/PoliticalParties";
import Homepage from "./components/voter/HomePage";
import PrimaryVotingResult from "./components/voter/PrimaryVotingResult";
import pVotingResults from "./components/data/PrimaryResult";
import PartySelection from "./components/voter/PartySelection";
import CandidateSelection from "./components/voter/CandidateSelection.jsx";
import ElectionEvents from "./components/voter/ElectionEvents";
import VotingResults from "./components/voter/VotingResults";
import UserProfile from "./components/voter/UserProfile";
import PdpPoliticalParty from './components/voter/PDPPoliticalParty';
import DntPoliticalParty from './components/voter/dntPoliticalParty';
import BtpPoliticalParty from './components/voter/btpPoliticalParty';
import DptPoliticalParty from './components/voter/dptPoliticalParty';
import EditAdminProfile from "./components/voter/ProfilePage";
import About from "./components/voter/About.jsx";
import AboutUs from "./components/voter/AboutUs.jsx";
import GeneralRound from "./components/voter/GeneralRound.jsx";
import ContactUs from "./components/voter/ContactUs.jsx";
import Contact from "./components/voter/Contact.jsx";
import Generalresultprimary from "./components/voter/generalresult.jsx";
import Generaldetailedresult from "./components/voter/general_detailed_result.jsx"
import ExploreParty1 from "./components/voter/ExploreParty.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/card" element={<StatisticsCards />} /> */}
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/create_session" element={<Create_session/>} />
        <Route path="/view_session" element={<View_session />} />
        <Route path="/edit_session/:id" element={<Edit_session />} />

        <Route path="/create_party" element={<Create_party />} />
        <Route path="/view_party" element={<View_party/>} />
        <Route path="/edit_party/:id" element={<Edit_party/>} />
        <Route path="/Create_candidate" element={<Create_candidate />} />

        <Route path="/view_candidate" element={<View_candidate />} />
        <Route path="/edit_candidate/:id" element={<Edit_candidate />} />

        <Route path="/create_election" element={<Create_election/>} />
        <Route path="/view_election" element={<View_election/>} />
        <Route path="/edit_election/:id" element={<Edit_election/>} />

        <Route path="/create_dzongkhag" element={<Create_dzongkhag  />} />
        <Route path="/view_dzongkhag" element={<View_dzongkhag/>} />
        <Route path="/edit_dzongkhag/:id" element={<Edit_dzongkhag/>} />

        <Route path="/create_constituency" element={<Create_constituency />} />
        <Route path="/view_constituency" element={<View_constituency/>} />
        <Route path="/edit_constituency/:id" element={<Edit_constituency/>} />

        <Route path="/voter_verification" element={<Voter_verification/>} />


        <Route path="/edit_profile" element={<Edit_profile/>} />
        <Route path="/profilepage" element={<ProfilePage/>} />
        <Route path="/reset_password" element={<Reset_password/>} />
        <Route path="/insert-admin" element={<AdminRegister/>} />
        <Route path="/login-admin" element={<AdminLogin/>} />
        <Route path="/Forgot-password" element={<ForgotPassword/>} />

        <Route path="Result-dashboard" element={<Resultdashboard/>}/>
        <Route path="Primary-result" element={<Primaryresult/>}/>
        <Route path="General-result" element={<Generalresult/>}/>



        {/* user */}
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/politicalParty" element={<PoliticalParties />} />
        <Route path="/pVotingResults" element={<PrimaryVotingResult data={pVotingResults} />} />
        <Route path="/PartySelection" element={<PartySelection />} />
        <Route path="/ElectionEvents" element={<ElectionEvents />} />
        <Route path="/Votingresults" element={ <VotingResults/>} />
        <Route path="/editadminprofile" element={<EditAdminProfile/>} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/pdpPoliticalParty" element={<PdpPoliticalParty />} />
        <Route path="/dntPoliticalParty" element={<DntPoliticalParty />} />
        <Route path="/btpPoliticalParty" element={<BtpPoliticalParty />} />
        <Route path="/dptPoliticalParty" element={<DptPoliticalParty />} />
        <Route path="/about" element={<About  />} />
        <Route path="/aboutus" element={<AboutUs  />} />
        <Route path="/CandidateSelection" element={<CandidateSelection/>}/>
        <Route path="/generalround" element={<GeneralRound />} />
        <Route path="/contactus" element={<ContactUs/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/generalresult" element={<Generalresultprimary/>} />
        <Route path="/generaldetailedresult" element={<Generaldetailedresult/>} />
        <Route path="/exploreparty/:id" element={<ExploreParty1/>} />



        
















      </Routes>
    </BrowserRouter>
  );
}

export default App;
