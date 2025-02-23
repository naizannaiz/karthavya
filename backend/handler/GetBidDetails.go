package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetBidDetails(c *gin.Context) {
	var bid model.Bids

	id := c.Param("id")

	// Fetch bid details from the database
	if err := Db.Where("id = ?", id).First(&bid).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Bid not found"})
		return
	}

	// Return the bid details
	c.JSON(http.StatusOK, gin.H{
		"bid_id":        bid.ID,
		"listing_id":    bid.ListingID,
		"corporate_id":  bid.CorporateID,
		"offered_price": bid.OfferedPrice,
		"status":        bid.Status,
		"recycler_name": bid.RecyclerName,
		"material_name": bid.MaterialName,
	})
}
