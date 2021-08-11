## Denali IMA hotfix upgrade steps

### Update node using skale node update

#### Change directory
```shell
cd  ~ && vi .env
```

#### Update .env

Update `CONTAINER_CONFIGS_STREAM` to `2.0.0-ima-hotfix`.

Also make sure `DISABLE_IMA` is set to `False`.

#### Perform update

Run skale node update:

```shell
skale node update .env
```
