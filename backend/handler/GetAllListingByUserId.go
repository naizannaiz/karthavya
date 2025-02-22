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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Fetch all listings uploaded by the user
	var listings []model.Listing
	if err := Db.Where("user_id = ?", userId).Find(&listings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve listings"})
		return
	}

	// Fetch the highest bid for each listing
	for i, listing := range listings {
		var topBid int
		err := Db.Table("bids").
			Select("COALESCE(MAX(offered_price), 0)").
			Where("listing_id = ?", listing.ID).
			Scan(&topBid).Error

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch top bid"})
			return
		}

		// Assign the top bid to the listing
		listings[i].TopBid = topBid
	}

	// Return the listings with top bid data
	c.JSON(http.StatusOK, gin.H{"listings": listings})
}
