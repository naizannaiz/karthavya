package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetTopBid fetches the highest bid for a given listing ID
func GetTopBid(c *gin.Context) {
	listingID := c.Param("id")

	var topBid float64

	err := Db.Table("bids").
		Select("MAX(offered_price)").
		Where("listing_id = ?", listingID).
		Scan(&topBid).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch top bid"})
		return
	}

	// If no bid exists, return 0
	c.JSON(http.StatusOK, gin.H{
		"listing_id": listingID,
		"top_bid":    topBid,
	})
}
