"use client";

import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null); // Store user role

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:6969/auth/user", { credentials: "include" });
        if (!response.ok) throw new Error("Failed to fetch user role");
        const data = await response.json();
        setUserRole(data.role); // Assuming API returns { role: "recycler" } or { role: "corporate" }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoCircle}>R</div>
        <h1 className={styles.logoText}>Revivo</h1>
      </div>
      <h2 className={styles.menuTitle}>Menu</h2>

      {/* DASHBOARD - Different routes for Recycler & Corporate */}
      {userRole === "recycler" ? (
        <button
          className={location.pathname === "/recycler" ? styles.activeButton : styles.menuItem}
          onClick={() => navigate("/recycler")}
        >
          Dashboard
        </button>
      ) : userRole === "corporate" ? (
        <button
          className={location.pathname === "/corporate" ? styles.activeButton : styles.menuItem}
          onClick={() => navigate("/corporate")}
        >
          Dashboard
        </button>
      ) : null}

      {/* NEW LISTING - Only for Recycler */}
      {userRole === "recycler" && (
        <button
          className={location.pathname === "/recycler/newlisting" ? styles.activeButton : styles.menuItem}
          onClick={() => navigate("/recycler/newlisting")}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/22ac3c6b4bdc2f095d28aefe4d7d3aa9136fc9c444650d33c3f88f4f969c5501"
            className={styles.menuIcon}
            alt=""
          />
          <span>New Listing</span>
        </button>
      )}

      {/* LATEST AUCTION - Only for Corporate */}
      {userRole === "corporate" && (
        <button
          className={location.pathname === "/corporate/latest-auction" ? styles.activeButton : styles.menuItem}
          onClick={() => navigate("/corporate/latest-auction")}
        >
          Latest Auction
        </button>
      )}
    </nav>
  );
};
