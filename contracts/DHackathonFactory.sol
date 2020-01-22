pragma solidity >=0.5.11;

import './DHackathon.sol';
import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';
import '../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';

/**
    Necessary Features:
    - Factory design
    - Circuit breaker (isOperational) + Speed bump (rate limiting)
    - Deployable to with Hyperledger Besu private network
    - Pay Factory at Hackathon Completion


    Nice-to-have:
    - Complex voting mechanism based on criterias and point summation
    - Sponsor entities that provide the funding
    - Participation fee from hackers
    - Extend to any kind of competition

    - Make participants open or approved
    - Require at least 1 judge at start
    - add price here verbally, make it surpass after funding
 */

contract DHackathonFactory is Ownable {
    using SafeMath for uint256;

    uint256 public counter;
    bool public operational = true;

    struct DHackathonBirthCertificate {
      uint256 DHID;
      address admin;
      uint256 createdOn;
      DHackathon contractAddress;
    }
    mapping (uint256 => DHackathonBirthCertificate) public DHackathonRegistry;

    event DHackathonCreated(uint256 DHID, string name, address admin, uint256 prize, DHackathon contractAddress);
    event FundsWithdrawn(uint256 funds);

    modifier isOperational() {
        require(operational == true, "This contract has been stopped by the owner.");
        _;
    }

    function createDHackathon(string memory _name, uint256 _prize)
        public
        payable
        isOperational()
        returns (DHackathon newDH)
    {
        require(msg.value >= 0.1 ether, "DHackathon creation price of 0.1 ether not met.");
        counter += 1;
        newDH = new DHackathon(counter, _name, msg.sender, _prize, block.timestamp);
        DHackathonRegistry[counter] = DHackathonBirthCertificate(counter, msg.sender, block.timestamp, newDH);
        emit DHackathonCreated(counter, _name, msg.sender, _prize, newDH);
    }

    function withdrawFunds()
        public
        onlyOwner()
    {
        require(address(this).balance > 0, "No funds to withdraw");
        uint256 funds = address(this).balance;
        msg.sender.transfer(funds);
        emit FundsWithdrawn(funds);
    }

    function shutdown()
        public
        onlyOwner()
    {
        operational = !operational;
    }
}
