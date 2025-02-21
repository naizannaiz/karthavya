package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Newlisting(c *gin.Context) {
	listing := model.Listing{}

	err := c.BindJSON(&listing)
	if err != nil {
		c.JSON(400, gin.H{"message": err.Error()})
		return
	}

	if err := Db.Create(&listing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit listing"})
		return
	}

	c.JSON(200, gin.H{"message": "Success"})
}
