package handler

import (
	"karthavya/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func NewBid(c *gin.Context) {
	bid := model.Bids{}

	err := c.BindJSON(&bid)
	if err != nil {
		c.JSON(400, gin.H{"message": err.Error()})
		return
	}

	if err := Db.Create(&bid).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit the bid request"})
		return
	}

	c.JSON(200, gin.H{"message": "Success"})
}
