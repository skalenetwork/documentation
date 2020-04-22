## SKALE Node CLI

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

### Step 1: Install SKALE Node CLI

#### Download the SKALE Node CLI binary

Replace version number with `0.8.0-develop.34`

**Terminal Command:**

```bash
VERSION_NUM=[Version Number] && sudo -E bash -c "curl -L https://skale-cli.sfo2.cdn.digitaloceanspaces.com/develop/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale"

```

#### Make the SKALE Node CLI binary executable

**Terminal Command:**

```bash
sudo chmod +x /usr/local/bin/skale

```

### Step 2: Setup SKALE Node

#### Step 2.1: Initialize SKALE node daemon and install dependencies

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

Create a `config.env` file and specify following parameters:

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

skale node init --env-file config.env --install-deps

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

#### Step 2.2: Show your SKALE wallet info

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

### Step 3:  **Register your account as a validator using validator-cli**

Check [https://github.com/skalenetwork/documentation/blob/master/validators/validator-cli.md](Validator CLI) for more information.

### Step 4:  **Get Test Tokens**

Get Tokens from the  [**SKALE Faucet  
**](http://faucet.skale.network/validators)

If you’re unable to transfer funds please feel free to reach out to the team on  [discord](http://http:skale.chat/).  
[](http://faucet.skale.network/validators)

Once tokens have been transferred, please check your wallet in the terminal.  

**Terminal Command:**

```bash
skale wallet info

```

### Step 5: Register with Network

Link skale wallet address to your validator account using validators-cli.

**Terminal Command:**

```bash
 sk-val validator link-address [NODE_ADDRESS] --yes --pk-file ./pk.txt 
```

Note: Before proceeding, you will need to have at least  **0.2 Test ETH**. Also amount of delegated skale tokens need to be more or equal to minumum staking amount. Otherwise you will not be able to register with the SKALE Internal Devnet.  

Get Tokens from the  [**SKALE Faucet**](http://faucet.skale.network/validators)

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

### Step 6: Check Node Status

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