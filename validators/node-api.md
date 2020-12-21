# Node REST API v1

Each SKALE node has `skale_api` container with Flask webserver that provides REST JSON API to interact with it.  
SKALE node REST API is available locally on the node and could be accessed on http://localhost:3007.

> ❗️ WARNING: REST API provides an access to private methods such as money transfers, node controls, etc. Make sure that port `3007` is available only to your trusted clients.

> Node REST API v1 available in `skale_api > 2.0.0-develop.0`

## Table of contents

- [Node REST API v1](#node-rest-api-v1)
  - [Table of contents](#table-of-contents)
  - [Endpoint structure](#endpoint-structure)
  - [Allowed APIs](#allowed-apis)
  - [REST JSON API](#rest-json-api)
    - [Logs](#logs)
      - [Methods](#methods)
      - [Usage](#usage)
    - [Node](#node)
      - [Methods](#methods-1)
    - [Usage](#usage-1)
    - [Health](#health)
      - [Methods](#methods-2)
      - [Usage](#usage-2)
    - [sChains](#schains)
      - [Methods](#methods-3)
      - [Usage](#usage-3)
    - [SSL](#ssl)
      - [Methods](#methods-4)
      - [Usage](#usage-4)
    - [Wallet](#wallet)
      - [Methods](#methods-5)
      - [Usage](#usage-5)

## Endpoint structure

```bash
/api/{API_VERSION}/{GROUP_NAME}/{METHOD_NAME}
```

## Allowed APIs

Methods that are marked as `ALLOWED` could be safely used by validators directly or by their custom tools.  
Usage examples are available for `ALLOWED` APIs only.

- `ALLOWED` - API is safe to use directly by custom tools
- `NOT RECOMMENDED` - This API changes the state of the node and should be used only if you're really confident of what you're doing

## REST JSON API

### Logs

#### Methods

| URL                 | Type  | Direct use | Description                                                                              | Required params | Optional params                                    |
| ------------------- | ----- | ---------- | ---------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------- |
| `/api/v1/logs/dump` | `GET` | `ALLOWED`  | Download `.tag.gz` log dump from SKALE containers. Containers could be filtered by name. | N/A             | `container_name` - name of the container to filter |

#### Usage

N/A

### Node

#### Methods

| URL                                 | Type   | Direct use        | Description                                                                                  | Required params                                                                        | Optional params                          |
| ----------------------------------- | ------ | ----------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------- |
| `/api/v1/node/info`                 | `GET`  | `ALLOWED`         | Get node info                                                                                | N/A                                                                                    | N/A                                      |
| `/api/v1/node/register`             | `POST` | `NOT RECOMMENDED` | Register SKALE node on contracts                                                             | `ip` - IP address of the node, `port` - base port for node sChains, `name` - node name | `gas_price`, `gas_limit`, `skip_dry_run` |
| `/api/v1/node/maintenance-on`       | `POST` | `NOT RECOMMENDED` | Turn on maintenance mode                                                                     | N/A                                                                                    | N/A                                      |
| `/api/v1/node/maintenance-off`      | `POST` | `NOT RECOMMENDED` | Turn off maintenance mode                                                                    | N/A                                                                                    | N/A                                      |
| `/api/v1/node/send-tg-notification` | `POST` | `ALLOWED`         | Send Telegram notification to the node owner. Telegaram bot could be disabled by node owner. | `message` - Message string                                                             | N/A                                      |
| `/api/v1/node/exit/start`           | `POST` | `NOT RECOMMENDED` | Start node exit process (async call)                                                         | N/A                                                                                    | N/A                                      |
| `/api/v1/node/exit/status`          | `GET`  | `ALLOWED`         | Check node exit status                                                                       | N/A                                                                                    | N/A                                      |  | N/A |

### Usage

```bash
$ curl http://0.0.0.0:3007/api/v1/node/info
{"status": "ok", "payload": {"node_info": {"name": "node0", "ip": "18.194.30.195", "publicIP": "18.194.30.195", "port": 10000, "start_block": 7484303, "last_reward_date": 1604422772, "finish_time": 0, "status": 0, "validator_id": 13, "publicKey": "0xfbdbe73613dd3113ca0e614d98e7af43199a4be970d76b013fe8b8b70c1d250fb1ba33d8b18f580d8ab51cf17344ff2dc9d0755612ce34a6a73cd5dc9e76bb77", "id": 3, "owner": "0x491499770619f5d5AA3F2Bb4B69f7E03778Dac5E"}}}

$ curl -X POST -H "Content-Type: application/json" --data '{"message":"xyz"}' http://0.0.0.0:3007/api/v1/node/send-tg-notification
{"status": "ok", "payload": "Message was sent successfully"}

$ curl http://0.0.0.0:3007/api/v1/node/exit/status
{"status": "ok", "payload": {"status": "ACTIVE", "data": [{"name": "wailing-alniyat", "status": "ACTIVE"}, {"name": "handsome-fornacis", "status": "ACTIVE"}], "exit_time": 0}}
```

### Health

#### Methods

| URL                         | Type  | Direct use | Description                            | Required params | Optional params                                                                                  |
| --------------------------- | ----- | ---------- | -------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| `/api/v1/health/containers` | `GET` | `ALLOWED`  | Get SKALE containers statuses          | N/A             | `all` - all containers (only `Running` by default), `name_filter` - docker container name filter |
| `/api/v1/health/schains`    | `GET` | `ALLOWED`  | Get checks for all sChains on the node | N/A             | N/A                                                                                              |
| `/api/v1/health/sgx`        | `GET` | `ALLOWED`  | Get status of the SGX server           | N/A             | N/A                                                                                              |

#### Usage

```bash
$ curl http://0.0.0.0:3007/api/v1/health/containers?name_filter="skale_*"
{"status": "ok", "payload": [{"image": "skale-admin:latest", "name": "skale_api", "state": {"Status": "running", "Running": true, "Paused": false, "Restarting": false, "OOMKilled": false, "Dead": false, "Pid": 11468, "ExitCode": 0, "Error": "", "StartedAt": "2020-11-26T15:38:36.265466114Z", "FinishedAt": "0001-01-01T00:00:00Z"}}, {"image": "skale-admin:latest", "name": "skale_admin", "state": {"Status": "running", "Running": true, "Paused": false, "Restarting": false, "OOMKilled": false, "Dead": false, "Pid": 13826, "ExitCode": 0, "Error": "", "StartedAt": "2020-11-26T15:41:01.093830799Z", "FinishedAt": "2020-11-26T15:41:00.822811716Z"}}}

$ curl http://0.0.0.0:3007/api/v1/health/schains
{"status": "ok", "payload": [{"name": "handsome-kornephoros", "healthchecks": {"data_dir": true, "dkg": true, "config": true, "volume": true, "firewall_rules": true, "container": false, "exit_code_ok": true, "ima_container": false, "rpc": null, "blocks": false}}, {"name": "handsome-alathfar", "healthchecks": {"data_dir": true, "dkg": true, "config": true, "volume": true, "firewall_rules": true, "container": false, "exit_code_ok": true, "ima_container": false, "rpc": null, "blocks": false}}, {"name": "rapping-chara", "healthchecks": {"data_dir": true, "dkg": true, "config": true, "volume": true, "firewall_rules": true, "container": false, "exit_code_ok": true, "ima_container": false, "rpc": null, "blocks": false}}]}

$ curl http://0.0.0.0:3007/api/v1/health/sgx
{"status": "ok", "payload": {"status": 0, "status_name": "CONNECTED", "sgx_server_url": "https://127.0.0.1:1026", "sgx_keyname": "NEK:77af9d2bcfa1a9bf5a726c7705c268be26d4b97c49eb8ccffb788485f292d56f", "sgx_wallet_version": "1.59.1"}}
```

### sChains

#### Methods

| URL                              | Type   | Direct use        | Description                                  | Required params                        | Optional params                           |
| -------------------------------- | ------ | ----------------- | -------------------------------------------- | -------------------------------------- | ----------------------------------------- |
| `/api/v1/schains/config`         | `GET`  | `ALLOWED`         | Get sChain config                            | `schain_name` - the name of the sChain | N/A                                       |
| `/api/v1/schains/list`           | `GET`  | `ALLOWED`         | List of sChains on the node                  | N/A                                    | N/A                                       |
| `/api/v1/schains/dkg-statuses`   | `GET`  | `ALLOWED`         | Get DKG statuses for the sChains on the node | N/A                                    | `all` - show all sChains, not only active |
| `/api/v1/schains/firewall-rules` | `GET`  | `ALLOWED`         | Firewall status for an sChain                | `schain_name` - the name of the sChain | N/A                                       |
| `/api/v1/schains/repair`         | `POST` | `NOT RECOMMENDED` | Repair an sChain by removing volume          | `schain_name` - the name of the sChain | N/A                                       |
| `/api/v1/schains/get`            | `GET`  | `ALLOWED`         | Get sChain info by name                      | `schain_name` - the name of the sChain | N/A                                       |  |

#### Usage

```bash
$ curl http://0.0.0.0:3007/api/v1/schains/config?schain_name=rapping-chara
{"status": "ok", "payload": {"contractSettings": {"common": {"enableContractLogMessages": false}, "IMA": {"ownerAddress": "0x5112cE768917E907191557D7E9521c2590Cdd3A0", "variables": {"LockAndDataForSchain": {"permitted": {"SkaleFeatures": "0xc033b369416c9ecd8e4a07aafa8b06b4107419e2", "LockAndDataForSchain": "0x47cf4c2d6891377952a7e0e08a6f17180a91a0f9", "EthERC20": "0xd3cdbc1b727b2ed91b8ad21333841d2e96f255af", "TokenManager": "0x57ad607c6e90df7d7f158985c3e436007a15d744", "LockAndDataForSchainERC20": "0xc7085eb0ba5c2d449e80c22d6da8f0edbb86dd82", "ERC20ModuleForSchain": "0xc30516c1dedfa91a948349209da6d6b1c8868ed7", "LockAndDataForSchainERC721": "0x97438fdfbdcc4ccc533ea874bfeb71f4098585ab", "ERC721ModuleForSchain": "0xc1b336da9058efd1e9f5636a70bfe2ec17e15abb", "TokenFactory": "0xe9e8e031685137c3014793bef2875419c304aa72", "MessageProxyForSchain": "0x427c74e358eb1f620e71f64afc9b1b5d2309dd01"}}, "MessageProxyForSchain": {"mapAuthorizedCallers": {"0xc033b369416c9ecd8e4a07aafa8b06b4107419e2": 1, "0x47cf4c2d6891377952a7e0e08a6f17180a91a0f9": 1, "0xd3cdbc1b727b2ed91b8ad21333841d2e96f255af": 1, "0x57ad607c6e90df7d7f158985c3e436007a15d744": 1, "0xc7085eb0ba5c2d449e80c22d6da8f0edbb86dd82": 1, "0xc30516c1dedfa91a948349209da6d6b1c8868ed7": 1, "0x97438fdfbdcc4ccc533ea874bfeb71f4098585ab": 1, "0xc1b336da9058efd1e9f5636a70bfe2ec17e15abb": 1, "0xe9e8e031685137c3014793bef2875419c304aa72": 1, "0x427c74e358eb1f620e71f64afc9b1b5d2309dd01": 1, "0x65002Ba980Be97e83A3Cd37E7fa0B9cC685fFCC4": 1, "0x491499770619f5d5AA3F2Bb4B69f7E03778Dac5E": 1, "0x5112cE768917E907191557D7E9521c2590Cdd3A0": 1}}}, "skaleFeatures": "0xc033b369416c9ecd8e4a07aafa8b06b4107419e2", "lockAndDataForSchain": "0x47cf4c2d6891377952a7e0e08a6f17180a91a0f9", "ethERC20": "0xd3cdbc1b727b2ed91b8ad21333841d2e96f255af", "tokenManager": "0x57ad607c6e90df7d7f158985c3e436007a15d744", "lockAndDataForSchainERC20": "0xc7085eb0ba5c2d449e80c22d6da8f0edbb86dd82",  ...

$ curl http://0.0.0.0:3007/api/v1/schains/list
{"status": "ok", "payload": [{"name": "handsome-kornephoros", "owner": "0x5112cE768917E907191557D7E9521c2590Cdd3A0", "indexInOwnerList": 0, "partOfNode": 0, "lifetime": 43200, "startDate": 1604580413, "startBlock": 7494811, "deposit": 1000000000000000000, "index": 0, "chainId": "0xee2db48f789f9", "active": true}, {"name": "handsome-alathfar", "owner": "0x5112cE768917E907191557D7E9521c2590Cdd3A0", "indexInOwnerList": 1, "partOfNode": 0, "lifetime": 43200, "startDate": 1605202510, "startBlock": 7536277, "deposit": 1000000000000000000, "index": 1, "chainId": "0x88e7c8c3d991c", "active": true}, {"name": "rapping-chara", "owner": "0x5112cE768917E907191557D7E9521c2590Cdd3A0", "indexInOwnerList": 2, "partOfNode": 0, "lifetime": 43200, "startDate": 1605207640, "startBlock": 7536619, "deposit": 1000000000000000000, "index": 2, "chainId": "0x07f05cb64132c", "active": true}]}

$ curl http://0.0.0.0:3007/api/v1/schains/dkg-statuses
{"status": "ok", "payload": [{"name": "handsome-kornephoros", "added_at": 1604580474.297109, "dkg_status": 3, "dkg_status_name": "DONE", "is_deleted": false, "first_run": true, "new_schain": false}, {"name": "handsome-alathfar", "added_at": 1605202595.62361, "dkg_status": 3, "dkg_status_name": "DONE", "is_deleted": false, "first_run": true, "new_schain": false}, {"name": "rapping-chara", "added_at": 1605207724.716306, "dkg_status": 3, "dkg_status_name": "DONE", "is_deleted": false, "first_run": true, "new_schain": false}]}

$ curl http://0.0.0.0:3007/api/v1/schains/firewall-rules?schain_name=rapping-chara
{"status": "ok", "payload": {"endpoints": [{"ip": "18.193.105.88", "port": 10022}, {"ip": "18.193.105.88", "port": 10023}, {"ip": "18.193.105.88", "port": 10026}, {"ip": "18.193.105.88", "port": 10027}, {"ip": null, "port": 10025}, {"ip": null, "port": 10024}, {"ip": null, "port": 10030}, {"ip": null, "port": 10029}]}}

$ curl http://0.0.0.0:3007/api/v1/schains/get?schain_name=rapping-chara
{"status": "ok", "payload": {"name": "rapping-chara", "id": "0x07f05cb64132c34d40e3df8969149fc04a4408833d02aefcefaa5093cef9876e", "owner": "0x5112cE768917E907191557D7E9521c2590Cdd3A0", "part_of_node": 0, "dkg_status": 3, "is_deleted": false, "first_run": true, "repair_mode": false}}
```

### SSL

#### Methods

| URL                  | Type   | Direct use        | Description                             | Required params                 | Optional params                                |
| -------------------- | ------ | ----------------- | --------------------------------------- | ------------------------------- | ---------------------------------------------- |
| `/api/v1/ssl/status` | `GET`  | `ALLOWED`         | Get status of the SSL certs on the node | N/A                             | N/A                                            |
| `/api/v1/ssl/upload` | `POST` | `NOT RECOMMENDED` | Upload SSL certificates                 | `ssl_key` file, `ssl_cert` file | `force` - update is certs are already uploaded |

#### Usage

```bash
$ curl http://0.0.0.0:3007/api/v1/ssl/status
{"status": "ok", "payload": {"is_empty": true}}
```

### Wallet

#### Methods

| URL                       | Type   | Direct use        | Description                  | Required params                                                                                               | Optional params |
| ------------------------- | ------ | ----------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------- |
| `/api/v1/wallet/info`     | `GET`  | `ALLOWED`         | Info about SKALE node wallet | N/A                                                                                                           | N/A             |
| `/api/v1/wallet/send-eth` | `POST` | `NOT RECOMMENDED` | Send ETH                     | `address` - receiver address, `amount` - ETH amount to send, `gas_limit` - gas limit, `gas_price` - gas price | N/A             |

#### Usage

```bash
$ curl http://0.0.0.0:3007/api/v1/wallet/info
{"status": "ok", "payload": {"address": "0x491499770619f5d5AA3F2Bb4B69f7E03778Dac5E", "eth_balance_wei": 28013774000000000, "skale_balance_wei": 0, "eth_balance": "0.028013774", "skale_balance": "0"}}
```
