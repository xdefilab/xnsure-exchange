pragma solidity >=0.5.0;

interface IOptionToken {
    function expirationBlockNumber() external view returns (uint256);
}