# SKALE DKG Specification

## Introduction

This specification defines the implementation requirements for SKALE DKG. DKG (distributed key generation) is a protocol that generates BLS secret keys (which are used in consensus to sign blocks) for threshold cryptosystem in decentralized and secure way.

SKALE Network is based on technologies developed by N.O.D.E. Foundation and SKALE Labs, with specific technologies forked and modified from Ethereum (Aleth client).

## Overview

SKALE DKG contains four different parts written in 4 languages - library for DKG math operation written in C++, SGX secure enclave functionality written in C, SKALE DKG smart contract written in Solidity and skale-admin functionality written in Python. SKALE DKG starts during schain creation process and is a required option for 0-code result. Once a schain is registered with SKALE Manager and the node group for this schain is chosen, nodes from this group commence DKG. If any errors during the DKG process occur, the node group will be regenerated and schain creation and DKG process will be restarted.

SKALE DKG is a part of SKALE Network that is responsible for BLS key creation on each node for each schain.

## Functional specification

This section contains the functional specifications that must be satisfied by the SKALE DKG.

-   SKALE DKG orchestrates how data is created, sent and verified on each node:
    -   All math operations take place under SGX or SKALE DKG smart contract.
    -   Each node has 120 blocks (~30 mins) to send any piece of data whether it is *broadcast*, *response* or *allright*. Otherwise the node is slashed.
    -   Before receiving data, SKALE DKG smart contract activates channel.
    -   Each node generates *randomPolynomial* and computes and sends *verificationVector* and *secretKeyContribution* values to the SKALE DKG smart contract.
    -   SKALE DKG smart contract checks that node specified in transaction broadcast is message-sender and this node is registered in SKALE system and node is registered in *channel*. The same happens for each transaction proceeding by the SKALE DKG smart contract.
    -   If node has already done *broadcast*, *channel* refuses broadcast transaction. If node has already sent *allright*, *channel* refuses any transaction from this node.
    -   SKALE DKG smart contract computes *commonPublicKey* using *verificationVector* sent from each node.
    -   SGX secure enclave computes common secret Diffie-Hellman key using generated *disposableKey* and other node owner’s *publicKey*.
    -   SGX secure enclave computes and checks that *verificationVector* and *secretKeyContribution* sent to the SKALE DKG smart contract are valid values. SGX also encrypts *secretKeyContribution* with a common secret Diffie-Hellman key to send it secretly so that only the sender and receiver can decrypt and read it. 
    -   SGX secure enclave verifies that *verificationVector* and *secretKeyContribution* sent from other participants are valid and correspond to each other. Otherwise a complaint will be processed and DKG will fail and restart. 
    -   In case of any problems with data sent via the SKALE DKG smart contract (e.g. data wasn’t sent in time or it is not correct) a node initiates a complaint to another and the second node should send a response. If response is not sent the node sends another complaint and the second node slashed.
    -   SKALE DKG smart contract receives response data and verifies whether it is valid or not. To determine data correctness smart contract decrypts *secretKeyContribution* using the values sent in *response* and then check it with bilinear mapping.
    -   If smart contract determines that a node sent incorrect data this node slashed.
-   SKALE DKG creates BLS keys based on data that was generated and verified during the process above:
    -   All BLS keys should be valid - they should belong to the specific mathematical structure F<sub>r</sub> (where *r* is a  254-bit prime) and should not be equal to zero.
    -   If DKG fails, then a new group for this schain generates using random node rotation and schain creation starts from the beginning.

## Functional requirements

SKALE DKG:
-   Shall create keys on SGX server.
    -   BLS secret key stores on SGX server. BLS public and common public keys are held on a node and can be found in schain-config.json.
-   Once BLS key is created on an SGX server, this value will be sent to node-owner:
<note>IMPORTANT NOTE : node-owner can see a value of BLS key only once in a lifetime</note>
-   All data sent from SGX server to each node shall be sent via secure connection using Diffie-Hellman key exchange method.
-   To sign a message with a BLS key you should call it by name that was specified during key creation in response to the SGX server.
-   BLS key name is extremely private information - **do not share it with anybody!**

## Security specification

-   SKALE DKG uses a random number generator provided by Intel® SGX.
-   SKALE DKG uses Intel® SGX server to store account and BLS keys and all the data related to DKG process (e.g. *secretKeyContribution*, *verificationVector*, *disposableKeys*).
-   SKALE DKG uses TLS certificate on the server side to provide secure connection between nodes and SGX server. On the client side SSL certificate is required.
-   SKALE DKG uses elliptic curve *alt_bn128* provided by [libff](https://github.com/scipr-lab/libff) and used in Ethereum’s [libsnark](https://github.com/ethereum/aleth/blob/master/libdevcrypto/LibSnark.h).
