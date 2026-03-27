// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract FortuneCookie {
    struct Fortune {
        uint8 rarity; // 0 common, 1 rare, 2 legendary
        uint16 messageId;
        uint64 openedAt;
        uint64 totalOpenedAtOpen; // snapshot so history items are self-describing
    }

    event CookieOpened(address indexed user, uint8 rarity, uint16 messageId, uint64 openedAt, uint64 totalOpened);

    address public owner;
    address public pendingOwner;
    uint256 public priceWei;
    uint16 public immutable messageCount;

    mapping(address => Fortune[]) private _history;
    mapping(address => uint64) public openedCount;

    error NotOwner();
    error PendingOwnerOnly();
    error PausedState();
    error InsufficientValue(uint256 required, uint256 provided);
    error InvalidMessageCount();
    error Reentrancy();

    constructor(uint256 _priceWei, uint16 _messageCount) {
        if (_messageCount == 0) revert InvalidMessageCount();
        owner = msg.sender;
        priceWei = _priceWei;
        messageCount = _messageCount;
    }

    uint256 private _status = 1; // nonReentrancy guard: 1 = not entered, 2 = entered

    event OwnershipTransferInitiated(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Paused(bool paused);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert PausedState();
        _;
    }

    modifier nonReentrant() {
        if (_status == 2) revert Reentrancy();
        _status = 2;
        _;
        _status = 1;
    }

    bool public paused;

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "ZERO_OWNER");
        pendingOwner = newOwner;
        emit OwnershipTransferInitiated(owner, newOwner);
    }

    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert PendingOwnerOnly();
        address previous = owner;
        owner = pendingOwner;
        pendingOwner = address(0);
        emit OwnershipTransferred(previous, owner);
    }

    function setPrice(uint256 _priceWei) external onlyOwner {
        priceWei = _priceWei;
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(true);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Paused(false);
    }

    function withdraw(address payable to) external onlyOwner nonReentrant {
        (bool ok, ) = to.call{value: address(this).balance}("");
        require(ok, "WITHDRAW_FAILED");
    }

    function openCookie() external payable nonReentrant whenNotPaused {
        uint256 required = priceWei;
        if (msg.value < required) revert InsufficientValue(required, msg.value);

        uint64 newCount = openedCount[msg.sender] + 1;
        openedCount[msg.sender] = newCount;

        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    block.number,
                    msg.sender,
                    newCount,
                    address(this)
                )
            )
        );

        uint16 messageId = uint16(seed % uint256(messageCount));
        uint256 roll = (seed / 100) % 100; // 0..99
        uint8 rarity = roll < 70 ? 0 : (roll < 95 ? 1 : 2);

        Fortune memory f = Fortune({
            rarity: rarity,
            messageId: messageId,
            openedAt: uint64(block.timestamp),
            totalOpenedAtOpen: newCount
        });

        _history[msg.sender].push(f);
        emit CookieOpened(msg.sender, rarity, messageId, f.openedAt, newCount);

        // Refund any excess to keep user experience predictable.
        uint256 excess = msg.value - required;
        if (excess > 0) {
            (bool ok, ) = payable(msg.sender).call{value: excess}("");
            require(ok, "REFUND_FAILED");
        }
    }

    function getLastFortune(address user) external view returns (uint8 rarity, uint16 messageId, uint64 openedAt, uint64 totalOpened) {
        uint64 len = openedCount[user];
        if (len == 0) return (0, 0, 0, 0);

        Fortune storage f = _history[user][len - 1];
        return (f.rarity, f.messageId, f.openedAt, len);
    }

    // Pagination-friendly history for UI.
    function getFortunes(
        address user,
        uint256 start,
        uint256 count
    )
        external
        view
        returns (
            uint8[] memory rarity,
            uint16[] memory messageId,
            uint64[] memory openedAt,
            uint64 totalOpened
        )
    {
        uint64 len64 = openedCount[user];
        uint256 len = uint256(len64);
        totalOpened = len64;

        if (start >= len || count == 0) {
            return (new uint8[](0), new uint16[](0), new uint64[](0), totalOpened);
        }

        uint256 end = start + count;
        if (end > len) end = len;

        uint256 actual = end - start;
        rarity = new uint8[](actual);
        messageId = new uint16[](actual);
        openedAt = new uint64[](actual);

        for (uint256 i = 0; i < actual; i++) {
            Fortune storage f = _history[user][start + i];
            rarity[i] = f.rarity;
            messageId[i] = f.messageId;
            openedAt[i] = f.openedAt;
        }
    }
}
