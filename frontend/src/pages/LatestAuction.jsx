"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./CorporateDashboard.module.css";
import { Sidebar } from "./Sidebar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export const LatestAuction = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:6969/listing", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        setListings(data.data || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  // Function to navigate to corporate bid page
  const handleBidClick = (id) => {
    navigate(`/corporate/bid/${id}`); // Navigate to the bid page with listing ID
  };

  return (
    <div className={styles.corporateDashboard}>
      <div className={styles.div}>
        <Sidebar />
        <main className={styles.column2}>
          <div className={styles.div5}>
            <div className={styles.statsContainer}>
              <div className={styles.statsCard}>
                <h2 className={styles.pageTitle}>Latest Auction</h2>
              </div>
            </div>

            {/* Auctions Table */}
            <section className={styles.tableContainer}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="listings table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Material Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Base Price</TableCell>
                      <TableCell align="right">Auction Start Date</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Top Bid</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listings.map((listing, index) => (
                      <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {listing.material || "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          {listing.quantity?.toLocaleString() || "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          {listing.base_price ? `₹${listing.base_price.toLocaleString()}` : "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          {listing.auction_start_date || "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          <span className={`${styles.status} ${styles[listing.status?.toLowerCase().replace(/\s/g, "")] || ""}`}>
                            {listing.status || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell align="right">
                          {listing.topBid ? `₹${listing.topBid}` : "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleBidClick(listing.id)}
                          >
                            Bid
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
