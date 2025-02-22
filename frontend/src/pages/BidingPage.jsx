"use client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./RecycleNewListing.module.css";
import { Sidebar } from "./Sidebar";

export const BidingPage = () => {
  const { id } = useParams(); // Get listing_id from URL
  const [formData, setFormData] = useState({
    offered_price: "", // Start empty to prevent unwanted 0 values
    listing_id: id || "", // Ensure it's always defined
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value), // Convert to number if not empty
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.listing_id || formData.offered_price <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await fetch("http://localhost:6969/corporate/newbid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          listing_id: formData.listing_id,
          offered_price: formData.offered_price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place bid");
      }

      const result = await response.json();
      console.log("Bid Submitted:", result);
      alert("Bid placed successfully!");

      // Reset form after successful submission
      setFormData({ offered_price: "", listing_id: id });
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to place bid");
    }
  };

  return (
    <div className={styles.recyclerDashboard}>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.mainContent}>
          <h2 className={styles.titlePage}>Place Bid</h2>

          <form className={styles.div5} onSubmit={handleSubmit}>
            <h3 className={styles.makeanewListing}>Place a new Bid</h3>

            <div className={styles.div10}>
              <label className={styles.quantity}>Amount</label>
              <div className={styles.div11}>
                <span className={styles.div12}>:</span>
                <input
                  type="number"
                  name="offered_price"
                  value={formData.offered_price}
                  onChange={handleChange}
                  className={styles.div13}
                  required
                  min="1"
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};
