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

export const BidTable = ({ bids = {} }) => {  // Default to empty object
  const navigate = useNavigate();
  console.log("BidTable Data:", bids);

  const handleViewClick = (id) => {
    navigate(`/recycler/listing/${id}`);
  };

  return (
    <section className={styles.tableContainer}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="listings table">
          <TableHead>
            <TableRow>
              <TableCell>Supplier Name</TableCell>
              <TableCell align="right">Material Name</TableCell>
              <TableCell align="right">Offered Price</TableCell>
              <TableCell align="right">Status</TableCell>
              {/* <TableCell align="right">Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(bids.data) && bids.data.length > 0 ? (
              bids.data.map((listing, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {listing.supplier_name || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    {listing.Material_name || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    {listing.offered_price ? `₹${listing.offered_price.toLocaleString()}` : "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <span className={`${styles.status} ${styles[listing.Status?.toLowerCase().replace(/\s/g, "")] || ""}`}>
                      {listing.Status || "N/A"}
                    </span>
                  </TableCell>
                  {/* <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewClick(listing.id)}
                    >
                      View
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No bids found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};
