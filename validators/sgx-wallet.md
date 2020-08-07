## SKALE SGX Wallet

SGX Wallet setup is the first step of the Validator Node registration process.  ‍

Sgxwallet is a next generation hardware secure crypto wallet that is based on Intel SGX technology. It currently supports Ethereum and SKALE.

**SGX is a secure storage for BLS private key shares. It would be used inside consensus to sign new blocks. But SGX is not only used for private key shares. For more information, please check** [**here.**](/validators/requirements)  

**SKALE DKG uses Intel® SGX server to store account and BLS keys and all the data related to DKG process and it also uses the random number generator provided by Intel® SGX. For more information, please check** [**here.**](/technology/skale-dkg) 

Sgxwallet runs as a network server. Clients connect to the server, authenticate to it using TLS 1.0 protocol with client certificates, and then issue requests to the server to generate crypto keys and perform cryptographic operations. The keys are generated inside the secure SGX enclave and never leave the enclave unencrypted.

The server provides an initial registration service to issue client certificates to the clients. The administrator manually approves each registration

### **Prerequisites**
-   Ubuntu 18.04
-   SGX-enabled Intel processor
-   Ports 1026-1028

SKALE will have two types of SGX operations:

-   **Local (Secure)**: Wallet running on the same server as sub-node.  
-   **Network**: Sub-node talks to SGX wallet over the SKALE Network. The validator is responsible for securing the connection. If validator is planning to have a separate SGX compatible node than the Blockchain node, SGX Wallet node doesn't have to have the same hardware requirements as the sub-node. SGXWallet doesn't require a lot of computational power. After setting up the Network SGX node, enable SSL certification before adding the url to configuration in SKALE Node Set up.
