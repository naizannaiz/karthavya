package handler

import (
	"fmt"
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func NewBid(c *gin.Context) {
	var requestData struct {
		ListingID    string `json:"listing_id"`
		OfferedPrice int    `json:"offered_price"`
	}

	// Bind incoming JSON to struct
	if err := c.BindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request format"})
		return
	}

	// Validate input
	if requestData.ListingID == "" || requestData.OfferedPrice <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "listing_id and a valid offered_price are required"})
		return
	}

	fmt.Println("Received Bid Request:", requestData)

	// Get Corporate ID from session
	corporateID, err := GetUserIDFromSession(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	// Fetch the Listing to get the Recycler (User) ID and Material Name
	var listing model.Listing
	if err := Db.Where("id = ?", requestData.ListingID).First(&listing).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Listing not found"})
		return
	}

	// Fetch Recycler (User) details
	var recycler model.User
	if err := Db.Where("id = ?", listing.UserID).First(&recycler).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recycler not found"})
		return
	}

	// Create a new bid entry
	bid := model.Bids{
		CorporateID:  corporateID,
		ListingID:    requestData.ListingID,
		RecyclerName: recycler.Name,
		MaterialName: listing.MaterialName, // Now includes material name
		OfferedPrice: requestData.OfferedPrice,
		Status:       "open",
	}

	// Save the Bid
	if err := Db.Create(&bid).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit the bid request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Bid placed successfully",
		"recycler_name": recycler.Name,
		"material_name": listing.MaterialName, // Return material name in response
	})
}