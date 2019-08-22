pragma solidity >=0.4.20;

contract HelloSKALE {
    /* Define variable greeting of the type string */
    string greeting;

    /* This runs when the contract is executed */
    constructor() public {
        greeting = "Hello SKALE";
    }

    /* Main function */
    function sayHello() public view returns (string memory) {
        return greeting;
    }
}