## SKALE Validator CLI Workshop

Note: This is **an insecure pre-release** software specifically for Alpine team members. 

See the SKALE Validator CLI code and documentation on [**GitHub**](https://github.com/skalenetwork/skale-node-cli)*‍  

This document contains instructions on how to get started with the SKALE Validator CLI.  

### **Prerequisites**

-   A Linux x86_64 machine
-   SGX-enabled Intel processor
-   Ports 22, 8080, 9100, and 10000-11000, and ICMP IPv4 open for all
-   Ubuntu 16.04 or later LTS
-   200GB attached storage (mainnet requirements will be defined soon)
-   32GB RAM  

This pre-release Validator and Node software is insecure. As such, the only tokens running on this early phase Validator net are  _test tokens only_. SKALE will release a more secure system prior to later Validator Devnet releases.  
‍  
If you have any concerns or questions, please do not hesitate to reach out to SKALE Team leads on [discord](http://skale.chat/).  

[![Discord](https://img.shields.io/discord/534485763354787851.svg)](https://discord.gg/vvUtWJB)

### Step 1: Install SKALE Node CLI

#### Download the SKALE Node CLI binary

Replace version number with `0.8.0-beta.1`

**Terminal Command:**

```bash
VERSION_NUM=0.8.0-beta.1 && sudo -E bash -c "curl -L https://skale-cli.sfo2.cdn.digitaloceanspaces.com/beta/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale"

```

#### Make the SKALE Node CLI binary executable

**Terminal Command:**

```bash
sudo chmod +x /usr/local/bin/skale

```

### Step 2: Setup SKALE Node

#### Step 2.1: Initialize SKALE node daemon and install dependencies

Required options for the `skale node init` command:

-   `--disk-mountpoint` - Mount point of the disk to be used for storing sChains data
-   `--sgx-url` - URL to SGX server in the network, can be used for current node if the current node supports SGX-enabled Intel processor
-  `--env-file` - path to env file where required parameters listed above are defined

Required options for the `skale node init` command in environment file:

-   `SGX_SERVER_URL` - URL to SGX server in the network, can be used for current node if the current node supports intel technology SGX. SGX node can be set up through SGXwallet repository
-   `DISK_MOUNTPOINT` - Mount point of the disk to be used for storing sChains data
-   `IMA_CONTRACTS_INFO_URL` - URL to IMA contracts ABI and addresses
-   `MANAGER_CONTRACTS_INFO_URL` - URL to SKALE Manager contracts ABI and addresses
-   `FILEBEAT_HOST` - URL to the Filebeat log server
-   `GITHUB_TOKEN` - token for accessing `skale-node` repo
-   `GIT_BRANCH` - git branch used for initialization
-   `DOCKER_PASSWORD` - password for DockerHub
-   `DOCKER_USERNAME` - username for DockerHub
-   `DB_PORT` - Port for of node internal database (default is 3306)
Node Register
-   `DB_ROOT_PASSWORD` - root password
-   `DB_PASSWORD` - Password for root user of node internal database (equal to user password by default)
-   `DB_USER` - MySQL user for local node database
-   `IMA_ENDPOINT` - IMA endpoint to connect
-   `ENDPOINT` - RPC endpoint of the node in the network where SKALE manager is deployed

---
To find your attach storage path [DISK_MOUNT_POINT] execute this command


**Terminal Command:**

```bash
fdisk -l
```
---

Create a `config.env` file and specify following parameters:

**Terminal Command:**

```bash
SGX_SERVER_URL=https://45.76.37.95:1026/
DISK_MOUNTPOINT=/dev/sda
IMA_CONTRACTS_INFO_URL=https://skale-contracts.nyc3.digitaloceanspaces.com/workshop/beta0801-ima.json
MANAGER_CONTRACTS_INFO_URL=https://skale-contracts.nyc3.digitaloceanspaces.com/workshop/beta0801-manager.json
FILEBEAT_HOST=127.0.0.1:3007
GITHUB_TOKEN=475156ec5367ee57ce3edcb3c70040dbebc7a835
GIT_BRANCH=workshop-beta
DOCKER_PASSWORD=375f13fe-17ae-44c5-a510-ab3963fb6611
DOCKER_USERNAME=skalelabs
DB_PORT=3307
DB_ROOT_PASSWORD=test
DB_PASSWORD=test
DB_USER=test
IMA_ENDPOINT=http://134.209.56.46:1919
ENDPOINT=ws://geth0.skalenodes.com:1920
```

✋These access tokens are needed to access private repos and docker containers.  **Please do not distribute!!!**

Access tokens will be provided with the release of the new CLI.

Note: **TOKEN**, **DOCKER_USERNAME**, and **DOCKER_PASSWORD** are provided for all participants.  

Please feel free to set your own  **DB_PASSWORD**.

**Terminal Command:**

```bash

skale node init \
--disk-mountpoint /dev/sda  \
--sgx-url https://45.76.37.95:1026/ \
--env-file config.env \
--install-deps

```

**Output:**

```bash
# Executing docker install script, commit: 2f4ae48...
(lines-omitted-for-brevity)...
Login Succeeded
Creating network "config_default" with the default driver
Pulling base (kubernetes/pause:)...
latest: Pulling from kubernetes/pause
latest: Pulling from kubernetes/pause
4f4fb700ef54: Pull complete
b9c8ec465f6b: Pull complete
.
.
.
Creating skale_transaction-manager ... done
Creating config_base_1             ... done
Creating skale_mysql               ... done
Creating monitor_filebeat          ... done
Creating monitor_cadvisor          ... done
Creating monitor_node_exporter     ... done
Creating skale_bounty              ... done
Creating skale_sla                 ... done
Creating skale_admin               ... done

```

#### Step 2.2 Create user registration token

**Terminal Command:**

```bash
skale user token

```

**Output:**

> User registration token: [USER_REGISTRATION_TOKEN]

Note: In this pre-release software, your wallet address and private key for  **_test tokens are stored in plaintext json_**(USER_REGISTRATION_TOKEN)  file at the following location: /.skale_node_data/local_wallet.json.  
‍  
**Terminal Command:**

```bash
cat /root/.skale/node_data/tokens.json
```


We recommend that you backup this file in case you may need to rebuild the machine and re-register with the network using the same IP address.  


#### Step 2.3: Create and register user with user registration token

Note: select a user and password, and use the user registration token from the previous step.

**Terminal Command:**

```bash
skale user register -u [USER] -p [PASSWORD] -t [USER_REGISTRATION_TOKEN]

```

**Output:**

> User created: $USER> Success, cookies saved.

#### Step 2.4: Show your SKALE wallet info

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

### Step 3:  **Get Test Tokens**

Get Tokens from the  [**SKALE Faucet  
**](http://faucet.skale.network/validators)

If you’re unable to transfer funds please feel free to reach out to the team on  [discord](http://http:skale.chat/).  
[](http://faucet.skale.network/validators)

Once tokens have been transferred, please check your wallet in the terminal.  

**Terminal Command:**

```bash
skale wallet info

```

### Step 4: Register with Network

Before proceeding, you will need to have at least  **0.2 Test ETH**  and  **100 test SKALE tokens**. Otherwise you will not be able to register with the SKALE Internal Devnet.  

Get Tokens from the  [**SKALE Faucet**](http://faucet.skale.network/validators)

To register with the network, you will need to provide the following:  

1.  Node name  
2.  machine IP  
3.  Port (10000 recommended)  

**Terminal Command:**

```bash
skale node register --name [NODE_NAME] --ip [NODE_IP]

```

**Output:**

> Node registered in SKALE manager. For more info run: skale node info

### Step 5: Check Node Status

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
