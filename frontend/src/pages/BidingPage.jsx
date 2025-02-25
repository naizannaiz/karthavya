"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./BidingPage.module.css";
import { Sidebar } from "./Sidebar";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const BidingPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    offered_price: "",
    listing_id: id || "",
  });
  const [listing,setListing] = useState({})
  const [material, setMaterial] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");

  const metalMarketPrices = {
    gold: { min: 58000, max: 62000 },
    silver: { min: 700, max: 900 },
    copper: { min: 750, max: 850 },
    aluminum: { min: 190, max: 250 },
    steel: { min: 45, max: 60 },
    platinum: { min: 25000, max: 30000 },
    palladium: { min: 45000, max: 50000 },
    nickel: { min: 1200, max: 1500 },
    lead: { min: 180, max: 220 },
    zinc: { min: 230, max: 270 },
  };

  // Fetch Bid Details
  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const response = await fetch(`http://localhost:6969/listing/${id}`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch bid details");

        const bidData = await response.json();
        console.log("Bid Details:", bidData.data);
        setListing(bidData.data)
        setMaterial(bidData.data.material || ""); // Ensures material is set
      } catch (error) {
        console.error("Error fetching bid details:", error);
      }
    };

    if (id) {
      fetchBidDetails();
    }
  }, [id]);

  // Fetch Market Price from Gemini API (Triggered by AI Button)
  const fetchMarketPrice = async () => {
    if (!material || !formData.offered_price) {
      setGeminiResponse("Please enter a valid amount and ensure the material is available.");
      return;
    }

    try {
      const apiKey = "AIzaSyC_gqs_ZN2F-k3B-8tb0rcTRhcssl7ZLoc"; // Replace with your API key
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

      const marketData = metalMarketPrices[material.toLowerCase()];
      if (!marketData) {
        setGeminiResponse(`Market data for ${material} is unavailable.`);
        return;
      }

      const prompt = `
        The user has placed a bid of ₹${formData.offered_price} for ${material}.
        The market price range for ${material} is ₹${marketData.min} - ₹${marketData.max}.
        Is the bid above or below the market price? Provide a short answer (under 100 words).
      `;

      const result = await model.generateContent(prompt);
      const textResponse = await result.response.text();

      console.log("Gemini Response:", textResponse);
      setGeminiResponse(textResponse);
    } catch (error) {
      console.error("Error fetching market price:", error);
      setGeminiResponse("Failed to fetch market price.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value),
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

      if (!response.ok) throw new Error("Failed to place bid");

      const result = await response.json();
      console.log("Bid Submitted:", result);
      alert("Bid placed successfully!");

      // Reset form after successful submission
      setFormData({ offered_price: "", listing_id: id });
      setGeminiResponse(""); // Clear AI response
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
                        </div>
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
            <div className={styles.buttonContainer}>
                <button type="submit" className={styles.submitButton}>
                    Submit
                </button>
                <button type="button" onClick={fetchMarketPrice} className={styles.submitButton}>
                    AI Analysis
                </button>
            </div>
          </form>



          {geminiResponse && (
            <div className={styles.responseBox}>
              <h4>Gemini AI Response:</h4>
              <p>{geminiResponse}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
