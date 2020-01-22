pragma solidity >=0.5.11;


/// Define a contract `StateTracker` to manage the stages of the competition
contract StateTracker {

    enum DHState {InPreparation, Open, InVoting, Closed}
    DHState public state;

    event DHInPreparation(uint256 DHID, string name, uint256 estimatedPrize);
    event DHOpen(uint256 DHID, string name, uint256 estimatedPrize);
    event DHInVoting(uint256 DHID, string name, uint256 estimatedPrize);
    event DHClosed(uint256 DHID, string name, uint256 estimatedPrize);

    /// Define a modifier that checks if DHackathon is in the `InPreparation` state
    modifier isInPreparation() {
        require(state == DHState.InPreparation, "DHackathon is not in the Preparation state");
        _;
    }

    /// Define a modifier that checks if DHackathon is in the `Open` state
    modifier isOpen() {
        require(state == DHState.Open, "DHackathon is not in the Open state");
        _;
    }

    /// Define a modifier that checks if DHackathon is in the `InVoting` state
    modifier isInVoting() {
        require(state == DHState.InVoting, "DHackathon is not in the Voting state");
        _;
    }

    /// Define a modifier that checks if DHackathon is in the `Closed` state
    modifier isClosed() {
        require(state == DHState.Closed, "DHackathon is not in the Closed state");
        _;
    }

    /// Define a modifier that checks if DHackathon is not in the `Closed` state
    modifier isNotClosed() {
        require(state != DHState.Closed, "DHackathon is not in the Closed state");
        _;
    }

    /// Define function to open the competition
    function _openDHackathon(uint256 _DHID, string memory _name, uint256 _prize)
        internal
        isInPreparation()
    {
        state = DHState.Open;
        emit DHOpen(_DHID, _name, _prize);
    }

    /// Define function to set the competition to the voting state
    function _toVotingDHackathon(uint256 _DHID, string memory _name, uint256 _prize)
        internal
        isOpen()
    {
        state = DHState.InVoting;
        emit DHInVoting(_DHID, _name, _prize);
    }

    /// Define function to close the competition
    function _closeDHackathon(uint256 _DHID, string memory _name, uint256 _prize)
        internal
        isInVoting()
    {
        state = DHState.Closed;
        emit DHClosed(_DHID, _name, _prize);
    }

}