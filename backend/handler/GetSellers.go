package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetSellers(c *gin.Context) {
	var sellers []model.Credits

	// Fetch users who have available credits to sell
	if err := Db.Where("available_to_sell > ?", 0).Find(&sellers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch sellers"})
		return
	}

	// Fetch and map usernames separately
	for i := range sellers {
		var user model.User
		if err := Db.Where("id = ?", sellers[i].UserID).First(&user).Error; err == nil {
			sellers[i].RecyclerUsername = user.Name // Assuming you add this field in model.Credits
		}
	}

	c.JSON(http.StatusOK, gin.H{"data": sellers})
}
