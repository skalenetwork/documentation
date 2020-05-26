## SKALE Validator CLI

Note: This is **an insecure pre-release** software.

See the SKALE Validator CLI code and documentation on [**GitHub**](https://github.com/skalenetwork/validator-cli)*‍  

This document contains instructions on how to get started with the SKALE Validator CLI.  

### Step 1: Install SKALE Validator CLI

#### Download the SKALE Validator CLI binary

Replace `[VERSION NUMBER]` with `0.3.0-develop.6`

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
sk-val init -e wss://rinkeby.infura.io/ws/v3/17af71ac8ba94607bd3374f4509ce17c -c https://skale-se.sfo2.digitaloceanspaces.com/skale-manager-incentivized-onboarding-alpine-v1.json --wallet software
```

### Step 2: Register as a new SKALE validator

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
sk-val validator register -n SETeam -d "SE Team description" -c 20 --min-delegation 1000 --pk-file ./pk.txt
```

### Step 3: add Validator to Whitelist

For testing phase please provide your testing wallet Address to SKALE Core team. Your contract owner wallet will be added to validator whitelist. 
