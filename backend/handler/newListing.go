package handler

import (
	"fmt"
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Carbon credit calculation based on material type
func CalculateCarbonCredits(materialType string, quantity int) int {
	creditsPerKg := map[string]int{
		"plastic":  1,
		"paper":    1,
		"glass":    1,
		"aluminum": 10,
		"e-waste":  5,
		"lead":     2,
		"nickel":   2,
		"platinum": 2,
		"steel":    3,
		"copper":   1,
		"silver":   1,
		"gold":     2,
	}

	if rate, exists := creditsPerKg[materialType]; exists {
		return (rate * quantity)/2
	}
	return 0
}

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

	// Calculate carbon credits
	credits := CalculateCarbonCredits(newListing.MaterialName, newListing.Quantity)

	// Save listing to database
	if err := Db.Create(&newListing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create listing"})
		return
	}

	// Update user's credit balance
	// Update user's credit balance
	if err := Db.Model(&model.User{}).Where("id = ?", userID).Update("credit", gorm.Expr("credit + ?", credits)).Error; err != nil {
		fmt.Println("Error updating user credit:", err)
	}
	// fmt.Println("user data:", user)

	// Return success response
	c.JSON(http.StatusCreated, gin.H{
		"message":       "Listing created successfully",
		"listing":       newListing,
		"creditsEarned": credits,
	})
}
