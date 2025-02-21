package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetAllListingByUserId fetches all listings uploaded by the user from the session token
func GetAllListingByUserId(c *gin.Context) {
	// Retrieve session token from the cookie
	userId, err := GetUserIDFromSession(c)
	if err != nil {
		c.JSON(400, gin.H{"message": err.Error()})
	}

	// Fetch all listings uploaded by the user
	var listings []model.Listing
	if err := Db.Where("user_id = ?", userId).Find(&listings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve listings"})
		return
	}

	// Return the listings
	c.JSON(http.StatusOK, listings)
}
