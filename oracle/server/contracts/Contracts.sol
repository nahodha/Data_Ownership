pragma solidity ^0.4.24;

contract Mine {

    address public miner;
    address[100] public minee;
    uint counter = 0;

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
        minee[counter] = msg.sender;
        counter++;
    }

    function mined() public mineesOnly {

        uint arrayLength = minee.length;

        for (uint i = 0; i < arrayLength; i ++) {
            minee[i].transfer(this.balance/arrayLength);
        }
        // reset minee pool to make sure they are no longer in the array
        counter = 0;
    }

    // function getMinees() public view returns (address[]) {
    //     return minee;
    // }

}

contract Sell {
    address public buyer;
    address public seller;
    uint amount;

    modifier buyerOnly() {
        require(msg.sender == buyer, "Only buyers allowed to invoke this method");
        _;
    }

    modifier sellerOnly() {
        require(msg.sender == seller, "Only sellers are allowed to invoke this method");
        _;
    }

    function setSeller(address _buyer) public {
        seller = msg.sender;
        buyer = _buyer;
    }

    function buy() public payable buyerOnly{
        require(msg.value > 0.0005 ether, "You need at least 0.0005 ether to invoke this function");
        seller.transfer(this.balance);
    }
}
