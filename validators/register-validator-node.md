
# Run a Validator Node in the SKALE Network

<StepsLayout id='Validator'>

<StepsController>
    <StepNav stepId='one' label='Setup\nSGX Wallet'><ThresholdSignatures/></StepNav>
    <StepNav stepId='two' label='Enable\nSSL'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='four' label='Setup\nSKALE Node'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='five' label='Register\nValidator'><SendTransaction/></StepNav>
    <StepNav stepId='six' label='Register\nNode with Network'><LeaderlessConsensus/></StepNav>
</StepsController>

<Step id='one'>

## 1. Set up SGX Wallet

Sgxwallet runs as a network server. Clients connect to the server, authenticate to it using TLS 1.0 protocol with client certificates, and then issue requests to the server to generate crypto keys and perform cryptographic operations. The keys are generated inside the secure SGX enclave and never leave the enclave unencrypted.

To be able to set up an SGX Wallet, validators are required to have an SGX compatiable servers. Before installing SGX Wallet, validators has to make sure that SGX is enabled in the server. 

SKALE will have two types of SGX operations:

-   **Local (Secure)**: Wallet running on the same server as sub-node.  
-   **Network**: Sub-node talks to SGX wallet over the SKALE Network. The validator is responsible for securing the connection. If validator is planning to have a separate SGX compatible node than the Blockchain node, SGX Wallet node doesn't have to have the same hardware requirements as the sub-node. SGXWallet doesn't require a lot of computational power. After setting up the Network SGX node, enable SSL sertification before adding the url to configuration in SKALE Node Set up.

Please follow this link to learn how to set up an SGX Wallet Server. [sgx-wallet](/validators/sgx-wallet)

</Step>

<Step id='two'>

## 2. Enable SSL

SSL/TLS should be enabled for every SKALE and SGX nodes. Here is an example how to configure it through [AWS] (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html)

</Step>


<Step id='four'>

## 3. Setup SKALE Node with SKALE Node CLI

After Setting up SGX Wallet and create certifications, validators can download the SKALE Node CLI executables register and maintain your SKALE node. This process downloads docker container images from docker hub and spins up SKALE Node functionalities. Some of the base containers such as SKALE Admin, Bounty, SLA, TransactionManager will be created during installation for each node. 

Note: This is **an insecure pre-release** software specifically for Alpine team members. 

See the SKALE Node CLI code and documentation on [**GitHub**](https://github.com/skalenetwork/skale-node-cli)*‍  

This document contains instructions on how to get started with the SKALE Node CLI.  

### **Prerequisites**

-   A Linux x86_64 machine
-   SGX-enabled Intel processor
-   Ports 22, 8080, 9100, and 10000-11000, and ICMP IPv4 open for all
-   Ubuntu 18.04 or later LTS
-   200GB attached storage (mainnet requirements will be defined soon)
-   32GB RAM  

This pre-release Validator and Node software is insecure. As such, the only tokens running on this early phase Validator net are  _test tokens only_. SKALE will release a more secure system prior to later Validator Devnet releases.  
‍  
If you have any concerns or questions, please do not hesitate to reach out to SKALE Team leads on [discord](http://skale.chat/).  

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)

### Step 3.1: Install SKALE Node CLI

#### Download the SKALE Node CLI binary

Replace version number with `0.8.0-develop.32`

***Terminal Command:***

```bash
VERSION_NUM=[Version Number] && sudo -E bash -c "curl -L https://skale-cli.sfo2.cdn.digitaloceanspaces.com/beta/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale"

```

#### Make the SKALE Node CLI binary executable

***Terminal Command:***

```bash
sudo chmod +x /usr/local/bin/skale

```

### Step 3.2: Setup SKALE Node

#### Initialize SKALE node daemon and install dependencies

Required options for the `skale node init` command:

-   `--env-file` - path to env file where required parameters listed below are defined
-   `--install-deps` - install additional dependecies (like docker and docker-compose)

Required options for the `skale node init` command in environment file:

-   `SGX_SERVER_URL` - URL to SGX server in the network, can be used for current node if the current node supports intel technology SGX. SGX node can be set up through SGXwallet repository

-   `DISK_MOUNTPOINT` - Block device to be used for storing sChains data

-   `IMA_CONTRACTS_ABI_URL` - URL to IMA contracts ABI and addresses

-   `MANAGER_CONTRACTS_ABI_URL` - URL to SKALE Manager contracts ABI and addresses

-   `FILEBEAT_HOST` - URL to the Filebeat log server

-   `CONTAINERS_CONFIG_STREAM` - git branch with containers versions config
-   `DOCKER_LVMPY_STREAM` - git branch of docker lvmpy volume dirver for schains

-   `DB_PORT` - Port for of node internal database (default is 3306)

-   `DB_ROOT_PASSWORD` - root password

-   `DB_PASSWORD` - Password for root user of node internal database (equal to user password by default)

-   `DB_USER` - MySQL user for local node database

-   `IMA_ENDPOINT` - IMA endpoint to connect

-   `ENDPOINT` - RPC endpoint of the node in the network where SKALE manager is deployed

Create a `.env` file and specify following parameters:

**Terminal Command:**

```bash
    SGX_SERVER_URL=[SGX_SERVER_URL]
    DISK_MOUNTPOINT=[DISK_MOUNTPOINT]
    IMA_CONTRACTS_ABI_URL=[IMA_CONTRACTS_ABI_URL]
    MANAGER_CONTRACTS_ABI_URL=[MANAGER_CONTRACTS_ABI_URL]
    FILEBEAT_HOST=[FILEBEAT_HOST]
    CONTAINER_CONFIGS_STREAM=[CONTAINER_CONFIGS_STREAM]
    DOCKER_LVMPY_STREAM=[DOCKER_LVMPY_STREAM]
    DB_PORT=[DB_PORT]
    DB_ROOT_PASSWORD=[DB_ROOT_PASSWORD]
    DB_PASSWORD=[DB_PASSWORD]
    DB_USER=[DB_USER]
    IMA_ENDPOINT=[IMA_ENDPOINT]
    ENDPOINT=[ENDPOINT]
```

Please feel free to set values own  **DB_PASSWORD**, **DB_ROOT_PASSWORD**, **DB_USER**.

**Terminal Command:**

```bash

skale node init --env-file .env --install-deps

```

**Output:**

```bash
# Executing docker install script, commit: 2f4ae48...
(lines-omitted-for-brevity)...
Login Succeeded
Creating directories...
Creating copying config folder...
Creating copying tools folder...
Pulling base          ... done
Pulling admin         ... done
Pulling mysql         ... done
Pulling sla           ... done
Pulling bounty        ... done
Pulling events        ... done
Pulling advisor       ... done
Pulling node-exporter ... done
Run mode: prod
Creating skale_sla         ... done
Creating skale_mysql       ... done
Creating skale_admin       ... done
Creating config_base_1     ... done
Creating skale_bounty      ... done
Creating ash_cadvisor      ... done
Creating skale_events      ... done
Creating ash_node_exporter ... done

```

#### Show your SKALE wallet info

**Terminal Command:**

```bash
skale wallet info

```

**Output:**

```bash
Address: <your-skale-private-net-wallet-address>
ETH balance: 0 ETH
SKALE balance: 0 SKALE

```

</Step>

<Step id='four'>

## 4. Register Validator with SKALE Validator CLI

SKALE Validator CLI is the validator client interface for registering a new validator into network or handling additional delegation services where validators can self delegate or token holders can delegate to a validator. These are the type of operations that can be done with the Validator CLI:

-   Register Validator (Set Commission Rate or Minimum delegation amount)
-   Accept pending delegations
-   Link all validator node addresses to a validator wallet address
-   Request or cancel a delegation

Note: This is **an insecure pre-release** software.

See the SKALE Validator CLI code and documentation on [**GitHub**](https://github.com/skalenetwork/validator-cli)*‍  

This document contains instructions on how to get started with the SKALE Validator CLI.  

### Step 5.1: Install SKALE Validator CLI

#### Download the SKALE Validator CLI binary

Replace `[VERSION NUMBER]` with `0.3.0-develop.0`

**Terminal Command:**

```bash
VERSION_NUM=[VERSION NUMBER] && sudo -E bash -c "curl -L https://validator-cli.sfo2.digitaloceanspaces.com/develop/sk-val-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/sk-val"
```

#### Apply executable permissions to the binary

**Terminal Command:**

```bash
chmod +x /usr/local/bin/sk-val
```

#### Get SKALE Manager contracts info and set the endpoint

Required arguments:

-   `--endpoint/-e` - RPC endpoint of the node in the network where SKALE manager is deployed (`ws` or `wss`)
-   `--contracts-url/-c` - - URL to SKALE Manager contracts ABI and addresses
-   `-w/--wallet` - Type of the wallet that will be used for signing transactions (software or ledger)

Usage example:

**Usage example:**

```bash
sk-val init -e wss://rinkeby.infura.io/ws/v3/17af71ac8ba94607bd3374f4509ce17c -c https://skale-se.sfo2.digitaloceanspaces.com/skale-manager-rinkeby-v1.json --wallet-type software
```

### Step 5.2: Register as a new SKALE validator

Replace `[YOUR PRIVATE KEY]` with your wallet private key 

**Terminal Command:**

```bash
echo [YOUR PRIVATE KEY] > ./pk.txt
```

**Terminal Command:**

```bash
sk-val validator register
```

Required arguments:

-   `--name/-n` - Validator name
-   `--description/-d` - Validator description
-   `--commission-rate/-c` - Commission rate (percentage)
-   `--min-delegation` - Validator minimum delegation amount.For delegation requests that are less than this amount will be automatically rejected

Optional arguments:

-   `--pk-file` - Path to file with private key (only for `software` wallet type)
-   `--yes` - Confirmation flag

**Usage example:**

```bash
sk-val register -n SETeam -d "SE Team description" -c 20 --min-delegation 1000 --pk-file ./pk.txt
```

</Step>

<Step id='six'>

## 6: Register Node with Network

### Step 6.1: Get Tokens from the  [**SKALE Faucet**](http://faucet.skale.network/validators)

If you’re unable to transfer funds please feel free to reach out to the team on  [discord](http://http:skale.chat/).  
[](http://faucet.skale.network/validators)

Once tokens have been transferred, please check your wallet in the terminal.  

**Terminal Command:**

```bash
skale wallet info

```

### Step 6.2: Register Node with Validator CLI
Note: You should link skale wallet address to your validator account using validators-cli.

Note: Before proceeding, you will need to have at least  **0.2 Test ETH**. Also amount of delegated skale tokens need to be more or equal to minumum staking amount. Otherwise you will not be able to register with the SKALE Internal Devnet.  

To register with the network, you will need to provide the following:  

1.  Node name  
2.  Machine public IP   
3.  Port - beginning of the port range that will be used for skale schains (10000 recommended)  

**Terminal Command:**

```bash
skale node register --name [NODE_NAME] --ip [NODE_IP] --port [PORT]

```

**Output:**

> Node registered in SKALE manager. For more info run: skale node info


### Step 6.3: Check Node Status

You can check the status of your node, and ensure that it is properly registered with the SKALE Network.  

**Terminal Command:**

```bash
skale node info

```

**Output:**

```bash
# Node info
Name: $NODE_NAME
IP: $NODE_IP
Public IP: <Public IP of Machine>
Port: $NODE_PORT
Status: Active

```
</Step>

</StepsLayout>




























