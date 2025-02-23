"use client";
import React, { useState } from "react";
import styles from "./RecycleNewListing.module.css";
import { Sidebar } from "./Sidebar";

export const SellCarbonCredit = () => {
  const [formData, setFormData] = useState({
    available_to_sell:0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value), // Allow empty string for user input
    });
  };
  
  

  const formatDateForBackend = (date) => {
    return date ? new Date(date).toISOString() : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formattedData = {
      
    // };

    try {
      const response = await fetch("http://localhost:6969/recycler/sellCredits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        console.log(response)
        throw new Error("Failed to create listing");
      }

      const result = await response.json();
      console.log("Listing Created:", result);
      alert("amount to sell successfully created!");

      setFormData({
        available_to_sell:0
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
          <h2 className={styles.titlePage}>Sell Carbon Credit</h2>

          <form className={styles.div5} onSubmit={handleSubmit}>
            <h3 className={styles.makeanewListing}>Specify the amount to sell</h3>

            <div className={styles.div6}>
              <label className={styles.materialName}>Amount to sell</label>
              <div className={styles.div7}>
                <span className={styles.div8}>:</span>
                <input
                  type="number"
                  name="available_to_sell"
                  value={formData.available_to_sell}
                  onChange={handleChange}
                  className={styles.div9}
                  required
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
