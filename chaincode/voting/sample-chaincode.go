package main

import (
    "fmt"
    "bytes"
    "encoding/json"
    "strconv"

    "github.com/hyperledger/fabric/core/chaincode/shim"
    "github.com/hyperledger/fabric/protos/peer"
)

type VotingChain struct {
}

type Vote struct {
  CandidateID string `json:candidateid`
  PartyID string `json:partyid`
}

func (t *VotingChain) Init(APIstub shim.ChaincodeStubInterface) peer.Response {
    return shim.Success(nil)
}

func (t *VotingChain) Invoke(APIstub shim.ChaincodeStubInterface) peer.Response {
  	function, args := APIstub.GetFunctionAndParameters()

    // Calls the appropriate functions
  	if function == "checkVotes" {
  		return t.checkVotes(APIstub)
  	} else if function == "initLedger" {
  		return t.initLedger(APIstub)
  	} else if function == "castVote" {
  		return t.castVote(APIstub, args)
  	}


  	return shim.Error("Function called does not exist.")
}

func (s *VotingChain) initLedger(APIstub shim.ChaincodeStubInterface) peer.Response {
		 fmt.Println("Initialized Ledger")
     votes := []Vote{
   		Vote{CandidateID: "1", PartyID: "1"},
   		Vote{CandidateID: "2", PartyID: "2"},
   	}

   	i := 0
   	for i < len(votes) {
   		voteBytes, _ := json.Marshal(votes[i])
   		APIstub.PutState("02194" + strconv.Itoa(i+1), voteBytes)
   		i = i + 1
   	}
	   return shim.Success(nil)
}

func (t *VotingChain) checkVotes(APIstub shim.ChaincodeStubInterface) peer.Response {
  // Check up to 10,000 votes
	start := "0"
	end := "9999"

  // Get up to 10,000 votes
	resultsIterator, err := APIstub.GetStateByRange(start, end)

  // Handle errors and close iterator
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// Use a variable buffer to hold results
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}

		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}

	buffer.WriteString("]")

	fmt.Printf("- checkVotes:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *VotingChain) castVote(APIstub shim.ChaincodeStubInterface, args []string) peer.Response {
  // Checking for correct argument length
  if len(args) != 3 {
    return shim.Error("Incorrect number of arguments. Expecting 3")
  }

  // Constructing Vote object from arguments
  var vote = Vote{CandidateID: args[1], PartyID: args[2]}

  // Converting JSON to chain-readable bytes and appending it to the blockchain
  voteBytes, _ := json.Marshal(vote)
	err := APIstub.PutState("324534", voteBytes)

  // Check for errors
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record vote: %s", args[0]))
	}

  // Return success message
	return shim.Success(nil)
}

// Starts the chaincode during Instantiate call
func main() {
    err := shim.Start(new(VotingChain))

    if err != nil {
        fmt.Println("Could not start VotingChain")
    } else {
        fmt.Println("VotingChain successfully started")
    }
}
