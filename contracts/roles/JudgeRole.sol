pragma solidity >=0.5.11;

/// Import the library 'Roles'
import '../../node_modules/openzeppelin-solidity/contracts/access/Roles.sol';

/// Define a contract `JudgeRole` to manage this role — add, remove, check
contract JudgeRole {
    using Roles for Roles.Role;

    /// Define 2 events, one for Adding, and other for Removing
    event JudgeAdded(address indexed account);
    event JudgeRemoved(address indexed account);

    /// Define a struct `judges` by inheriting from `Roles` library the struct Role
    Roles.Role private judges;
    address[] public judgesList;
    mapping(address => uint256) private judgeIndex;

    /// Define a modifier that checks if `msg.sender` has the role
    modifier onlyJudge() {
        require(isJudge(msg.sender), "The `msg.sender` is not a Judge.");
        _;
    }

    /// Define a modifier that checks if `msg.sender` does not have the role
    modifier isNotJudge() {
        require(!isJudge(msg.sender), "The `msg.sender` is a Judge.");
        _;
    }

    /// Define a function `isJudge` to check this role
    function isJudge(address account)
        public
        view
        returns (bool)
    {
        return judges.has(account);
    }

    /// Define a function `renounceJudge` to renounce this role
    function renounceJudge()
        public
    {
        _removeJudge(msg.sender);
    }

    /// Define an internal function `_addJudge` to add this role
    function _addJudge(address account)
        internal
    {
        judges.add(account);
        judgeIndex[account] = judgesList.length;
        judgesList.push(account);
        emit JudgeAdded(account);
    }

    /// Define an internal function `_removeJudge` to remove this role
    function _removeJudge(address account)
        internal
    {
        judges.remove(account);
        delete judgesList[judgeIndex[account]];
        emit JudgeRemoved(account);
    }

    /// Define an public function to get complete array judgesList
    function getJudgesList()public view returns(address[] memory){
        return judgesList;
    }
}