pragma solidity >=0.5.11;

/// Import the library 'Roles'
import '../../node_modules/openzeppelin-solidity/contracts/access/Roles.sol';

/// Define a contract `ParticipantRole` to manage this role — add, remove, check
contract ParticipantRole {
    using Roles for Roles.Role;

    /// Define 2 events, one for Adding, and other for Removing
    event ParticipantAdded(address indexed account);
    event ParticipantRemoved(address indexed account);

    /// Define a struct `participants` by inheriting from `Roles` library the struct Role
    Roles.Role private participants;

    /// Define a modifier that checks if `msg.sender` has the role
    modifier onlyParticipant() {
        require(isParticipant(msg.sender), "The `msg.sender` is not a Participant.");
        _;
    }

    /// Define a function `isParticipant` to check this role
    function isParticipant(address account)
        public
        view
        returns (bool)
    {
        return participants.has(account);
    }

    /// Define an internal function `_addParticipant` to add this role
    function _addParticipant(address account)
        internal
    {
        participants.add(account);
        emit ParticipantAdded(account);
    }

    /// Define an internal function `_removeParticipant` to remove this role
    function _removeParticipant(address account)
        internal
    {
        participants.remove(account);
        emit ParticipantRemoved(account);
    }
}