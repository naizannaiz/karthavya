"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ViewBidsForListing.module.css";
import { Sidebar } from "./Sidebar";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const RecyclerAuctionRecord = () => {
  const { id } = useParams(); // Get listing ID from URL params
  const [bids, setBids] = useState([]);
  const [listing, setListing] = useState(null);
  const [userDetails, setUserDetails] = useState({}); // Store user details

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch listing details
        const listingResponse = await fetch(`http://localhost:6969/listing/${id}`, {
          credentials: "include",
        });

        if (!listingResponse.ok) {
          throw new Error(`Failed to fetch listing details: ${listingResponse.status}`);
        }

        const listingData = await listingResponse.json();
        console.log("listing data:", listingData.data);

        // Check if the API response contains `data`
        if (listingData && listingData.data) {
          setListing(listingData.data);
        } else {
          console.error("Listing data format unexpected:", listingData);
          setListing(null);
        }

        // Fetch bids
        const bidsResponse = await fetch(`http://localhost:6969/listing/${id}/bids`, {
          credentials: "include",
        });

        if (!bidsResponse.ok) {
          throw new Error(`Failed to fetch bids: ${bidsResponse.status}`);
        }

        const bidsData = await bidsResponse.json();
        console.log("bids data:", bidsData);
        console.log("update:", listing);
        const bidList = bidsData.data || [];

        setBids(bidList);

        // Fetch corporate names for each bid
        const userData = {};
        for (const bid of bidList) {
          console.log("Bid:", bid);
          if (!userData[bid.user_id]) {
            const userResponse = await fetch(`http://localhost:6969/user/${bid.corporate_id}`, {
              credentials: "include",
            });

            if (userResponse.ok) {
              const user = await userResponse.json();
              console.log("User data:", user.data);
              userData[bid.user_id] = user.data?.username || "Unknown";
            } else {
              userData[bid.user_id] = "Unknown";
            }
          }
        }

        setUserDetails(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <main className={styles.recyclerAuctionRecord}>
      <div className={styles.div}>
        <Sidebar />
        <section className={styles.column2}>
          <div className={styles.div5}>
            <input type="search" placeholder="Search" className={styles.inputSearch} />
            <h2 className={styles.titlePage}>Auction Record</h2>
            <div className={styles.div6}>
              <div className={styles.div7}>
                <span className={styles.auctionId}>Auction ID: </span>
                <span className={styles.auc123}>{id}</span>
              </div>
              <div className={styles.div8}>
                <span className={styles.material}>Material: </span>
                <span className={styles.copperWire}>{listing?.material || "N/A"}</span>
              </div>
              <div className={styles.div9}>
                <span className={styles.status}>Status: </span>
                <span className={styles.ongoing}>{listing?.status || "N/A"}</span>
              </div>
            </div>

            {/* TABLE FOR BIDS */}
            <section className={styles.tableContainer}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="bids table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Corporate Name</TableCell>
                      <TableCell align="right">Offered Price</TableCell>
                      <TableCell align="right">Time Stamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bids.length > 0 ? (
                      bids.map((bid, index) => (
                        <TableRow key={index}>
                          <TableCell>{userDetails[bid.user_id] || "Loading..."}</TableCell>
                          <TableCell align="right">${bid.offered_price?.toLocaleString() || "N/A"}</TableCell>
                          <TableCell align="right">{bid.timeStamp || "N/A"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No bids available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};
