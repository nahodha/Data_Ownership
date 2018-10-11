pragma solidity ^0.4.24;

contract Mine {

    address public miner;
    address[] public minee;

    modifier mineesOnly() {
        require(msg.sender != miner, "Only minees are allowed to invoke this function");
        _;
    }

    modifier minerOnly() {
        require(msg.sender == miner, "Only miners are allowed to invoke this function");
        _;
    }

    constructor () public {
        miner = msg.sender;
    }

    function mine() public payable minerOnly {
        // Require at leas .01 ether to mine users data.
        require(msg.value >= .001 ether, "You need at least 0.001 ether to mine!");
    }

    function allowMine() public mineesOnly {
        minee.push(msg.sender);
    }

    function mined() public mineesOnly {

        uint arrayLength = minee.length;

        for (uint i = 0; i < arrayLength; i ++) {
            minee[i].transfer(this.balance/arrayLength);
        }
        // reset minee pool to make sure they are no longer in the array
        minee = new address[](0);
    }

    function getMinees() public view returns (address[]) {
        return minee;
    }

    function() public payable{}

}
