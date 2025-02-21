package handler

import (
	"context"
	"fmt"

	"karthavya/database"
	"karthavya/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var Ctx = context.Background()
var Db *gorm.DB = database.StartPostgres()

func GetUserIDFromSession(c *gin.Context) (string, error) {
	cookie, err := c.Cookie("session_token")
	if err != nil {
		return "", fmt.Errorf("missing session token")
	}
	fmt.Println("Session Token:", cookie)

	// Validate session token
	var session model.Session
	if err := Db.Where("token = ?", cookie).First(&session).Error; err != nil {
		return "", fmt.Errorf("invalid session token")
	}
	fmt.Println("User ID:", session.UserID)

	return session.UserID, nil
}
