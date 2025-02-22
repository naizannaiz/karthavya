"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ListingTable.module.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export const ListingTable = ({ listings }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleViewClick = (id) => {
    navigate(`/recycler/listing/${id}`); // Navigate to the listing details page
  };
  return (
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
                  {listing.base_price ? `$${listing.base_price?.toLocaleString()}` : "N/A"}
                </TableCell>
                <TableCell align="right">
                  {listing.auction_start_date || "N/A"}
                </TableCell>
                <TableCell align="right">
                  <span className={`${styles.status} ${styles[listing.status?.toLowerCase().replace(" ", "")]}`}>
                    {listing.status || "N/A"}
                  </span>
                </TableCell>
                <TableCell align="right">
                  {listing.topBid ? `$${listing.topBid}` : "N/A"}
                </TableCell>
                <TableCell align="right">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewClick(listing.id)} // Navigate on click
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};
