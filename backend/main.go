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
	r.GET("/recycler/listing/:id/topbid",handler.GetTopBid)

	//corporate can place bids on the items on auction!!
	r.POST("/corporate/newbid",handler.NewBid)
	r.GET("/corporate/allBids",handler.GetAllBidsByUserId) //@gets all bids placed by the corporate


	/*
	-----Public routes-----
	*/
	//coporate can see all the listing from this
	r.GET("/listing",handler.GetAllListing)
	// Find bids for the given listing_id 
	r.GET("/listing/:id/bids",handler.GetBids)

	r.GET("/listing/:id",handler.GetListing)

	r.GET("/user/:id",handler.GetUser)
	r.GET("/auth/user",handler.GetUserAuth)
	r.Run(":6969")
}
