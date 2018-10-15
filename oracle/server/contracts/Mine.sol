pragma solidity ^0.4.24;

contract MineFactory {
    address[] public deployedMineContracts;

    function createMineContract() public {
        address newMineContract = new Mine();
        deployedMineContracts.push(newMineContract);
    }

    function getDeployedMineContracts()
    public
    view
    returns(address[])
    {
        return deployedMineContracts;
    }
}


contract Mine {

    address public miner = address(0);
    // address[100] public dataOwners;
    mapping(address => bool) public dataOwners;
    uint dataOwnersCounter = 0;
    mapping(uint => address) public dOwnAddresses; // used for looping through addresses
    bool minerAvailable;
    bool dataMined = false;

    constructor () public {
    }

    modifier dataOwnerOnly(address owner) {
        require(dataOwners[owner] == true, "Only dataOwners are allowed to invoke this function");
        _;
    }

    modifier minerOnly() {
        require(msg.sender == miner, "Only Miners are allowed to invoke this function");
        _;
    }

    modifier dataOwnersExists() {
        require(!dataOwners[msg.sender], "Already registered as  a dataOwner");
        _;
    }


    function addMiner(address minerAddress)
        public
        dataOwnersExists
        returns (address)
    {
        require(!minerAvailable && msg.sender != address(0), "Miner already exist's in this contract create a new one.");

        miner = minerAddress;
        minerAvailable = true;

        return miner;
    }

    function allowMine()
        public
        dataOwnersExists
        returns (bool)
    {
        require(msg.sender != miner, "Miners cannot be dataOwners");

        dataOwners[msg.sender] = true;
        dOwnAddresses[dataOwnersCounter] = msg.sender;
        dataOwnersCounter++;

        return true;
    }

    function startMine()
        public
        payable
        minerOnly
        returns (bool)
    {
        // Require at least .01 ether to mine users data.
        require(msg.value > .01 ether, "You require at least 0.01 ether to mine.");
        // Require data owners before mining begins
        require(dataOwnersCounter >= 2, "You require at least 2 data owners in the contract");

        dataMined = true;

        return true;
    }

    function payDataOwners()
        public
        dataOwnerOnly(msg.sender)
        returns (bool)
    {
        require(dataMined, "Data has already been mined.");
        uint totalAmount = address(this).balance;

        for (uint i = 0; i < dataOwnersCounter; i ++) {
            dOwnAddresses[i].transfer(totalAmount/(dataOwnersCounter));
            dataOwners[dOwnAddresses[i]] = false;
            dOwnAddresses[i] = address(0);
        }
        // reset minee pool to make sure they are no longer in the array
        dataOwnersCounter = 0;
        // Set dataNotMined to false so that currency cannot be sent twice.
        dataMined = false;
        miner = address(0);
        minerAvailable = false;

        return true;
    }

    function getBal() public view returns (uint) {
        return address(this).balance;
    }

    function reset() public returns (bool) {
        for (uint i = 0; i < dataOwnersCounter; i++) {
            dataOwners[dOwnAddresses[i]] = false;
            dOwnAddresses[i] = address(0);
        }

        // Return all the currency to miner. Not the best way but will fix
        miner.transfer(address(this).balance);

        dataOwnersCounter = 0;
        dataMined = false;
        miner = address(0);
        minerAvailable = false;

        return true;
    }

    function () public payable {}

}
