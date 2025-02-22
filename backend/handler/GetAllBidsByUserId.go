package handler

import (
	"fmt"
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

// get all the bids placed by the corporate
func GetAllBidsByUserId(c *gin.Context) {
	bids := []model.Bids{}

	userId, err := GetUserIDFromSession(c)
	if err != nil {
		c.JSON(400, gin.H{"message": err.Error()})
		return
	}

	// var listings []model.Listing
	if err := Db.Where("corporate_id = ?", userId).Find(&bids).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve listings"})
		return
	}

	// Return the listings
	fmt.Println("dataoooo:,", bids)
	c.JSON(http.StatusOK, gin.H{"data": bids})
}
