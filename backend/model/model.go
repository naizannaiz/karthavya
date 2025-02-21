package model

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID       string `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Name     string `json:"username" gorm:"unique;not null"`
	Email    string `json:"email" gorm:"unique;not null"`
	Password string `json:"password" gorm:"not null"`
	Role     string `json:"points"`
}
type Session struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Token     string    `json:"token" gorm:"uniqueIndex;not null"`
	UserID    string    `json:"user_id" gorm:"not null"`
	ExpiresAt time.Time `json:"expires_at" gorm:"not null"`
}

// for recycler to add items for auction
type Listing struct {
	ID               string    `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	UserID           string    `json:"uid" gorm:"user_id"`
	RecyclereName    string    `json:"recycler_name"`
	MaterialName     string    `json:"material"`
	Quantity         int       `json:"quantity"`
	BasePrice        int       `json:"base_price"`
	AuctionStartDate time.Time `json:"auction_start_date"`
	Status           string    `json:"status"`
}

// the corporate can place bids on the listing
type Bids struct {
	ID           string `json:"id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	CorporateID  string `json:"corporate_id" gorm:"user_id"`
	ListingID    string `json:"listing_id" gorm:"type:uuid;not null;constraint:OnDelete:CASCADE,OnUpdate:CASCADE;"`
	RecyclerName string `json:"supplier_name"`
	MaterialName string `json:"Material_name"`
	OfferedPrice int    `json:"offered_price"` //bid price for listing
	Status       string `json:"Status"`        // 1)Upcoming 2)Ongoing
}

func Migrate(db *gorm.DB) {
	fmt.Println("generating sql")
	db.AutoMigrate(&User{}, &Session{}, &Listing{}, &Bids{})
}
