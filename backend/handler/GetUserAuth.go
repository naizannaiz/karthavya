package handler

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUserAuth(c *gin.Context) {
	// Get user ID from session
	userID, err := GetUserIDFromSession(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Get user role from database
	role, err := GetUserRoleFromDB(Db, userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Return authenticated user details
	c.JSON(http.StatusOK, gin.H{
		"role": role,
	})

}

func GetUserRoleFromDB(db *gorm.DB, userID string) (string, error) {
	var role string

	// Query using GORM
	err := db.Table("users").Select("role").Where("id = ?", userID).Scan(&role).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return "", fmt.Errorf("User not found")
		}
		return "", err
	}

	return role, nil

}
