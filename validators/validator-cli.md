## SKALE Validator CLI

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

Replace version number with TBD.

**Terminal Command:**

```bash
VERSION_NUM=[Version Number] && sudo -E bash -c "curl -L https://skale-cli.sfo2.cdn.digitaloceanspaces.com/stable/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale"

```

#### Make the SKALE Node CLI binary executable

**Terminal Command:**

```bash
sudo chmod +x /usr/local/bin/skale

```

### Step 2: Setup SKALE Node

#### Step 2.1: Initialize SKALE node daemon and install dependencies

Required options for the `skale node init` command:

-   `--github-token` - token for accessing `skale-node` repo
-   `--docker-username` - username for DockerHub
-   `--docker-password` - password for DockerHub
-   `--db-password` - MySQL password for local node database
-   `--disk-mountpoint` - Mount point of the disk to be used for storing sChains data
-   `--stream` - stream of `skale-node` to use
-   `--ima-endpoint` - IMA endpoint to connect
-   `--endpoint` - RPC endpoint of the node in the network where SKALE manager is deployed
-   `--manager-url` - URL to SKALE Manager contracts ABI and addresses
-   `--ima-url` - URL to IMA contracts ABI and addresses
-   `--dkg-url` - URL to DKG contracts ABI and addresses

✋These access tokens are needed to access private repos and docker containers.  **Please do not distribute!!!**

Access tokens will be provided with the release of the new CLI.

Note: **TOKEN**, **DOCKER_USERNAME**, and **DOCKER_PASSWORD** are provided for all participants.  

Please feel free to set your own  **DB_PASSWORD**.

**Terminal Command:**

```bash
skale node init \
--ima-endpoint [IMA_ENDPOINT] \
--endpoint [ENDPOINT] \
--stream [STREAM] --github-token [TOKEN] \
--docker-username [DOCKER_USERNAME] \
--docker-password [DOCKER_PASSWORD] \
--db-password [DB_PASSWORD] \
--disk-mountpoint [DISK_MOUNTPOINT] 
--manager-url [MANAGER_URL] \
--ima-url [IMA_URL] \
--dkg-url [DKG_URL] \
--install-deps

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

#### Step 2.2 Create user registration token

**Terminal Command:**

```bash
skale user token

```

**Output:**

> User registration token: [USER_REGISTRATION_TOKEN]

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

Note: In this pre-release software, your wallet address and private key for  **_test tokens are stored in plaintext json_**  file at the following location: /skale_node_data/local_wallet.json.  
‍  
We recommend that you backup this file in case you may need to rebuild the machine and re-register with the network using the same IP address.  

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
