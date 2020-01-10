# SKALE Node

SKALE Nodes are the servers run by validators.  

Every node has its own Orchestration, Auditing (Each node monitors at least 24 other nodes in the SKALE Network), and Administration (SKALE Admin).  

Each "node" hosts several SKALE Chains, for example 128 small SKALE Chains as Docker containers:
<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9bdb82e33988edd815c5ff_Screen%20Shot%202019-10-07%20at%205.33.54%20PM.png" width="500"/> 

For more detailed information please review the  [WhitePaper](https://skale.network/whitepaper)  or  [SKALE Tech-Stack](https://medium.com/skale/the-skale-tech-stack-5beb025acb6a)

## List Of SKALE Containers

The following base containers will be created during installation for each node:  

**Admin**

Manages all operations in the SKALE NODE

**MySQL**

Stores bounty, node downtime and latency data

**SLA**

SKALE Node Monitoring Service (NMS)

**Bounty**

Bounty collector for getting rewards for validator node

The following containers will be created dynamically. The containers will be created when the registered node is assigned randomly to a SKALE Chain in the network by SKALE Manager.  

**IMA**

SKALE Interchain Messaging Agent (IMA) will be optional in the network for dApp developers

**SCHAIN**

SKALE Chain container with SKALE Daemon which includes SKALE Consensus

## Setting Up a New Node

There are two main CLI scripts that validators will run to set up a new node  

**SKALE node init**

Creates SKALE Admin containers and SKALE admin checks if the node meets the requirements of the SKALE Network

**SKALE node register**

Registers a validator node to SKALE Manager smart contract which lives in the Mainnet

To register a new node in the SKALE network please follow the steps in the [CLI Documentation](/validators/validator-cli)  

## SKALE Chain

SKALE Chain is a container running the SKALE Daemon service including the SKALE consensus. SKALE Chains are created and managed through the SKALE Manager located on the Ethereum blockchain. SKALE Manager is a series of smart contracts responsible for:  

-   The orchestration and creation of SKALE Chains  
      
-   The registration of validators with the SKALE Network  
      
-   The performance measuring of nodes in the network  
      

We will have more documentation regarding SKALE Manager responsibilities and architecture available in the upcoming Alpine Team Phases.  

### Distribution of SKALE Chains

SKALE Chains will be randomly assigned and shuffled/rotated in the SKALE Network. When a SKALE chain is created in the SKALE Network, SKALE Manager distributes the SKALE Chain across 16 nodes with a randomized algorithm.  

**_(In this following example, the assumption is that SKALE Manager is distributing SKALE Chains to 4 nodes instead of 16 to simplify)_**  

> _The following image shows that all same colors communicate with each other and belongs to the same dApp. When a dApp owner requests a SKALE Chain and receives an endpoint to the nodes within their SKALE Chain, communication within the SKALE Chain is be coordinated by the SKALE Daemon._  

<Box>
<Flex sx={{ alignItems: 'center'}} >

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9be1fa022515dd48e400ac_Screen%20Shot%202019-10-07%20at%206.08.17%20PM.png" width="35"/>

A - (Small Chain) Assign these chains to Node 2, 3, 8, 9 **,  _1/128 of a node_**  

</Flex>
<Flex sx={{ alignItems: 'center'}} >

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9be1fa02251508dde400ad_Screen%20Shot%202019-10-07%20at%206.08.26%20PM.png" width="35"/>

B - (Small Chain) Assign these chains to Node 2, 5, 7, 8 **,  _1/128 of a node_**  

</Flex>
<Flex sx={{ alignItems: 'center'}} >

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9be1fae59dca31e9150b37_Screen%20Shot%202019-10-07%20at%206.08.09%20PM.png" width="35"/>

C - (Large Chain) Assign these chains to Node 1, 4, 6, 10 **, Use the entire node resources**

</Flex>
<Flex sx={{ alignItems: 'center'}} >

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9be4eb0225153950e41255_Screen%20Shot%202019-10-07%20at%206.22.27%20PM.png" width="35"/>

D - (Medium Chain) Assign these chains to Node 3, 5, 7, 8  **, 1/8 of a node**  

</Flex>
</Box>

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5db0ca39f782f955e55303eb_Screen%20Shot%202019-10-23%20at%202.45.41%20PM.png" width="730"/> 

After the SKALE Chain assignment, Docker container names show up in particular nodes:  
**skale_ima_A**,  **skale_schain_A**,  **skale_ima_B**,  **skale_schain_B**, **skale_ima_C**,  **skale_schain_C**,  **skale_ima_D**,  **skale_schain_D**  

**_skale_schain_machine_learning_** _containers will be in later versions._

### SKALE Daemon ([SKALE-D](https://github.com/skalenetwork/skaled)):

SKALE Daemon (SKALE-D) runs inside the SKALE Chain container. SKALE Daemon stores ETH blocks, state, and file storage database. A snapshot will need to be made of the SKALE Daemon.  

_When you take a snapshot of a SKALE Daemon it is “per SKALE Chain container." A global database does not yet exist._  

#### SKALE DAEMON Deep Dive

**RPC**: RPC stands for Remote Procedure Call, and is an interface that provides developers access to data on Ethereum or the SKALE Network. For more info:

-   [GETH](https://github.com/ethereum/wiki/wiki/JSON-RPC)
-   [ALETH](https://github.com/ethereum/aleth)

<note>

<strong>Note:</strong> Currently, the following functions are not supported on SKALE<br/>
<strong>sh\_</strong> <br/>
<strong>eth_sign</strong> <br/>
<strong>eth_compile</strong><br/>

</note>

There are two types of calls that a dApp can make via RPC:

-   Transaction (Changes state of data)
-   Call (retrieves information from storage that does not change the state of data)  

Examples:

Example 1:  Use RPC to connect to a SKALE Chain (follow the detailed instructions within  [GETH](https://github.com/ethereum/wiki/wiki/JSON-RPC) documentation) and replace the [ENDPOINT] with a SKALE Chain RPC endpoint.

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":67}' "[ENDPOINT]" -k 
```

If you are in the Innovator Program, you will receive a SKALE Chain RPC endpoint from your Account Manager. If you are a validator you can learn how to get access to a SKALE chain endpoint in the [FAQ](/validators/faq)  section.

Example 2:  Use  [command line options](https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options)  available through a validator node. You can find a list of the available terminal commands  [here](https://ethereum.stackexchange.com/questions/28703/full-list-of-geth-terminal-commands). For example, to attach to a SKALE Chain endpoint via the command line, use the following command:

```bash
get attach "[YOUR_SKALE_CHAIN_ENDPOINT]" 

```

Example 3:  Use  Web3 to connect to a SKALE Chain. We have detailed examples available on our [dApp developers Page.](/developers/getting-started)

**Consensus:** Interacts with the other node SKALE Daemons within the assigned SKALE Chain, and orders all received transactions. Then consensus validates transactions and creates a block when 2/3 of the nodes reach consensus.

**Block**: Consists of an ordered set of received transactions, which is created after consensus and sealed by the BLS signature of each node within the SKALE Chain.  

**EVM**: EVM stands for Ethereum Virtual Machine, and is the processor of smart contracts. Currently only solidity will be supported on the first version of the SKALE Network.  
_  
Executions in EVM can be very expensive. For these executions SKALE uses precompiled smart contracts. (Ex: Machine Learning predict function or cryptographic algorithms). In this case, we store the precompiled smart contract in the SKALE Daemon directly._  

**Storage**: Stores information like the amount of money in user accounts or code (Smart Contracts in binary, Address) or Smart Contract Memory. It’s stored in a key-value database/storage. Storage is persistent and efficient. It’s a regular key-value storage and it’s simplified  [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree)  to run faster.  

Storage in aleth, geth or any other Ethereum client is a Merkle Tree, which is the data structure that is mostly commonly used in cryptography.

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9bea14e59dca36f11540ea_Screen%20Shot%202019-10-07%20at%206.44.17%20PM.png" width="600"/> 

-   dApp sends a transaction to the SKALE Daemon RPC interface through a wallet ( Web3 or Metamask)  
-   RPC sends the transaction to “Transaction Queue“. In this state, order doesn’t matter  
-   Transaction Queue sends the transaction into the Consensus
-   Consensus, broadcasts the new transaction and gets received transactions from other node SKALE Chains. And sends the existing transactions to other SKALE Chains. After this trade, the Consensus orders all the transactions received for this SKALE Chain:  

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9bedec787cd068ca3d2c23_Screen%20Shot%202019-10-07%20at%205.34.43%20PM.png" width="500" /> 

-   Consensus does not accept any new transactions until the block is created. The block will be acceptable and will be valid if 2/3 of nodes agree. (DKG algorithm runs here). After the block creation, it will be sealed with the (BLS) signature.  
    ‍**SGX is a secure storage for BLS private key shares. It would be used inside consensus to sign new blocks. But SGX is not only used for private key shares; it can also be used for storing any secured data. Such as ECDSA (Elliptic Curve Digital Signature Algorithm). For more information, please check** [**here.**](/validators/requirements)  
-   Set of transactions which created in block goes to EVM  
-   If the transaction successfully sent to address from A to B. EVM updates the info in Key-Value storage(Level DB)  

## Ports

**Required validator open ports during node registration: 22 , 8080 , 9100 , 10000 - 12000, and ICMP IPv4**  

After each SKALE Chain is created on the SKALE Node, then the SKALE admin allocates 12 ports for this SKALE Chain:  

Four ports will be reserved for https, http, wws, ws  
‍  
The other eight ports are used by containers (SKALE Daemon, SLA Agent, ML, IMA, Consensus, etc)  
‍  
SKALE Node default port is 10000: This value can be changed by the validator; however port 10000 is recommended.  
‍  
Assuming we have two nodes and both nodes default port is registered as 10000, then SKALE Chain assignments starts:  
‍  
in node1 (in sequence) A,B,C chains are created  
in node2 (in sequence) Z,Y,B,C chains are created  

node1 S-chain A ports will be between 10000-10011
**node1 S-chain B ports will be between 10012-10024**
**node1 S-chain C ports will be between 10025-10037**  

node2 S-chain Z ports will be between 10000-10011  
node2 S-chain Y ports will be between 10012-10023  
**node2 S-chain B ports will be between 10024-10035**  
**node2 S-chain C ports will be between 10036-10047**  

**SKALE Chain B ports 10012-10024 in node 1 will communicate with SKALE Chain B ports 10024-10035 in node2**‍  

> Default Base port: 10000  
> Max Port: 128 SKALE Chain → 12 port each → 11536 Max port can be assigned for all SKALE Chain in the node

## SLA Agent

To encourage good behavior and ensure high performance within each SKALE Chain, SKALE has incorporated an SLA Manager in its system.  

Nodes in the network are rewarded based upon an algorithmic peer review system. Nodes that fall offline or have poor performance in the network will receive little or no reward for their mining efforts.  
<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9cccef4ad854a71d5e51d9_Screen%20Shot%202019-10-08%20at%2010.50.38%20AM.png" width="600" /> 

T0 = A New node is registered  
T30 -1 = 1 hour before the epoch time. Reset monitoring and Until T30 there is no monitoring  
T30 = Time when validator gets bounties getbounties() function will be called at this time

When the validator registers a node, SKALE Admin deploys the node information such as public key, owner host in Skale Manager Smart Contract. SKALE uses and gets the list of node information periodically from SKALE Manager. ValidatorArray (List of validators), ValidatedArray (List of validated nodes)

> **Every node is monitored by 24 other nodes**  
> **Every node monitors 24 other nodes**

Nodes store latency and downtime of each monitored node in SKALE MySQL.  
SLA Agent has its Container. SKALE spins up one SLA Agent per validator Node (SERVER)  

Every 30 days, validator gets bounties and collects data 1 hour before the epoch time:  

At the time [T30 - 1] the SLA agent receives the aggregated data(metrics) from MySQL Database in MySQL Container  
At the time, T30 SLA sends the metrics to SKALE Manager.  

To do that, we ignore the highest and lowest values from the equation. (Median)

> At the end of each network epoch, the number of SKALE tokens minted for that period is divided equally amongst all nodes. These nodes participate in the network before the epoch beginning. The number of these issued tokens which each node can claim is based upon the average of the metrics submitted its 24 peers where the top and bottom values are dropped to mitigate any collusion or malicious intent by peer nodes. Any tokens which are not issued to nodes as a result of poor uptime/latency will be issued to the N.O.D.E. Foundation

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9cd94cccdd26412442bb1d_Screen%20Shot%202019-10-08%20at%2011.44.41%20AM.png" width="600" /> 

This report can be costly if it is sent to the mainnet too often. Every time a SKALE Node sends the monitoring information to SKALE Manager, the SLA Agent uses gas. If a validator is out of ETH, the monitoring may fail. To reduce cost to the validator, the SKALE Node will only send the report to SKALE Manager once a month per node.  
‍  
Bounties are calculated based on the performance of each SKALE NODE. This means that although one validator's latency may be higher than other validators within the SKALE Network, the validator will still receive rewards based on their performance. **SKALE will have a simple algorithm on SKALE Manager, and the SLA agent will reduce the bounty value for the node if it has a latency of more than X ms. The validator may receive a reduced bounty if the downtime is more than X/30 of epoch time.** Bounties are not calculated based on the "overall performance" within the network, it is calculated based on the performance of the node and bonding period. SKALE will provide an updated model for SKALE economics during Alpine Team Phase 3.  

> _"SLA Manager Communicates to SKALE Manager and tracks performance of other nodes that are not on the SKALE Chains run by your node(s). The SLA Manager assigns scores between 0 and 1 to its peers which will determine the payout at the end of an epoch."_

## Node Provisioning (for testing only)

We open-sourced our [SKALE Node provisioning](https://github.com/skalenetwork/node-provisioning) code with Terraform. Currently, it supports AWS and Digital Ocean cloud server providers. Feel free to include the SKALE Node provisioning code in your node set up to assist in testing.
