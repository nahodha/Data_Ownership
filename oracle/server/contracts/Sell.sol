pragma solidity ^0.4.24;

contract Sell {
    address public buyer;
    address public seller;

    modifier buyerOnly() {
        require(msg.sender == buyer, "Only buyers allowed to invoke this method");
        _;
    }

    // modifier sellerOnly() {
    //     require(msg.sender == seller, "Only sellers are allowed to invoke this method");
    //     _;
    // }

    function setSeller(address _buyer) public {
        seller = msg.sender;
        buyer = _buyer;
    }

    function buy() public payable buyerOnly{
        require(msg.value > 0.05 ether, "You need at least 0.0005 ether to invoke this function");
        seller.transfer(msg.value);
    }
}
