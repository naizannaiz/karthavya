package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func BuyCredit(c *gin.Context) {
	// Get credit ID (cid) from URL params
	creditID := c.Param("cid")

	var purchaseRequest struct {
		Quantity int `json:"quantity"`
	}

	// Parse the request body
	if err := c.BindJSON(&purchaseRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	// Get the buyer's user ID from session
	buyerID, _ := GetUserIDFromSession(c)

	// Fetch seller's credit record using `creditID`
	var sellerCredit model.Credits
	if err := Db.First(&sellerCredit, "id = ?", creditID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Credit listing not found"})
		return
	}

	// Fetch seller's user record
	var seller model.User
	if err := Db.First(&seller, "id = ?", sellerCredit.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Seller not found"})
		return
	}

	// Fetch buyer's user record
	var buyer model.User
	if err := Db.First(&buyer, "id = ?", buyerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Buyer not found"})
		return
	}

	// Check if the seller has enough credits available
	if sellerCredit.AvailableToSell < purchaseRequest.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Not enough credits available"})
		return
	}

	// Deduct sold credits from seller
	sellerCredit.AvailableToSell -= purchaseRequest.Quantity
	seller.Credit -= purchaseRequest.Quantity // Update seller's credit in `users` table

	// Update the buyer's credits
	buyer.Credit += purchaseRequest.Quantity

	// Save updates to seller and buyer in `users` table
	if err := Db.Save(&seller).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update seller's credits in users table"})
		return
	}

	if err := Db.Save(&buyer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update buyer's credits in users table"})
		return
	}

	// If seller's credits are now 0, delete the row from the `credits` table
	if sellerCredit.AvailableToSell == 0 {
		if err := Db.Delete(&sellerCredit).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to remove empty credit listing"})
			return
		}
	} else {
		// Otherwise, just update the seller's credit entry
		if err := Db.Save(&sellerCredit).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update seller's credits"})
			return
		}
	}

	// Respond with success
	c.JSON(http.StatusOK, gin.H{
		"message":   "Purchase successful",
		"buyer":     buyer,
		"seller":    seller,
		"purchased": purchaseRequest.Quantity,
	})
}
