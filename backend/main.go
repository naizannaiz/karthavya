package main

import (
	"time"


	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"karthavya/handler"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Change this if your frontend URL changes
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// r.GET("/", handler.GetData)

	r.POST("/signup", handler.RegisterUser)

	r.POST("/login", handler.LoginUser)

	//recycler can list new items for auction!!
	r.POST("/recycler/newlisting",handler.Newlisting)
	r.GET("/recycler/listings",handler.GetAllListingByUserId)

	//corporate can place bids on the items on auction!!
	r.POST("/corporate/newbid",handler.NewBid)
	r.GET("/corporate/allBids",handler.GetAllBidsByUserId)


	/*
	-----Public routes-----
	*/
	//coporate can see all the listing from this
	r.GET("/listing",handler.GetListing)
	//corporate can see individual listing 
	r.GET("/listing/:id",handler.GetBids)
	r.Run(":4200")
}
