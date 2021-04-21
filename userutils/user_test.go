package userutils_test

import (
	"testing"

	"github.com/tedyst/spotifyutils/userutils"
)

var valuesGetUser = []struct {
	UserID string
	ID     uint
}{
	{"user1", 1},
	{"user2", 2},
}

func TestGetUser(t *testing.T) {
	for _, tt := range valuesGetUser {
		t.Run(tt.UserID, func(t *testing.T) {
			s := userutils.GetUser(tt.UserID)
			if s.ID != tt.ID {
				t.Errorf("got %d, want %d", s.ID, tt.ID)
			}
		})
	}
}

var valuesGetUserFromCompareCode = []struct {
	ID          uint
	CompareCode string
}{
	{1, "AAAAAA"},
	{2, "BBBBBB"},
}

func TestGetUserFromCompareCode(t *testing.T) {
	for _, tt := range valuesGetUserFromCompareCode {
		t.Run(tt.CompareCode, func(t *testing.T) {
			s := userutils.GetUserFromCompareCode(tt.CompareCode)
			if s.ID != tt.ID {
				t.Errorf("got %d, want %d", s.ID, tt.ID)
			}
		})
	}
}
