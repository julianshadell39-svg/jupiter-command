// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint256 public current;

    event Incremented(uint256 newValue);

    function increment() external {
        current += 1;
        emit Incremented(current);
    }
}
