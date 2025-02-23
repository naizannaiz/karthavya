"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
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

export const BuyCarbonCredit = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:6969/creditSellers", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        console.log("lloys:",data.data)
        setListings(data.data || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  // Function to buy credits
  const handleBuyClick = async (id, availableCredits) => {
    if (!id || !availableCredits) return;
  
    try {
      const response = await fetch(`http://localhost:6969/buyCredit/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          quantity: availableCredits, // 🔹 Set quantity to available credits
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to buy credits");
      }
  
      const result = await response.json();
      alert("Credits purchased successfully!");
  
      // Refresh the listings after successful purchase
      setListings((prevListings) =>
        prevListings.filter((listing) => listing.id !== id)
      );
    } catch (error) {
      console.error("Error buying credits:", error);
      alert("Failed to purchase credits");
    }
  };
  
  

  return (
    <div className={styles.corporateDashboard}>
      <div className={styles.div}>
        <Sidebar />
        <main className={styles.column2}>
          <div className={styles.div5}>
            <div className={styles.statsContainer}>
              <div className={styles.statsCard}>
                <h2 className={styles.pageTitle}>Buy Carbon Credit</h2>
              </div>
            </div>

            {/* Auctions Table */}
            <section className={styles.tableContainer}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="listings table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Recycler Name</TableCell>
                      <TableCell align="right">Offered Credits</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listings.map((listing, index) => (
                      <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {listing.recycler_username || "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          {listing.available_to_sell?.toLocaleString() || "N/A"}
                        </TableCell>
                        <TableCell align="right">                        
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBuyClick(listing.id, listing.available_to_sell)}
                        disabled={!listing.id}
                        >
                        Buy
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
