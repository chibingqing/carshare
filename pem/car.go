package main

import (

	//该包是用来使用框架接口的
	"crypto/ecdsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/asn1"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"math/big"

	shim "github.com/tjfoc/tjfoc/core/chaincode/shim" //该包是用来使用通信消息结构的
	pb "github.com/tjfoc/tjfoc/protos/chaincode"
)

const (
	use_ecdsa = true
)

// 合约方法处理器
type handler func(stub shim.ChaincodeStubInterface, args []string) pb.Response

//该结构是自定义结构，表示当前这份合约，该结构必须实现两个方法Init和Invoke
type MyChaincode struct {
	handlerMap map[string]handler
}

func newChaincodes() *MyChaincode {
	cc := &MyChaincode{}
	cc.handlerMap = map[string]handler{
		"addCar":             cc.addCar,
		"carQuery":           cc.carQuery,
		"carUpdate":          cc.carUpdate,
		"addChargingPile":    cc.addChargingPile,
		"chargingPileUpdate": cc.chargingPileUpdate,
		"addAccount":         cc.addAccount,
		"updateAccount":      cc.updateAccount,
		"queryAccount":       cc.queryAccount,
		"orderStart":         cc.orderStart,
		"del":                cc.del,
		"orderEnd":           cc.orderEnd,
	}
	return cc
}

type CarData struct {
	CompNum             string
	CompName            string
	CarNum              string //车辆唯一识别号
	PlateNum            string //车牌号
	CarModel            string //车型
	Seating             string //座位数
	Capacity            string //电池容量
	Quantity            string //可用电量
	ExpectedMileage     string //预计可行驶里程
	BillingRulesDesc    string //计费规则描述，每分钟租车费用
	ParkingchargingPile string //当前停车的充电桩
	StateMark           string //状态标记  0未使用1可使用2正在使用3维护
	RecordTime          string //上链时间
}

type ChargingPileData struct {
	CompName  string
	CompNum   string
	PilePlace string //充电桩所处位置
	PileNum   string //充电桩编号
	PileDesc  string //充电桩描述
	Position  string //所处位置坐标
	//billingRulesDesc string //计费规则描述
	ParkingNum string //当前停车的车牌
	StateMark  string //状态标记       0空闲，1正在使用,2维护
	RecordTime string //上链时间
}
type AccountData struct {
	Password    string //密码
	CompName    string //平台名字
	CompNum     string //平台ID
	Phone       string //手机号
	Idcard      string //身份证
	Role        string //1company,2user
	FreezeMoney int    //冻结资金
	Balance     int    //平台资金
	RecordTime  string //注册时间
}
type OrderData struct {
	OrderId       string //订单Id
	CarNum        string //车辆id
	Phone         string //用户帐号
	CompNum       string //租车的平台
	StartTime     string //订单开始时间
	EndTime       string //订单结束时间
	StartCharging string //离开的充电桩
	EndCharging   string //订单结束时的充电桩
	Money         int    //订单金额
}
type OrderEndData struct {
	OrderId       string //订单Id
	CarNum        string //车辆id
	Phone         string //用户帐号
	CompNum       string //租车的平台
	StartTime     string //订单开始时间
	EndTime       string //订单结束时间
	StartCharging string //离开的充电桩
	EndCharging   string //订单结束时的充电桩
	Money         int    //订单金额
	CarCompNum    string
	PileCompNum   string
	CarCompMoney  int
	PileCompMoney int
	CompMoney     int
}

func main() {
	mycc := new(MyChaincode)
	err := shim.Start(mycc)
	if err != nil {
		fmt.Printf("Error starting my chaincode : %s", err)
	}
}
func (cc *MyChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (cc *MyChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	if function == "addCar" { //存证
		return cc.addCar(stub, args)
	} else if function == "carQuery" { //根据hash查询存证
		return cc.carQuery(stub, args)
	} else if function == "carUpdate" { //更新车辆
		return cc.carUpdate(stub, args)
	} else if function == "addChargingPile" { //添加充电桩
		return cc.addChargingPile(stub, args)
	} else if function == "addAccount" { //添加账号
		return cc.addAccount(stub, args)
	} else if function == "chargingPileUpdate" { //更新充电充电桩
		return cc.chargingPileUpdate(stub, args)
	} else if function == "orderStart" { //开始订单
		return cc.orderStart(stub, args)
	} else if function == "orderEnd" { //订单结束
		return cc.orderEnd(stub, args)
	} else if function == "updateAccount" { //更新账号信息
		return cc.updateAccount(stub, args)
	}

	return shim.Success(nil)
}

//添加车辆
func (cc *MyChaincode) addCar(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	// 验签
	// if !cc.verifySign([]byte(args[0]), []byte(args[1])) {
	// 	return shim.Error("Invalid signature")
	// }
	var car CarData
	if err := json.Unmarshal([]byte(args[0]), &car); err != nil {
		return shim.Error(err.Error())
	}
	// if car.CompNum == "" {
	// 	return shim.Error("wrong record")
	// }
	Key := "car_" + car.CarNum
	value, _ := stub.GetState(Key)
	if value != nil {
		return shim.Error("has been existed!")
	}
	carResult, _ := json.Marshal(car)
	err := stub.PutState(Key, []byte(carResult))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte(Key))

}

//查询车辆
func (cc *MyChaincode) carQuery(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	value, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(value)
}

//更新车辆信息
func (cc *MyChaincode) carUpdate(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	// 验签
	// if !cc.verifySign([]byte(args[0]), []byte(args[1])) {
	// 	return shim.Error("Invalid signature")
	// }
	var car CarData
	if err := json.Unmarshal([]byte(args[0]), &car); err != nil {
		return shim.Error(err.Error())
	}
	Key := "car_" + car.CarNum
	carResult, _ := json.Marshal(car)
	err := stub.PutState(Key, []byte(carResult))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("Update Success!!"))
}

func (cc *MyChaincode) verifySign(data, sign []byte) bool {

	sign, err := base64.StdEncoding.DecodeString(string(sign))
	if err != nil {
		return false
	}

	return cc.verifySignEcdsa(data, sign)

}

func (cc *MyChaincode) verifySignEcdsa(data, sign []byte) bool {
	var ecdsasign struct {
		R, S *big.Int
	}
	_, err := asn1.Unmarshal(sign, &ecdsasign)
	if err != nil {
		return false
	}

	pub := []byte(Pub_Key)
	block, _ := pem.Decode(pub)
	pubkey, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return false
	}
	ecdsaPub := pubkey.(*ecdsa.PublicKey)

	return ecdsa.Verify(ecdsaPub, data, ecdsasign.R, ecdsasign.S)
}

//添加充电桩
func (cc *MyChaincode) addChargingPile(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	var chargingPile ChargingPileData
	if err := json.Unmarshal([]byte(args[0]), &chargingPile); err != nil {
		return shim.Error(err.Error())
	}
	// 验签
	// if !cc.verifySign([]byte(args[0]), []byte(args[1])) {
	// 	return shim.Error("Invalid signature")
	// }
	Key := "cp_" + chargingPile.PileNum
	value, _ := stub.GetState(Key)
	if value != nil {
		return shim.Error(Key)
	}
	chargingPileResult, _ := json.Marshal(chargingPile)
	err := stub.PutState(Key, []byte(chargingPileResult))
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("Add Success!!!"))
}

//更新充电桩信息
func (cc *MyChaincode) chargingPileUpdate(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	// 验签
	// if !cc.verifySign([]byte(args[0]), []byte(args[1])) {
	// 	return shim.Error("Invalid signature")
	// }
	var chargingPile ChargingPileData
	if err := json.Unmarshal([]byte(args[0]), &chargingPile); err != nil {
		return shim.Error(err.Error())
	}
	Key := "cp_" + chargingPile.PileNum

	chargingPileResult, _ := json.Marshal(chargingPile)
	err := stub.PutState(Key, []byte(chargingPileResult))
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("Update Success!!"))
}

//添加帐户
func (cc *MyChaincode) addAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	// 验签
	// if !cc.verifySign([]byte(args[0]), []byte(args[1])) {
	// 	return shim.Error("Invalid signature")
	// }
	var account AccountData
	if err := json.Unmarshal([]byte(args[0]), &account); err != nil {
		return shim.Error(err.Error())
	}

	Key := "ac_" + getSha256Code(account.Idcard)
	value, _ := stub.GetState(Key)
	if value != nil {
		return shim.Error("has been existed!")
	}
	accountResult, _ := json.Marshal(account)
	err := stub.PutState(Key, []byte(accountResult))

	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("Add Success!!"))
}

//更新用户帐号
func (cc *MyChaincode) updateAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	// 验签
	// if !cc.verifySign([]byte(args[0]), []byte(args[1])) {
	// 	return shim.Error("Invalid signature")
	// }
	var account AccountData
	if err := json.Unmarshal([]byte(args[0]), &account); err != nil {
		return shim.Error(err.Error())
	}
	Key := "ac_" + getSha256Code(account.Idcard)
	value, _ := stub.GetState(Key)
	var accountData AccountData
	if err := json.Unmarshal([]byte(value), &accountData); err != nil {
		return shim.Error(err.Error())
	}
	accountData.FreezeMoney = accountData.FreezeMoney + 5000
	accountResult, _ := json.Marshal(accountData)
	err := stub.PutState(Key, []byte(accountResult))
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("Update Success!!"))
}

//查询帐号
func (cc *MyChaincode) queryAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	value, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(value)
}

//新增订单
func (cc *MyChaincode) orderStart(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	// 验签
	// if !cc.verifySign([]byte(args[0]), []byte(args[1])) {
	// 	return shim.Error("Invalid signature")
	// }
	var order OrderData
	if err := json.Unmarshal([]byte(args[0]), &order); err != nil {
		return shim.Error(err.Error())
	}
	// if car.CompNum == "" {
	// 	return shim.Error("wrong record")
	// }
	carKey := "car_" + order.CarNum
	carDatas, _ := stub.GetState(carKey)
	if carDatas == nil {
		return shim.Error("no this car!")
	}
	pileKey := "cp_" + order.StartCharging
	pileDatas, _ := stub.GetState(pileKey)
	if pileDatas == nil {
		return shim.Error("no this chargingpile!")
	}
	orderResult, _ := json.Marshal(order)
	Key := "or_" + order.OrderId
	value, _ := stub.GetState(Key)
	if value != nil {
		return shim.Error("has been existed!")
	}
	err := stub.PutState(Key, []byte(orderResult))
	if err != nil {
		return shim.Error(err.Error())
	}
	var car CarData
	if err := json.Unmarshal(carDatas, &car); err != nil {
		return shim.Error(err.Error())
	}
	car.ParkingchargingPile = ""
	car.StateMark = "2"
	carStr, _ := json.Marshal(car)
	err = stub.PutState(carKey, []byte(carStr))
	if err != nil {
		return shim.Error(err.Error())
	}

	var pile ChargingPileData
	if err := json.Unmarshal(pileDatas, &pile); err != nil {
		return shim.Error(err.Error())
	}
	pile.ParkingNum = ""
	pile.StateMark = "1"
	pileStr, _ := json.Marshal(pile)
	err = stub.PutState(pileKey, []byte(pileStr))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("add seccess"))

}

//完成订单
func (cc *MyChaincode) orderEnd(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	// 验签
	// if !cc.verifySign([]byte(args[0]), []byte(args[1])) {
	// 	return shim.Error("Invalid signature")
	// }

	var order OrderEndData
	if err := json.Unmarshal([]byte(args[0]), &order); err != nil {
		return shim.Error(err.Error())
	}

	carKey := "car_" + order.CarNum //获取车辆信息
	carDatas, _ := stub.GetState(carKey)
	if carDatas == nil {
		return shim.Error("no this car!")
	}
	pileKey := "cp_" + order.EndCharging
	pileDatas, _ := stub.GetState(pileKey)
	if pileDatas == nil {
		return shim.Error("no this chargingpile!")
	}
	adminKey := "ac_" + getSha256Code(cc.checkAccount(order.CompNum))
	adminData, _ := stub.GetState(adminKey)
	var admin AccountData

	if err := json.Unmarshal([]byte(adminData), &admin); err != nil {
		return shim.Error(adminKey)
	}

	var compMoney = (int)(order.Money * 5 / 100) //用户登录平台的钱
	admin.Balance = admin.Balance + compMoney
	adminResult, _ := json.Marshal(admin)
	err := stub.PutState(adminKey, []byte(adminResult))

	adminData, _ = stub.GetState(adminKey)
	var admin1 AccountData
	if err := json.Unmarshal([]byte(adminData), &admin1); err != nil {
		return shim.Error(err.Error())
	}
	var carCompMoney = (int)(order.Money * 80 / 100) //车辆的平台的钱
	admin1.Balance = admin1.Balance + carCompMoney
	adminResult1, _ := json.Marshal(admin1)
	err = stub.PutState(adminKey, []byte(adminResult1))
	var admin2 AccountData
	adminKey = "ac_" + getSha256Code(cc.checkAccount(order.PileCompNum))
	adminData, _ = stub.GetState(adminKey)

	if err := json.Unmarshal([]byte(adminData), &admin2); err != nil {
		return shim.Error(err.Error())
	}
	var pileCompMoney = (int)(order.Money - compMoney - carCompMoney)
	admin2.Balance = admin2.Balance + pileCompMoney //充电桩平台的钱
	adminResult2, _ := json.Marshal(admin2)
	err = stub.PutState(adminKey, []byte(adminResult2))
	Key := "or_" + order.OrderId
	order.CompMoney = compMoney
	order.CarCompMoney = carCompMoney
	order.PileCompMoney = pileCompMoney
	order.CarCompNum = admin1.CompNum
	order.PileCompNum = admin2.CompNum
	orderResult, _ := json.Marshal(order)
	err = stub.PutState(Key, []byte(orderResult))
	if err != nil {
		return shim.Error(err.Error())
	}
	var car CarData
	if err := json.Unmarshal(carDatas, &car); err != nil {
		return shim.Error(err.Error())
	}
	car.ParkingchargingPile = order.EndCharging
	car.StateMark = "1"
	carStr, _ := json.Marshal(car)
	err = stub.PutState(carKey, []byte(carStr))
	if err != nil {
		return shim.Error(err.Error())
	}

	var pile ChargingPileData
	if err := json.Unmarshal(pileDatas, &pile); err != nil {
		return shim.Error(err.Error())
	}
	pile.ParkingNum = order.CarNum
	pile.StateMark = "2"
	pileStr, _ := json.Marshal(pile)
	err = stub.PutState(pileKey, []byte(pileStr))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("add seccess"))

}

//删除
func (cc *MyChaincode) del(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Invalid parameter")
	}
	err := stub.DelState(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("del success!!!"))

}
func (cc *MyChaincode) checkAccount(data string) string {
	if data == "1" {
		return "adminA"
	}
	if data == "2" {
		return "adminB"
	}
	return "adminA"
}
func getSha256Code(s string) string {
	h := sha256.New()
	h.Write([]byte(s))
	return fmt.Sprintf("%x", h.Sum(nil))
}

const (
	Pub_Key = `
	-----BEGIN PUBLIC KEY-----
	MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1D9XwBQpXmyIvCD6pXddIVJERSRg
	EpTW7heKZH0FRGpsi/SUs7mGA5f1AKIC9eEuHHHZPYRYgBVxmddwKhv23Q==
	-----END PUBLIC KEY-----
	`
)
