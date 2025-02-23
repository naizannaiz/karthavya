"use client";

import React from "react";
import styles from "./DashboardHeader.module.css";

export const DashboardHeader = ({ listingCount, totalTopBid, totalQuantity, totalParticipated, role,credits }) => {
  return (
    <header className={styles.header}>
      <input type="search" placeholder="Search" className={styles.searchInput} />
      
      <div className={styles.statsContainer}>
        <div className={styles.statsCard}>
          <h2 className={styles.pageTitle}>DASHBOARD</h2>
          {role === "recycler" ? (
            <>
              <h3 className={styles.statLabel}>Total Earnings</h3>
              <p className={styles.statValue}>INR {totalTopBid}</p>

              <h3 className={styles.statLabel}>Total Listings</h3>
              <p className={styles.listingCount}>{listingCount}</p>
              <h3 className={styles.statLabel}>Total Carbon credits</h3>
              <p className={styles.listingCount}>{credits}</p>
            </>
          ) : (
            <>
               <h3 className={styles.statLabel}>Total Quantity</h3>
               <p className={styles.statValue}>{totalQuantity} kg</p>

               <h3 className={styles.statLabel}>Total Participated Auctions</h3>
               <p className={styles.listingCount}>{totalParticipated}</p>

               <h3 className={styles.statLabel}>Total Carbon credits Available</h3>
               <p className={styles.listingCount}>{credits}</p>

            </>
          )}

        </div>

        {/* <div className={styles.statsCard}>
          {role === "corporation" ? (
            <>
              
            </>
          ) : (
            <>

            </>
          )}
        </div> */}
      </div>
    </header>
  );
};
