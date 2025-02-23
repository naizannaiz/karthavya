"use client";
import React, { useEffect, useState } from "react";
import styles from "./CorporateDashboard.module.css";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { BidTable } from "./BidTable";

export const CorporateDashboard = () => {
  const [bids, setBids] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalParticipated, setTotalParticipated] = useState(0);
   const [userCredit, setUserCredit] = useState(0);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch("http://localhost:6969/corporate/allBids", {
          credentials: "include", // Ensures cookies are sent
        });

        if (!response.ok) throw new Error("Failed to fetch bids");

        const data = await response.json();
        const ud = data.data
        setBids(data || []);
        console.log("data1:",ud)
        console.log("data2:",ud)

        // Calculate total quantity & participated auctions
        const totalQty = ud?.reduce((sum, bid) => sum + (bid.quantity || 0), 0) || 0;
        setTotalQuantity(totalQty);
        setTotalParticipated(ud?.length || 0);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    const fetchUserCredit = async () => {
      try {
        const response = await fetch(`http://localhost:6969/user/0`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        const ud = userData.data
        console.log("Carbon Credit:",ud.credit );
        setUserCredit(ud.credit || 0);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchBids();
    fetchUserCredit()
  }, []);

  return (
    <div className={styles.corporateDashboard}>
      <div className={styles.div}>
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content */}
        <main className={styles.column2}>
          <div className={styles.div5}>
            {/* Dashboard Stats */}
            <DashboardHeader totalQuantity={totalQuantity} totalParticipated={totalParticipated} role="corporate" credits={userCredit}/>

            {/* Auctions Table */}
            <BidTable bids={bids} />
          </div>
        </main>
      </div>
    </div>
  );
};
