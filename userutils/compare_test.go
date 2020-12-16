package userutils

import "testing"

func TestCompare(t *testing.T) {
	user1 := GetUser("vq0u2761le51p2idib6f89y78")
	user2 := GetUser("vq0u2761le51p2idib6f89y78")
	compare := user1.Compare(user2)
	if compare.Score < 100 {
		t.Fail()
	}
}
