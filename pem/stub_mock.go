package main

import (
	"fmt"

	shim "github.com/tjfoc/tjfoc/core/chaincode/shim"
	pb "github.com/tjfoc/tjfoc/protos/chaincode"
)

var _ shim.ChaincodeStubInterface = &StubMocker{}

type StoreMock map[string][]byte

type StubMocker struct {
	Method string
	Args   []string
	store  StoreMock
}

func NewStubMocker(store StoreMock, method string, args ...string) *StubMocker {
	mocker := &StubMocker{
		Method: method,
		Args:   args,
		store:  store,
	}
	return mocker
}

func (sm *StubMocker) GetArgs() [][]byte {
	ret := [][]byte{[]byte(sm.Method)}
	for _, arg := range sm.Args {
		ret = append(ret, []byte(arg))
	}
	return ret
}

func (sm *StubMocker) GetStringArgs() []string { return sm.Args }

func (sm *StubMocker) GetFunctionAndParameters() (string, []string) { return sm.Method, sm.Args }

// If the key does not exist in the state database, (nil, nil) is returned.
func (sm *StubMocker) GetState(key string) ([]byte, error) {
	if v, has := sm.store[key]; has {
		return v, nil
	}
	return nil, fmt.Errorf("Not Found")
}
func (sm *StubMocker) GetStaten(keyn []string) (map[string]string, error) {
	return nil, fmt.Errorf("Not implemented")
}

// 存储key-value
func (sm *StubMocker) PutState(key string, value []byte) error {
	sm.store[key] = value
	return nil
}
func (sm *StubMocker) DelState(key string) error {
	sm.DelState(key)
	return fmt.Errorf("Not Found")
}
func (sm *StubMocker) DelStaten(key []string) error {
	sm.DelStaten(key)
	return fmt.Errorf("Not Found")
}
func (sm *StubMocker) GetStateByPrefix(key string) (map[string]string, error) {
	v, err := sm.GetStateByPrefix(key)
	if err == nil {
		return v, nil
	}
	return nil, fmt.Errorf("Not Found")
}

//合约调用合约
func (sm *StubMocker) InvokeChaincode(chaincodeName string, chaincodeVersion string, args [][]byte) pb.Response {
	return pb.Response{}
}
