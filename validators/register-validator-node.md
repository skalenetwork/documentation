# Run a Validator Node in the SKALE Network

This page is the step by step guide that shows how to run a validator node in the SKALE Network 

<StepsLayout id='Validator'>

<StepsController>
    <StepNav stepId='one' label='Setup\nSGX Wallet'><ThresholdSignatures/></StepNav>
    <StepNav stepId='two' label='Setup\nSKALE Node'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='three' label='Register\nValidator'><SendTransaction/></StepNav>
    <StepNav stepId='four' label='Register\nNode in SKALE Network'><Request/></StepNav>
    <StepNav stepId='five' label='Upload new SSL Certificates'><ByzantineFaultTolerant/></StepNav>
</StepsController>

<Step id='one'>

## 1. Set up SGX Wallet

Sgxwallet runs as a network server. Clients connect to the server, authenticate to it using TLS 1.0 protocol with client certificates, and then issue requests to the server to generate crypto keys and perform cryptographic operations. The keys are generated inside the secure SGX enclave and never leave the enclave unencrypted.

To be able to set up an SGX Wallet, validators are required to have an SGX compatiable servers. Before installing SGX Wallet, validators has to make sure that SGX is enabled in the server. 

SKALE will have two types of SGX operations:

-   **Local (Secure)**: Wallet running on the same server as sub-node.  
-   **Network**: Sub-node talks to SGX wallet over the SKALE Network. The validator is responsible for securing the connection. If validator is planning to have a separate SGX compatible node than the Blockchain node, SGX Wallet node doesn't have to have the same hardware requirements as the sub-node. SGXWallet doesn't require a lot of computational power. After setting up the Network SGX node, enable SSL certification before adding the url to configuration in SKALE Node Set up.

## SKALE SGX Wallet

SGX Wallet setup is the first step of the Validator Node registration process.  ‍

Sgxwallet is a next generation hardware secure crypto wallet that is based on Intel SGX technology. It currently supports Ethereum and SKALE.

**SGX is a secure storage for BLS private key shares. It would be used inside consensus to sign new blocks. But SGX is not only used for private key shares. For more information, please check** [**here.**](/validators/requirements)  

**SKALE DKG uses Intel® SGX server to store account and BLS keys and all the data related to DKG process and it also uses the random number generator provided by Intel® SGX. For more information, please check** [**here.**](/technology/skale-dkg) 

Sgxwallet runs as a network server. Clients connect to the server, authenticate to it using TLS 1.0 protocol with client certificates, and then issue requests to the server to generate crypto keys and perform cryptographic operations. The keys are generated inside the secure SGX enclave and never leave the enclave unencrypted.

The server provides an initial registration service to issue client certificates to the clients. The administrator manually approves each registration

### **Prerequisites**
-   Ubuntu 18.04
-   SGX-enabled Intel processor
-   At least 8GB RAM
-   Swap size equals to half of RAM size
-   Ports 1026-1028

**Terminal Commands:**

```bash
sudo apt-get install build-essential make cmake gcc g++ yasm  python libprotobuf10 flex bison automake libtool texinfo libgcrypt20-dev libgnutls28-dev
```
**Install Docker:**
```bash
sudo apt-get install -y docker
```
**Install docker.io:**
```bash
sudo apt-get install -y docker.io
```
**Install docker-compose:**
```bash
sudo apt-get install -y docker-compose
```
**Install cpuid and libelf-dev packages:**
```bash
sudo apt-get install -y libelf-dev cpuid
```
**Verify your processor supports Intel SGX with:**
```bash
cpuid | grep SGX:
```

**Output**
```bash
SGX: Software Guard Extensions supported = true
```
---

### Set Up SGX Wallet

#### STEP 1 - Clone SGX Wallet Repository

Clone SGX Wallet Repository to your SGX compatible Server:

```bash
git clone https://github.com/skalenetwork/sgxwallet/
cd sgxwallet
git checkout tags/1.53.0-develop.9
```

#### STEP 2 - Enable SGX

**SGX Wallet repository includes the sgx_enable utility. To enable SGX run:**

```bash
sudo ./sgx_enable
```

Note: if you are not using Ubuntu 18.04 (not recommended), you may need to rebuild the sgx-software-enable utility before use by typing:

```bash
cd sgx-software-enable;
make
cd ..
```

**Install SGX Library:** 

```bash
cd scripts 
sudo ./sgx_linux_x64_driver_2.5.0_2605efa.bin
cd ..
```

**System Reboot:** 
> Reboot your machine after driver install!

**Check driver installation:** 
To check that isgx device is properly installed run this command: 

```bash
ls /dev/isgx
```
If you do not see the isgx device, you need to troubleshoot your driver installation from [**here.**](https://github.com/skalenetwork/sgxwallet/blob/develop/docs/enabling-sgx.md)  

**Another way to verify Intel SGX is enabled in BIOS:**

> ***If you already executed the previous steps please move to STEP 3***

Enter BIOS by pressing the BIOS key during boot. The BIOS key varies by manufacturer and could be F10, F2, F12, F1, DEL, or ESC.

Usually Intel SGX is disabled by default.

To enable:

find the Intel SGX feature in BIOS Menu (it is usually under the "Advanced" or "Security" menu)
Set SGX in BIOS as enabled (preferably) or software-controlled.
save your BIOS settings and exit BIOS.
Enable "software-controlled" SGX
Software-controlled means that SGX needs to be enabled by running a utility.

#### STEP 3 - Start SGX

Production Mode

```bash
cd sgxwallet/run_sgx;
```

On some machines, the SGX device is not **/dev/mei0** but a different device, such as **/dev/bs0** or **/dev/sg0**. In this case please edit docker-compose.yml on your machine to specify the correct device to use:

```bash
vi docker-compose.yml
```

make sure `image` is skalenetwork/sgxwallet:1.53.0-develop.9 in docker-compose and it will look like:

```bash
version: '3'
services:
  sgxwallet:
    image: skalenetwork/sgxwallet:1.53.0-develop.9
    ports:
      - "1026:1026"
      - "1027:1027"
      - "1028:1028"
      - "1029:1029"
    devices:
      - "/dev/isgx"
      - "/dev/sg0"
    volumes:
      - ./sgx_data:/usr/src/sdk/sgx_data
      -  /dev/urandom:/dev/random
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "4"
    restart: unless-stopped
    command: -s -y -V
    healthcheck:
      test: ["CMD", "ls", "/dev/isgx", "/dev/"]
```

**Start SGX Wallet Containers**
To run the server as a daemon:
```bash
sudo docker-compose up -d
```

When SGXWallet is initialized, the server will print the backup key. 
**This key must be securely recorded and stored.**
Be sure to store this key in a safe place, then go into a docker container and securely remove it with the following command:

```bash
docker exec -it <SGX_CONTAINER_NAME> bash && apt-get install secure-delete && srm -vz backup_key.txt
```

### STOP SGX Wallet Containers
```bash
cd sgxwallet/run_sgx
sudo docker-compose stop
```

> If you set up SGX wallet in a separate server than your SKALE Node, you should enable SSL/TLS for your SGX node. Make sure you finalize this before you move on to your next step.

</Step>

<Step id='two'>

## 2. Setup SKALE Node with SKALE Node CLI

After Setting up SGX Wallet and create certifications, validators can download the SKALE Node CLI executables register and maintain your SKALE node. This process downloads docker container images from docker hub and spins up SKALE Node functionalities. Some of the base containers such as SKALE Admin, Bounty, SLA, TransactionManager will be created during installation for each node. 

Note: This is **an insecure pre-release** software specifically for Alpine team members. 

See the SKALE Node CLI code and documentation on [**GitHub**](https://github.com/skalenetwork/skale-node-cli)*‍  

This document contains instructions on how to get started with the SKALE Node CLI.  

### **Prerequisites**

-   A Linux x86_64 machine
-   SGX-enabled Intel processor
-   Ports 22, 8080, 9100, and 10000-11000, and ICMP IPv4 open for all
-   Ubuntu 18.04 or later LTS
-   2TB attached storage main-net (200gb devnet)
-   32GB RAM  
-   16GB swap
-   Install docker.io
-   run commands with sudo

This pre-release Validator and Node software is insecure. As such, the only tokens running on this early phase Validator net are  _test tokens only_. SKALE will release a more secure system prior to later Validator Devnet releases.  
‍  
If you have any concerns or questions, please do not hesitate to reach out to SKALE Team leads on [discord](http://skale.chat/).

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)

### Step 2.1: Install SKALE Node CLI

#### Download the SKALE Node CLI binary

Make sure th `VERSION_NUM` is the latest version provided here= [versions](/validators/versions)
For `RELEASE` parameter use the `develop` CLI versions use `develop` , for the `beta` CLI versions use `beta` , for the `stable` CLI versions use `stable`

**Terminal Command:**

```bash
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://skale-cli.sfo2.cdn.digitaloceanspaces.com/[RELEASE]/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale"

```

#### Make the SKALE Node CLI binary executable

**Terminal Command:**

```bash
sudo chmod +x /usr/local/bin/skale

```

### Step 2.2: Setup SKALE Node

#### Initialize SKALE node daemon and install dependencies

Required options for the `skale node init` command:

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
-   `IMA_ENDPOINT` - IMA endpoint to connect. 
-   `ENDPOINT` - RPC endpoint of the node in the network where SKALE manager is deployed (`ws` or `wss`)

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
    NODE_CLI_SPACE=[NODE_CLI_SPACE]
    SKALE_NODE_CLI_VERSION=[SKALE_NODE_CLI_VERSION]
```

Please feel free to set values own  **DB_PASSWORD**, **DB_ROOT_PASSWORD**, **DB_USER**.

```bash
    TG_API_KEY - Telegram API key
    TG_CHAT_ID - Telegram chat ID
    MONITORING_CONTAINERS - True/False will enable monitoring containers (filebeat, cadvisor, prometheus)
                            Required for TestNets 
```

**Terminal Command:**

```bash

skale node init .env --install-deps

```

**Output:**

```bash
48914619bcd3: Pull complete
db7a07cce60c: Pull complete
d285532a5ada: Pull complete
8646278c4014: Pull complete
3a12d6e582e7: Pull complete
0a3d98d81a07: Pull complete
43b3a182ba00: Pull complete
Creating monitor_cadvisor          ... done
Creating monitor_node_exporter     ... done
Creating monitor_filebeat          ... done
Creating skale_transaction-manager ... done
Creating config_base_1             ... done
Creating skale_watchdog            ... done
Creating skale_mysql               ... done
Creating skale_sla                 ... done
Creating skale_admin               ... done
Creating skale_bounty              ... done
Creating skale_api                 ... done
```

#### Show your SKALE SGX wallet info

This command prints information related to your sgx wallet. Node operates only from the sgx wallet:

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

#### Check if your node is connected to sgx

**Terminal Command:**

```bash
skale sgx status

```

**Output:**

```bash
SGX server status:
┌────────────────┬──────────────────────────┐
│ SGX server URL │ <sgx-url>
├────────────────┼──────────────────────────┤
│ Status         │ CONNECTED                │
└────────────────┴──────────────────────────┘

```

### Step 2.3: Get Test Tokens to your SGX and Validator wallets**

Get Tokens from the  [**SKALE Faucet**](https://faucet.skale.network/validators)

If you’re unable to transfer funds please feel free to reach out to the team on  [discord](http://http:skale.chat/).

[Click here for Faucet](https://faucet.skale.network/validators)

Once tokens have been transferred, please check your wallet in the terminal.  

**Terminal Command:**

```bash
skale wallet info

```

</Step>

<Step id='three'>

## 3. Register Validator with SKALE Validator CLI

SKALE Validator CLI is the validator client interface for registering a new validator into network or handling additional delegation services where validators can self delegate or token holders can delegate to a validator. These are the type of operations that can be done with the Validator CLI:

-   Register Validator (Set Commission Rate or Minimum delegation amount)
-   Accept pending delegations
-   Link all validator node addresses to a validator wallet address
-   Request or cancel a delegation

Note: This is **an insecure pre-release** software.

See the SKALE Validator CLI code and documentation on [**GitHub**](https://github.com/skalenetwork/validator-cli)*‍  

This document contains instructions on how to get started with the SKALE Validator CLI.

PS: Validator CLI doesn't have to be installed in the same server as the node-cli! 

### Step 3.1: Install SKALE Validator CLI

#### Download the SKALE Validator CLI binary

Make sure th `VERSION_NUM` is the latest version provided here= [versions](/validators/versions)
For `RELEASE` parameter use the `develop` CLI versions use `develop` , for the `beta` CLI versions use `beta` , for the `stable` CLI versions use `stable`

**Terminal Command:**

```bash
VERSION_NUM=[VERSION NUMBER] && sudo -E bash -c "curl -L https://validator-cli.sfo2.digitaloceanspaces.com/[RELEASE]/sk-val-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/sk-val"
```

#### Apply executable permissions to the binary

**Terminal Command:**

```bash
chmod +x /usr/local/bin/sk-val
```

#### Get SKALE Manager contracts info and set the endpoint

Required arguments:

-   `--endpoint/-e` - RPC endpoint of the node in the network where SKALE manager is deployed (`ws` or `wss`)
                    Example: wss://rinkeby.infura.io/ws/v3/...

-   `--contracts-url/-c` - - URL to SKALE Manager contracts ABI and addresses

-   `-w/--wallet` - Type of the wallet that will be used for signing transactions (software or ledger)

Usage example:

**Usage example:**

```bash
sk-val init -e [ENDPOINT] -c [ABI] --wallet software
```

### Step 3.2: Register as a new SKALE validator

> DO NOT REGISTER A NEW VALIDATOR IF YOU ALREADY HAVE ONE! check : `sk-val validator ls`. For additional node set up, please go to Step 3.5.

Replace `[YOUR PRIVATE KEY]` with your wallet private key 

**Terminal Command:**

```bash
echo [YOUR PRIVATE KEY] > ./pk.txt
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
sk-val validator register -n SETeam -d "SE Team description" -c 20 --min-delegation 0 --pk-file ./pk.txt
```

### Step 3.3: Make sure that the validator is added to the whitelist

Note: This is for testing purposes only. [**Whitelist**](https://alpine.skale.network/whitelist)

### Step 3.4: Write down your Node Address (SGX Wallet Address)

After executing following command you will find see Node Address

**Terminal Command:**

```bash
 skale wallet info
```
**Output:**

```bash
root@se-test-01:~# skale wallet info
--------------------------------------------------
Address: 0x.... -> ThisIsYour_NodeAddress
ETH balance: 3.499059343 ETH
SKALE balance: 200 SKALE
--------------------------------------------------
```

Please copy your SGX Wallet Address, you will be using it for linking node address to validator address.

### Step 3.5: Sign validator id using sgx wallet

Execute this command and find your validator ID 

**Terminal Command:**
```bash
sk-val validator ls
```

Get your SKALE node signature. This SIGNATURE will be used in Step 4.6 while linking node addresses to your validator 

**Terminal Command:**

```bash
skale node signature [VALIDATOR_ID]

```

**Output:**

```bash
Signature: <your-signature>

```

### Step 3.6: Link skale wallet address to your validator account using validator-cli

> Make sure you copied Node Address from STEP 3.4

**Terminal Command:**

```bash
 sk-val validator link-address [NODE_ADDRESS] [SIGNATURE] --yes --pk-file ./pk.txt 
```

</Step>

<Step id='four'>

### Step 3.7: Send-Accept Delegation using validator-cli

> Make sure you  already have at least 100 SKL tokens in your validator wallet for TestNet MSR is 100SKL tokens. 

**Terminal Command:**

```bash
 sk-val holder delegate --validator-id [Validator_ID] --amount 100 --delegation-period 3 --pk-file pk.txt --info "please accept delegation" --yes
```
List your delegations

```bash
    sk-val validator delegations [VALIDATOR_ID] 
```

You will see your pending delegation please get the delegation number and accept delegation

```bash
    sk-val validator accept-delegation --delegation-id [DELEGATION-ID] --pk-file pk.txt 
```

List your delegations make sure your accepted delegations are equal or more than 100SKL tokens

```bash
    sk-val validator delegations [VALIDATOR_ID] 
```

### Step 3.8 : Delegations have to be in "DELEGATED" status
To be able to register a node in the network with the MSR requirement your delegations have to be in the DELEGATED status. 
After the previous step delegation status will be seen as accepted. 
"Delegated" status will be automatically updated 1st day of each month when the epoc starts. 

> For Testnet Only, please ask Core team to skip time to update delegation status

## 4: Register Node with Network

### Step 4.1: Register Node with Node CLI

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

### Step 4.2: Check Node Status

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

<Step id='five'>

## 5: Upload new SSL certificates

> If you already have SSL certificate for your domain name, please add and manage this certificate in the SKALE node

**Terminal Command:**

```bash
skale ssl upload
```

### Options

-   `-c/--cert-path` - Path to the certificate file
-   `-k/--key-path` - Path to the key file
-   `-f/--force` - Overwrite existing certificates

Admin API URL: \[GET] `/api/ssl/upload`

### SSL Status

Status of the SSL certificates on the node

**Terminal Command:**

```bash
skale ssl status
```

Admin API URL: \[GET] `/api/ssl/status`

</Step>
</StepsLayout>
