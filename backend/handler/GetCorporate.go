package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetCorporate fetches a user by ID
func GetUser(c *gin.Context) {
	user := model.User{}
	id := c.Param("id")

	if id == "0" {
		id,_ = GetUserIDFromSession(c)
	}

	// Fetch user from DB
	if err := Db.First(&user, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Return user details
	c.JSON(http.StatusOK, gin.H{"data": user})
}
