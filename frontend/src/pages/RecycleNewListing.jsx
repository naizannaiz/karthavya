"use client";
import React, { useState } from "react";
import styles from "./RecycleNewListing.module.css";
import { Sidebar } from "./Sidebar";

export const RecyclerNewListing = () => {
  const [formData, setFormData] = useState({
    material: "",
    quantity: "",
    base_price: "",
    auction_start_date: "",
    auction_end_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: ["quantity", "base_price"].includes(name) ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const formatDateForBackend = (date) => {
    return date ? new Date(date).toISOString() : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      auction_start_date: formatDateForBackend(formData.auction_start_date),
      auction_end_date: formatDateForBackend(formData.auction_end_date),
    };

    try {
      const response = await fetch("http://localhost:6969/recycler/newlisting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      const result = await response.json();
      console.log("Listing Created:", result);
      alert("Listing successfully created!");

      setFormData({
        material: "",
        quantity: "",
        base_price: "",
        auction_start_date: "",
        auction_end_date: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to create listing");
    }
  };

  return (
    <div className={styles.recyclerDashboard}>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.mainContent}>
          <h2 className={styles.titlePage}>New Listing</h2>

          <form className={styles.div5} onSubmit={handleSubmit}>
            <h3 className={styles.makeanewListing}>Make a new Listing</h3>

            <div className={styles.div6}>
              <label className={styles.materialName}>Material Name</label>
              <div className={styles.div7}>
                <span className={styles.div8}>:</span>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className={styles.div9}
                  required
                />
              </div>
            </div>

            <div className={styles.div10}>
              <label className={styles.quantity}>Quantity</label>
              <div className={styles.div11}>
                <span className={styles.div12}>:</span>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={styles.div13}
                  required
                />
              </div>
            </div>

            <div className={styles.div14}>
              <label className={styles.basePrice}>Base Price</label>
              <div className={styles.div15}>
                <span className={styles.div16}>:</span>
                <input
                  type="number"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleChange}
                  className={styles.div17}
                  required
                />
              </div>
            </div>

            <div className={styles.div18}>
              <label className={styles.auctionStartDate}>Auction Start Date</label>
              <span className={styles.div19}>:</span>
              <input
                type="date"
                name="auction_start_date"
                value={formData.auction_start_date}
                onChange={handleChange}
                className={styles.div20}
                required
              />
            </div>

            <div className={styles.div21}>
              <label className={styles.auctionEndDate}>Auction End Date</label>
              <span className={styles.div22}>:</span>
              <input
                type="date"
                name="auction_end_date"
                value={formData.auction_end_date}
                onChange={handleChange}
                className={styles.div23}
                required
              />
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
