import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import TeacherDashboard from "./pages/TeacherDashboard.jsx";

import { useState, useEffect } from "react";
import "./App.css";
import { SignUp } from "./pages/SignUp.jsx";
import { Login } from "./pages/Login.jsx";
import { RecyclerDashboard } from "./pages/RecycleDashboard.jsx";
import { RecyclerNewListing } from "./pages/RecycleNewListing.jsx";
import { RecyclerAuctionRecord } from "./pages/ViewBidsForListing.jsx";
import { CorporateDashboard } from "./pages/CorporateDashboard.jsx";
import { LatestAuction } from "./pages/LatestAuction.jsx";
import { BidingPage } from "./pages/BidingPage.jsx";
import { SellCarbonCredit } from "./pages/SellCarbonCredits.jsx";
import { BuyCarbonCredit } from "./pages/BuyCarbonCredit.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recycler" element={<RecyclerDashboard />} />
        <Route path="/recycler/newlisting" element={<RecyclerNewListing />} />
        <Route path="/recycler/listing/:id" element={<RecyclerAuctionRecord />}/>
        <Route path="/recycler/sellCredits" element={<SellCarbonCredit />}/>


        <Route path="/corporate" element={<CorporateDashboard />}/>
        <Route path="/corporate/latest-auction" element={<LatestAuction />}/>
        <Route path="/corporate/bid/:id" element={<BidingPage />}/>
        <Route path="/corporate/buyCredits" element={<BuyCarbonCredit />}/>
      </Routes>
    </Router>
  );
};

export default App;