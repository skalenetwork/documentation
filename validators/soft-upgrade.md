## Mainnet Soft Upgrade 

> Upgrading bounty Container by changing environment variables to have the same schedule every month:

> Early bounty schedule implementation depended on a constant variable called `rewards period` and `the node registration date`. With this update every node in the network will call get bounty at the end of each epoch. Validators are required to update Bounty Container version by Monday, 23rd November to be on the same schedule ever other node in the network. This will be a one time update and doesn't contain any risk and the smart contract change has been audited. 

**Update `CONTAINER_CONFIGS_STREAM` in .env file**

```bash
cd  ~ && vi .env
```

Make sure the `CONTAINER_CONFIGS_STREAM` in .env file is `1.1.1`

```bash
CONTAINER_CONFIGS_STREAM=1.1.1 
```

**Update Node Bounty container version**

Run skale node update:
```bash
skale node update .env
```
