pragma solidity ^0.4.24;


contract SellFactory {
    address[] public deployedSellContracts;

    function createSellContract() public {
        address newSellContract = new Sell();
        deployedSellContracts.push(newSellContract);
    }

    function getDeployedSellContracts()
    public
    view
    returns(address[])
    {
        return deployedSellContracts;
    }
}


contract Sell {
    address public buyer;
    address public seller;
    bool notBought = false;
    bool noBuyer = true;
    bool noSeller = true;

    constructor () public {
    }

    modifier buyerOnly() {
        require(msg.sender == buyer, "Only buyers can invoke this function.");
        _;
    }

    modifier sellerOnly() {
        require(msg.sender == seller, "Only sellers can invoke this function.");
        _;
    }

    modifier bothParties() {
        require(msg.sender == seller || msg.sender == buyer, "Only buyer or seller can invoke this action.");
        _;
    }

    modifier buyerNotSeller() {
        require(buyer != seller, "buyer cannot be seller.");
        _;
    }

    function addBuyer(address _seller) public returns(bool) {
        require(noBuyer, "buyer already exists");
        require(noSeller, "A seller already exists");
        buyer = msg.sender;
        seller = _seller;
        notBought = true;

        require(buyer != seller, "buyer cannot be seller.");

        noBuyer = false;
        noSeller = false;

        return true;
    }

    function buy()
            public
            payable
            buyerOnly
            buyerNotSeller
            returns (bool)
    {
        require(msg.value > 0.0005 ether, "You require at least 0.0005 ether to call this function.");
        require(notBought, "Cannot sell twice.");

        seller.transfer(address(this).balance);

        // reset buyers and sellers
        cancelTransaction();

        return true;
    }

    function cancelTransaction()
        public
        bothParties
        returns(bool)
    {
        buyer = address(0);
        seller = address(0);
        noBuyer = true;
        noSeller = true;
        notBought = false;

        return true;
    }

    function () public payable {}
}
