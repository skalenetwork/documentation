## Requirements

To be added as a node to the SKALE Network, a prospective node must run the SKALE Admin, which manages all operations in the node and is installed with the [skale-node-cli](/validators/validator-cli). SKALE Admin evaluates the prospective node to ensure that it's upholding network hardware requirements. If the prospective node passes this verification step, the SKALE Admin permits the node to submit a request to SKALE Manager to join the network. This request contains both the required network deposit as well as node metadata collected by the SKALE Daemon (for example IP address, port, public key, etc.).  

Once the request has been submitted to SKALE Manager on Ethereum, SKALE Manager randomly defines the prospective node as a 'full node' or a 'fractional node' by assigning different sizes of SKALE Chains to the prospective node. Full nodes have all their resources utilized for a single Elastic Sidechain, while fractional nodes participate in multiple Elastic Sidechains (multi-tenancy).  

### Hardware Requirements

-   A Linux x86_64 machine
-   SGX-enabled Intel processor
-   Ports 22, 3009, 8080, 9100, and 10000—11500, and ICMP IPv4 open for all
-   Ubuntu 18.04
-   Attached and unmounted storage (2TB for Mainnet, 200GB for Testnet)
-   8 core
-   32GB RAM
-   16GB swap

#### Additional Requirements
-   Install docker.io
-   Install docker-compose `1.27.4`
-   Make sure lvm2 package is installed (`dpkg -l | grep lvm2`)
-   run commands with sudo

**Important notes:**  

1.  After docker installation make sure that the `live-restore` option
is enabled in `/etc/docker/daemon.json`. See more info in the [docker docs](https://docs.docker.com/config/containers/live-restore/).  

2.  If you have any issues you can save the logs using `skale logs dump` command.  
It's also useful to check logs from node-cli `skale cli logs` from docker plugin `/var/log/docker-lvmpy/lvmpy.log` if there are any issues.

3.  You can install iptables-persistent using the following commands
    ```shell
    echo iptables-persistent iptables-persistent/autosave_v4 boolean true | sudo debconf-set-selections
    echo iptables-persistent iptables-persistent/autosave_v6 boolean true | sudo debconf-set-selections
    sudo apt install iptables-persistent -y
    ```

4.  You should run skale commands using sudo

#### Block Storage

Docker has an easy way of limiting other machine resources such as CPU, memory, and volume. These resources are configurable through [the docker set up](https://docs.docker.com/config/containers/resource_constraints/?source=post_page-----9859682f4147----------------------). Configuring machine resources such as CPU and memory are easy to complete via the docker set up; however, configuring volume requires a few more steps.  

To assist with configuring volume, SKALE Labs introduced [docker-lvmpy](https://github.com/skalenetwork/docker-lvmpy), a simple volume driver for Logical Volume Manager (LVM) volumes written in python to format and partition disk space per SKALE Chain. 
‍  
When a validator sets up a node through the CLI, SKALE Admin calls docker-lvmpy to format the external and unmounted volume. Each validator in the SKALE Network must provide a non-boot external disk space, which will be used to partition the volume by the SKALE Admin.  
‍  

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9ce199ca4f18fa76e29ca0_Screen%20Shot%202019-10-08%20at%2012.19.30%20PM.png" width="360" /> <img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5d9ce198d4f7a4dcff8cd609_Screen%20Shot%202019-10-08%20at%2012.19.46%20PM.png" width="360" /> 

SKALE Admin calls docker-lvmpy to limit disk space per container (for example 20GB) and splits the volume in 1/128 size partitions. Once LVM splits the container and allocates the new space to the SKALE Chain, docker-lvmpy informs SKALE Admin that the disk is limited based on the configured SKALE Chain size.  

#### SGX (HSM)

Software Guard Extension (SGX) is an Intel® technology coprocessor ledger used for memory encryption and increasing the security of application code by storing encrypted data in the processor.  

A SKALE sub-node connects to the SGX wallet server, and then the SGX wallet connects to the wallet enclave (BLS signatures and ETH keys). Keys stored in the processor can't be taken out, and it can only be encrypted or decrypted through enclave. The key within the processor is secure in enclave, and hackers can't hack the enclave and receive the key.  
‍  
Without SGX, human confirmation is necessary for transactions made in the SKALE Network. SKALE uses SGX for securing cryptographic keys by allowing nodes to connect hardware wallets without human interaction.  
‍  
SKALE uses BLS to sign blocks in consensus, and ECDSA  is needed to validate regular Ethereum's transactions. SKALE will have a separate wallet integration for ECDSA. SKALE will use Intel® SGX technology to store BLS signatures in the coprocessor level and let users automatically authorize transactions. Currently other than bare-metal servers, SGX is supported for these cloud providers.  

-   ‍[Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/108507.html?spm=a2c5t.10695662.1996646101.searchclickresult.84d1a80dPBX0Di)[‍](https://www.equinix.com/services/edge-services/smartkey/)  
-   [Baidu](https://www.equinix.com/services/edge-services/smartkey/)[‍](https://www.ibm.com/cloud/blog/data-use-protection-ibm-cloud-using-intel-sgx?mhsrc=ibmsearch_a&mhq=sgx)  
-   [IBM Cloud Data Guard](https://www.ibm.com/cloud/blog/data-use-protection-ibm-cloud-using-intel-sgx?mhsrc=ibmsearch_a&mhq=sgx)[](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions/microsoft-confidential-computing-sgx-video.html)  
-   [Microsoft Azure](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions/microsoft-confidential-computing-sgx-video.html)  

(HSMs) Ledger Nano, or Trezor, can support ECDSA signatures but not BLS signatures, which are used by SKALE Consensus. We estimate that it will take a couple of years for these hardware devices to support BLS signatures.[](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions/microsoft-confidential-computing-sgx-video.html)  

Advantages of SGX Wallet:  

-   Helps developers protect sensitive data  
-   Programmable for advanced crypto, such as BLS signatures  
-   Doesn't require validators to continually confirm transactions  
-   All SKALE crypto (BLS/DKG) can be done through SGX wallet  

SKALE will have two types of SGX operations:

-   **Local (Secure)**: Wallet running on the same server as sub-node  
-   **Network**: Sub-node talks to SGX wallet over the SKALE Network. The validator is responsible for securing the connection.
