## Denali IMA hotfix upgrade steps

Because some part of IMA code was performing worse than expected engineering updated ima agent code as well as schain and skale-admin containers with the hot fix. You will see the following version bumps:

- ima: `1.0.0-stable.0` -> `1.0.0-beta.10`
- schain: `3.7.3-stable.0` -> `3.7.4-beta.3`
- admin: `2.0.1` -> `2.0.1-beta.3`

### Update node using skale node update

#### Change directory
```shell
cd  ~ && vi .env
```

#### Update .env

Update `CONTAINER_CONFIGS_STREAM` to `2.0.0-hotfix.1`.

Also make sure `DISABLE_IMA` is set to `False`.

#### Perform update

Run skale node update:

```shell
skale node update .env
```
