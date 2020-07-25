## Troubleshooting

Need help solving an issue? Check to see if this has already been answered below. If you can't find an answer to your issue, reach out to us on discord.  

[Ask a question](http://skale.chat/)

### Validator Node

#### How should validators configure back up and restore?

Validators are responsible for backing up everything on the node. SKALE Network is relying on validators to complete the backup procedure for each of the nodes. SKALE Network will be replicating the data for each SKALE Chain on 16 other nodes, to add an additional layer of data availability. If a node goes down for a long time, the other 2/3 of 15 will be responsible for taking the snapshot of the SKALE Chain and shuffling the SKALE Chain in the SKALE Network. If a validator node is down for a long time, it may be reallocated to service new SKALE Chains depending on the length of the downtime.  

Please check [backup](/validators/backup) to learn more about how to back up node and sgx wallet and restore

#### Where are the network communications between containers, shared configuration files and volumes stored?

You can find these details in GitHub [skale-node](https://github.com/skalenetwork/skale-node) repository and [docker-compose.yml](https://github.com/skalenetwork/skale-node/blob/f928b95e69c548f12b4b21bd11a16fe2d239b83b/docker-compose.yml)  

#### How do I access the SKALE Chain's IP and ports?

Please perform the following in your terminal and pick one of the names shows up under "schains" folder:  

```bash
cd /skale_node_data/schains/
cd [chainname]
vi [chainname].json

```

In this file you can see all the SKALE Chain information:  

![](https://assets.website-files.com/5be05ae542686c4ebf192462/5d9f9cb5adfc337b00747f66_Screen%20Shot%202019-10-10%20at%201.53.21%20PM.png)


#### Can we use Kubernetes?

Yes. However, you will need to make sure that your platform is compatible with SKALE. Currently, Docker Convoy does not have an integration with Kubernetes.

#### Where can I find the SKALE Node logs

Validators can run these commands to check their logs in their node:

Here are some logs and commands you can use for troubleshooting or provide logs to the core team

the most used and first place to look at
```bash
docker logs skale_api 
```

or

```bash
docker logs skale_admin 
```

transaction manager logs
```bash
docker logs skale_transaction_manager
```

all logs
```bash
skale logs dump [PATH]
```
Sgx certification in validator node:
```bash
ls -l ~/.skale/node_data/sgx_certs/
```
sgxwallet logs:
```bash
docker logs runsgx_sgxwallet_1
```
node-cli debugging logs
```bash
~/.skale/.skale-cli-log/debug-node-cli.log
```

SKALE Network has many resources designed to help you get your questions answered. You can reach out to our community on  [discord](http://skale.chat/), or submit a support request below.  

[Contact Support](https://skalelabs.typeform.com/to/pSu895)
