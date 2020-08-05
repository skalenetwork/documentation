## SKALE TestNet Versions

You can find the compatible versions in this page. Set up requires only Validator-Cli, Node-Cli and SGX versions. 

The rest of the versions were provided for docker containers and correspondent tags in their individual code repositories.  

### TestNet Phase 2 Versions - Hard Upgrade

**Validator CLI version**:  0.6.0-develop.2

**Node CLI version**: 0.10.1-beta.1

**SGX version: sgxwallet**: 1.53.0-develop.9

**SKALE Manager version**: 1.5.0-develop.9

**Skaled version**:  1.46.1-develop.33

**Skale Admin version**: 0.15.0-beta.0

**Transaction Manager version**: 0.4.1-beta.0

**Skale Sla version**: 0.9.6-test

**Skale Bounty version**: 0.9.1-develop.0

#### TestNet Phase 2 Environment Variables

```bash
FILEBEAT_HOST=[WILL BE RETIRED FOR TEST-NET ASK CORE TEAM]
SGX_SERVER_URL=[https://localhost:1026 or your SGX server https://IP:1026]
DISK_MOUNTPOINT=/dev/sda or /dev/xvdd
DOCKER_LVMPY_STREAM=beta
DB_PORT=3306
DB_ROOT_PASSWORD=[PASSWORD]
DB_PASSWORD=[PASSWORD]
DB_USER=[USER]
MONITORING_CONTAINERS=True
CONTAINER_CONFIGS_STREAM=alpine-hard-upgrade
IMA_CONTRACTS_ABI_URL=[RINKEBY_ABI ASK CORE TEAM]
MANAGER_CONTRACTS_ABI_URL=[RINKEBY_ABI ASK CORE TEAM]
ENDPOINT=[YOUR GETH NODE ENDPOINT OR https://rinkeby.infura.io/v3/INFURA KEY]
IMA_ENDPOINT=[YOUR GETH NODE ENDPOINT OR https://rinkeby.infura.io/v3/INFURA KEY]
TG_API_KEY=TELEGRAM API KEY
TG_CHAT_ID=-TELEGRAM CHAT ID
```
--- 

### TestNet Phase 1 Versions

**Validator CLI version**: 0.5.0-develop.5

**Node CLI version**: 0.8.0-develop.36

**SGX**: build_base_1_28_20 

**SKALE Manager version**: 1.1.1-beta.5

**Skale admin**: 0.11.0-beta.0

**Transaction manager**: 0.2.0-beta.1 

**Skaled**: 1.46-develop.10

**Skale-SLA**: 0.7.0-stable.0

**Skale-bounty**:0.7.0-stable.0

#### TestNet Phase 1 Environment Variables

```bash
FILEBEAT_HOST=[TestNet only - ASK CORE TEAM]
SGX_SERVER_URL=[https://localhost:1026 or your separate SGX wallet server https://IP :1026]
DISK_MOUNTPOINT=/dev/sda or /dev/xvdd (this is an example for the digital ocean. You just need to use your 200gb block volume mount point)
DOCKER_LVMPY_STREAM=beta
DB_PORT=3306
DB_ROOT_PASSWORD=[PASSWORD]
DB_PASSWORD=[PASSWORD]
DB_USER=[USER]
CONTAINER_CONFIGS_STREAM=alpine
NODE_CLI_SPACE=develop
SKALE_NODE_CLI_VERSION=0.8.0-develop.35
MANAGER_CONTRACTS_ABI_URL=[RINKEBY_ABI ASK CORE TEAM]
(This manager contracts abi url where the SKALE manager smart contract ABI lives. This can change based on the beta versions or develop versions )
IMA_CONTRACTS_ABI_URL=[RINKEBY_ABI ASK CORE TEAM] 
(This will be used for IMA testing. It’s for interchain messaging agent feature for dApp developers)
ENDPOINT=[YOUR GETH NODE ENDPOINT OR https://rinkeby.infura.io/v3/INFURA KEY]
IMA_ENDPOINT=[YOUR GETH NODE ENDPOINT OR https://rinkeby.infura.io/v3/INFURA KEY]
```
--- 
