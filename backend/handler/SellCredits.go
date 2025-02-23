package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func MakeCreditsAvailableToSell(c *gin.Context) {
	var credit model.Credits

	if err := c.BindJSON(&credit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// Get user ID from session
	id, _ := GetUserIDFromSession(c)
	credit.UserID = id

	var user model.User
	if err := Db.First(&user, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "User not found"})
		return
	}

	// Check if user has enough credits to sell
	if credit.AvailableToSell > user.Credit {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Not enough credits available"})
		return
	}

	var existingCredit model.Credits
	result := Db.First(&existingCredit, "user_id = ?", id)

	if result.Error != nil {
		// No existing record, create a new entry
		if err := Db.Create(&credit).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create credits entry"})
			return
		}
	} else {
		// Record exists, update it
		if err := Db.Model(&existingCredit).
			Update("available_to_sell", credit.AvailableToSell).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update credits"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Credits updated successfully", "credits": credit})
}
