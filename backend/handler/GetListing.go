package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetListing(c *gin.Context) {
	var listing []model.Listing

	// find listing.
	if err := Db.Table("listing").Find(&listing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch listing: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": listing,
	})
}
