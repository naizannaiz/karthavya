package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllListing(c *gin.Context) {
	var listing []model.Listing

	// find listing.
	if err := Db.Table("listings").Find(&listing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch listing: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": listing,
	})
}

func GetListing(c *gin.Context) {
	id := c.Param("id")
	var listing model.Listing

	if err := Db.Table("listings").Where("id = ?", id).First(&listing).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Listing not found: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": listing,
	})
}