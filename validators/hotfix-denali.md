## Mainnet hotfix for schain creation

### Important notes

Make sure that `FILEBEAT_HOST` option is set to `filebeat.mainnet.skalenodes.com:5000`

### Update node using skale node update

#### Change directory
```shell
cd  ~ && vi .env
```

#### Update .env

Update `CONTAINER_CONFIGS_STREAM` to  `1.2.2`

```shell
CONTAINER_CONFIGS_STREAM=1.2.2
```

#### Perform update

Run skale node update:
```shell
skale node update .env
```
