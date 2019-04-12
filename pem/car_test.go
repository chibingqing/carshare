package main

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

var storeMocker = make(StoreMock, 0)

func TestCreate(t *testing.T) {
	// 合约方法处理器

	var req = `
	{
		"operatorNum":"666",
	"operatorName": "中汽",
	"carNum": "666", 
	"plateNum":"苏E6666",
	"carModel": "suv", 
	"seating":"5",
	"capacity": "3000", 
	"remark":"11",
	"billingRulesDesc":"5",
	"recordTime":""
	}
	`

	chaincode := newChaincodes()
	fmt.Printf("----创建账户tj---\n")
	mocker := NewStubMocker(storeMocker, "addAccount", req, "")
	resp := chaincode.Invoke(mocker)
	fmt.Printf("%s", resp)
	assert.Equal(t, int32(200), resp.Status)
	fmt.Printf("----创建成功---\n")
	v, err := mocker.GetState("666_car_666")
	assert.Equal(t, nil, err)
	fmt.Println("帐号金额为:")
	fmt.Println(string(v))
	TestCreate1(t)
}
func TestCreate1(t *testing.T) {
	// 合约方法处理器

	var req = `666`

	chaincode := newChaincodes()

	mocker := NewStubMocker(storeMocker, "carQueryByPrefix", req, "")
	resp := chaincode.Invoke(mocker)
	//assert.Equal(t, int32(200), resp.Status)
	fmt.Printf("%s", resp)
	// v, err := mocker.GetState("tj")
	// assert.Equal(t, nil, err)
	// fmt.Println("帐号金额为:")
	// fmt.Println(string(v))
}
