<StepsLayout id='Validator'>

## SKALE Validator

<StepsController>
    <StepNav stepId='one' label='Overview'><Fundamentals/></StepNav>
    <StepNav stepId='two' label='Setup\nSGX Wallet'><ThresholdSignatures/></StepNav>
    <StepNav stepId='three' label='Enable\nSSL'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='four' label='Setup\nSKALE Node'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='five' label='Register\nValidator'><SendTransaction/></StepNav>
</StepsController>

<Step id='one'>

### 1. Run a Validator Node

#### 1. Overview

The SKALE Network is a high-throughput, low-latency, configurable byzantine fault-tolerant sidechain network for the Ethereum blockchain. Or, in short, an Elastic Sidechain Network.  

The SKALE Network has a set of validators securing the network. Validators provide computation power to the SKALE Network via deploying nodes. The collection of validators and the node(s) they spin up represent the entire validator network that performs work for SKALE Chains (Elastic Sidechain aka SKALE Chain).  
‍  
SKALE Chains in the network are operated by a group of virtualized sub-nodes selected from a subset of nodes (validators) in the network and are run on all or a subset (multi-tenancy) of each node’s computation and storage resources.  

As each node in the network continues to participate in their assigned SKALE Chains, they are awarded bounties based upon their performance at the end of each network epoch. Each node will be monitored by their peer nodes.  
‍  
When an Elastic Sidechain has reached the end of its lifetime, the resources (computation, storage) of its virtualized sub-nodes will be freed so that validator nodes may participate in newly created Elastic Sidechains.  

**Interested in helping the SKALE Network grow? Apply to become a SKALE Validator:**  

<button>[Become a Validator](https://skale.network/validators-signup)</button>

To be added as a node to the SKALE Network, a prospective node must run the SKALE Admin, which manages all operations in the node. SKALE Admin evaluates the prospective node to ensure that it is upholding network hardware requirements. 

Please follow this link to learn about the hardware requirements. [requirements](/validators/requirements)

</Step>
<Step id='two'>

#### 2. Set up SGX Wallet

Sgxwallet runs as a network server. Clients connect to the server, authenticate to it using TLS 1.0 protocol with client certificates, and then issue requests to the server to generate crypto keys and perform cryptographic operations. The keys are generated inside the secure SGX enclave and never leave the enclave unencrypted.

To be able to set up an SGX Wallet, validators are required to have an SGX compatiable servers. Before installing SGX Wallet, validators has to make sure that SGX is enabled in the server. 

SKALE will have two types of SGX operations:

-   **Local (Secure)**: Wallet running on the same server as sub-node.  
-   **Network**: Sub-node talks to SGX wallet over the SKALE Network. The validator is responsible for securing the connection. If validator is planning to have a separate SGX compatible node than the Blockchain node, SGX Wallet node doesn't have to have the same hardware requirements as the sub-node. SGXWallet doesn't require a lot of computational power. After setting up the Network SGX node, enable SSL sertification before adding the url to configuration in SKALE Node Set up.

Please follow this link to learn how to set up an SGX Wallet Server. [sgx-wallet](/validators/sgx-wallet)

</Step>

<Step id='three'>

#### 3. Enable SSL

SSL/TLS should be enabled for every SKALE and SGX nodes. Here is an example how to configure it through [AWS] (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html)

</Step>

<Step id='four'>

#### 4. Setup SKALE Node

After Setting up SGX Wallet and create certifications, validators can download the SKALE Node CLI executables register and maintain your SKALE node. This process downloads docker container images from docker hub and spins up SKALE Node functionalities. Some of the base containers such as SKALE Admin, Bounty, SLA, TransactionManager will be created during installation for each node. 

Please follow this link to learn "How to set up SKALE Node" [node-cli](/validators/node-cli)

</Step>

<Step id='five'>

#### 5. Register Validator

SKALE Validator CLI is the validator client interface for registering a new validator into network or handling additional delegation services where validators can self delegate or token holders can delegate to a validator. These are the type of operations that can be done with the Validator CLI:

-   Register Validator (Set Commission Rate or Minimum delegation amount)
-   Accept pending delegations
-   Link all validator node addresses to a validator wallet address
-   Request or cancel a delegation

Please follow this link to learn "How to register a Validator to SKALE Network" [validator-cli](/validators/validator-cli)

</Step>

</StepsLayout>