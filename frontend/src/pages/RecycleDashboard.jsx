"use client";

import React, { useState, useEffect } from "react";
import styles from "./RecycleDashboard.module.css";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { ListingTable } from "./ListingTable";

export const RecyclerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [role, setRole] = useState("recycler"); // Assuming role is "recycler" for this dashboard
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:6969/recycler/listings", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        setListings(data.listings || []);

        // Calculate total quantity
        const totalQty = data.listings.reduce((sum, listing) => sum + (listing.quantity || 0), 0);
        setTotalQuantity(totalQty);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  // Calculate sum of top bids
  const totalTopBid = listings.reduce((sum, listing) => sum + (listing.topBid || 0), 0);

  return (
    <div className={styles.recyclerDashboard}>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.mainContent}>
          <DashboardHeader
            listingCount={listings.length}
            totalTopBid={totalTopBid}
            // totalQuantity={totalQuantity}
            role={role}
          />
          <ListingTable listings={listings} />
        </main>
      </div>
    </div>
  );
};
