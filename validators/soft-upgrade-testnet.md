## Testnet Soft Upgrade 

> Upgrading node-cli, api, admin and watchdog base containers as well as new skaled, ima and sgx versions. 

> Added new healthchecks for nodes. Fixed some issues in skaled, sgx and ima containers. 

**Update `CONTAINER_CONFIGS_STREAM` in .env file**

### Update SGX 

1.  From sgx folder do : `docker-compose down` 
2.  Perform `git pull`
3.  Check-out to sgx version tag: `git checkout tags/1.66.1-beta.0`
4.  Make sure `image` is skalenetwork/sgxwallet:1.66.1-beta.0 in docker-compose.yml
5. Perform `docker compose up -d`

### Install SKALE Node CLI

#### Download the SKALE Node CLI binary

Make sure th `VERSION_NUM` is the 1.1.0-beta.6

**Terminal Command:**

```bash
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://github.com/skalenetwork/skale-node-cli/releases/download/$VERSION_NUM/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale"

```

#### Make the SKALE Node CLI binary executable

**Terminal Command:**

```bash
sudo chmod +x /usr/local/bin/skale
```

### Update node using skale node update

```bash
cd  ~ && vi .env
```

Make sure the `CONTAINER_CONFIGS_STREAM` in .env file is `1.4.1-testnet`

```bash
CONTAINER_CONFIGS_STREAM=1.4.1-testnet
```

Make sure the iptables-persistent package is installed on your machine

``` bash
dpkg -l | grep iptables-persistent
```

**Cleanup database**

Remove database file
``` bash
rm .skale/node_data/skale.db
```

**Perform update**

Run skale node update:
```bash
skale node update .env
```
