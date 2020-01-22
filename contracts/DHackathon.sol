pragma solidity >=0.5.11;

import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';
import './roles/JudgeRole.sol';
import './roles/ParticipantRole.sol';
import './states/StateTracker.sol';

/// @author Alan Arvelo
contract DHackathon is JudgeRole, ParticipantRole, StateTracker {
    using SafeMath for uint256;
    using SafeMath for uint128;

    uint256 public DHID;
    string public name;
    address public admin;
    uint256 public prize;
    uint256 public createdOn;

    /// Tracks the participant's project location, votes, and prize retrieval
    struct Project {
        string url;
        uint128 votes;
        bool withdrewPrize;
    }
    mapping (address => Project) public projects;

    /// It can occur that not all Judges submit a vote in the InVoting period
    uint128 private numJudgesWhoVoted;
    /// Prevent double voting
    mapping (address => bool) public judgeVoted;
    // Store the right portion of the prize
    uint256 private prizePortion;

    event FundingReceived(address sponsor, uint256 amount);
    event ProjectSubmitted(address participant, string url);
    event VoteSubmitted(address judge, address elected);
    event PrizeWithdrawn(address participant, uint256 amount);

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "The `msg.sender` is not the admin");
        _;
    }

    constructor (uint256 _DHID, string memory _name, address _admin, uint256 _prize, uint256 _createdOn) public {
        DHID = _DHID;
        name = _name;
        admin = _admin;
        prize = _prize;
        createdOn = _createdOn;

        state = DHState.InPreparation;
        emit DHInPreparation(DHID, name, prize);
    }

    /**
     * @return true if parameter account is the admin
     */
    function isAdmin(address _account)
        public
        view
        returns(bool)
    {
        return _account == admin;
    }

    /**
     * @notice Anyone can contribute funds to the prize
     * @notice Only during InPreparation state.
     * @dev TO-DO: create a Sponsor Role and add related functionality
     */
    function submitFunds()
        public
        payable
    {
        require(msg.value > 0, "Must send some funds");
        emit FundingReceived(msg.sender, msg.value);
    }

    /**
     * @notice Admin can open the DHackathon
     * @notice Only if enough funds have been received to meet the promised prize
     * @notice Admin can submit funds right before Opening the DHackathon
     * @dev TO-DO: require a min number of participants & judges to be enrolled
     */
    function openDHackathon()
        external
        payable
        onlyAdmin()
    {
        if (msg.value > 0) emit FundingReceived(msg.sender, msg.value);
        require(address(this).balance >= prize, "Funds for prize must be in contract to start DHackathon");
        require(judgesList.length >= 1, "At least 1 judge is required to Open the DHackathon");
        require(participantList.length >= 2, "At least 2 participants are required to Open the DHackathon");
        _openDHackathon(DHID, name, prize);
    }

    /**
     * @notice Admin can set the DHackathon to the InVoting state
     * @notice Projects can no longer be submitted
     */
    function toVotingDHackathon()
        external
        onlyAdmin()
    {
        _toVotingDHackathon(DHID, name, prize);
    }

    /**
     * @notice Admin can close the voting period and Close the DHackathon
     * @notice Votes can no longer be submitted, winners can withdraw their piece of the prize
     */
    function closeDHackathon()
        external
        onlyAdmin()
    {
        require(numJudgesWhoVoted >= 1, "At least 1 vote must have been submitted")
        _closeDHackathon(DHID, name, prize);
        prizePortion = address(this).balance.div(numJudgesWhoVoted);
    }

    /*************************************** Judge ******************************************/

    /**
     * @notice Gives an account the role of Judge
     * @notice Only Admin and only in the Preparation state an account
     * @dev TO-DO: allow for admin-defined max or min number of judges
     * @param _account cannot be a participant or the admin
     */
    function addJudge(address _account)
        public
        onlyAdmin()
        isInPreparation()
    {
        require(!isParticipant(_account), "Proposed judge can't be a Participant");
        require(!isAdmin(_account), "Proposed judge can't be the Admin");
        require(!isJudge(_account), "Proposed judge is already a Judge");
        _addJudge(_account);
    }

    /**
     * @notice Removes the role of Judge from an account
     * @notice Only the Admin, can do it at any state
     * @param _account needs to be a Judge
     */
    function removeJudge(address _account)
        public
        onlyAdmin()
        isNotClosed()
    {
        require(isJudge(_account), "`account` is not a Judge");
        _removeJudge(_account);
    }

    /**
     * @notice Judges can submit their elected winner, prize is divided by number of voting judges, in equal parts
     * @notice An address among the participants. A Judge can only vote once
     * @notice When state is Ended, submissions are no longer accepted
     * @dev TO-DO: add a more sophisticated voting mechanism, with criterias and tiers
     */
    function submitVote(address _electedWinner)
        public
        onlyJudge()
        isInVoting()
    {
        /// Make sure the Judge has not voted, and elects a valid winner
        require(!judgeVoted[msg.sender], "Judge has already voted");
        require(isParticipant(_electedWinner), "The elected winner is not a Participant");
        require(keccak256(bytes(projects[_electedWinner].url)) != keccak256(bytes("")), "Participant did not submit Project");
        judgeVoted[msg.sender] = true;
        /// Give the vote to the participant and increase vote count
        numJudgesWhoVoted += 1;
        projects[_electedWinner].votes += 1;
        emit VoteSubmitted(msg.sender, _electedWinner);
    }

    /*************************************** Participant ******************************************/

    /**
     * @notice Anyone can register itself as Participant
     * @notice Expect Judges and the Admin
     * @dev TO-DO: allow registration to involve being pre-approved or paying a fee
     * @dev TO-DO: allow participants to form teams
     */
    function registerAsParticipant()
        public
        isInPreparation()
    {
        require(!isJudge(msg.sender), "A Judge can't register as a Participant");
        require(!isAdmin(msg.sender), "The Admin can't register as a Participant");
        _addParticipant(msg.sender);
    }

    /**
     * @notice Any Participant can deregister itself
     */
    function deregisterAsParticipant()
        public
        onlyParticipant()
        isNotClosed()
    {
        _removeParticipant(msg.sender);
    }

    /**
     * @notice Participants can submit their projects (likely github url)
     * @notice Submission accepted when state is Open, and before it is Ended
     * @notice Re-submissions also accepted
     * @dev TO-DO: add a more sophisticated project submission mechanism and allow to submit more data
     */
    function submitProject(string memory _url)
        public
        onlyParticipant()
        isOpen()
    {
        projects[msg.sender].url = _url;
        emit ProjectSubmitted(msg.sender, _url);
    }

    /**
     * @notice Each participant who received a vote is entitled to a piece of the prize
     * @notice The prize is divided by the number of proposed winners by the judges
     */
    function withdrawPrize()
        public
        onlyParticipant()
        isClosed()
    {
        /// Check the "winner" has not already withdrawn funds, and is actually a winner
        require(!projects[msg.sender].withdrewPrize, "You already withdrew your funds");
        require(projects[msg.sender].votes > 0, "Your project received 0 votes from the Judges");
        Project storage winner = projects[msg.sender];
        /// Calculate and send his part of the prize
        uint256 amount = winner.votes.mul(prizePortion);
        winner.withdrewPrize = true;
        msg.sender.transfer(amount);
        emit PrizeWithdrawn(msg.sender, amount);
    }

    /**
     * @notice Utility fn thats returns contract balance
     */
    function balance()
        public
        view
        returns (uint256)
    {
        return address(this).balance;
    }

}
