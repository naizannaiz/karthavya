package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetBids(c *gin.Context) {
	var bids []model.Bids
	listingID := c.Param("id")

	// Find bids for the given listing_id
	if err := Db.Where("listing_id = ?", listingID).Find(&bids).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch bids: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": bids,
	})
}
