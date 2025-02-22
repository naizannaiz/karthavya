package handler

import (
	"fmt"
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateNewListing handles the POST request to create a new listing
func Newlisting(c *gin.Context) {
	var newListing model.Listing

	// Parse JSON request body
	if err := c.BindJSON(&newListing); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Get user ID from session
	userID, err := GetUserIDFromSession(c)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Assign user ID and initialize defaults
	newListing.UserID = userID
	newListing.Status = "Pending"
	newListing.TopBid = 0 // Default top bid is 0

	// Validate auction dates
	if newListing.AuctionStartDate.After(newListing.AuctionEndDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Auction start date must be before end date"})
		return
	}

	// Save to database
	if err := Db.Create(&newListing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create listing"})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{
		"message": "Listing created successfully",
		"listing": newListing,
	})
}
