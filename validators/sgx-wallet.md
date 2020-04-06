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

**Terminal Commands:**

```bash
sudo apt-get install build-essential make cmake gcc g++ yasm  python libprotobuf10 flex bison automake libtool texinfo libgcrypt20-dev libgnutls28-dev
```
**Install Docker:**
```bash
sudo apt-get install -y docker
```
**Install docker.io:**
```bash
sudo apt-get install -y docker.io
```
**Install docker-compose:**
```bash
sudo apt-get install -y docker-compose
```
**Install cpuid and libelf-dev packages:**
```bash
sudo apt-get install -y libelf-dev cpuid
```
**Verify your processor supports Intel SGX with:**
```bash
cpuid | grep SGX:
```

**Output**
```bash
SGX: Software Guard Extensions supported = true
```

---


### Set Up SGX Wallet

#### STEP 1 - Clone SGX Wallet Repository

Clone SGX Wallet Repository to your SGX compatible Server:

```bash
git clone --recurse-submodules https://github.com/skalenetwork/sgxwallet.git --branch develop
```
#### STEP 2 - Enable SGX

**SGX Wallet repository includes the sgx_enable utility. To enable SGX run:**

```bash
sudo ./sgx_enable
```

Note: if you are not using Ubuntu 18.04 (something that we do not recommend), you may need to rebuild the sgx-software-enable utility before use by typing:

```bash
cd sgx-software-enable;
make
cd ..
```

**Instal SGX Library:** 

```bash
cd scripts 
sudo ./sgx_linux_x64_driver_2.5.0_2605efa.bin
cd ..
```

**System Reboot:** 
> Reboot your machine after driver install!

**Check driver installation:** 
To check that isgx device is properly installed run this command: 

```bash
ls /dev/isgx
```
If you do not see the isgx device, you need to troubleshoot your driver installation from [**here.**](https://github.com/skalenetwork/sgxwallet/blob/develop/docs/enabling-sgx.md)  

**Another way to verify Intel SGX is enabled in BIOS:**

> ***If you already executed the previous steps please move to STEP 3***

Enter BIOS by pressing the BIOS key during boot. The BIOS key varies by manufacturer and could be F10, F2, F12, F1, DEL, or ESC.

Usually Intel SGX is disabled by default.

***To enable:***

find the Intel SGX feature in BIOS Menu (it is usually under the "Advanced" or "Security" menu)
Set SGX in BIOS as enabled (preferrably) or software-controlled.
save your BIOS settings and exit BIOS.
Enable "software-controlled" SGX
Software-controlled means that SGX needs to be enabled by running a utility.


#### STEP 3 - Start SGX

Production Mode

```bash
cd sgxwallet/run_sgx;
```

On some machines, the SGX device is not **/dev/mei0** but a different device, such as **/dev/bs0** or **/dev/sg0**. In this case please edit docker-compose.yml on your machine to specify the correct device to use:

```bash
vi docker-compose.yml
```

how docker-compose will look:

```bash
version: '3'
services:
  sgxwallet:
    image: skalenetwork/sgxwallet:latest
    ports:
      - "1026:1026"
      - "1027:1027"
      - "1028:1028"
    devices:
      - "/dev/isgx"
      - "/dev/sg0"
    volumes:
      - ./sgx_data:/usr/src/sdk/sgx_data
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "4"
    restart: unless-stopped
    command: -s -y -d
    healthcheck:
      test: ["CMD", "ls /dev/isgx /dev/sg0"]
```

**Start SGX Wallet Containers**
To run the server as a daemon:
```bash
sudo docker-compose up -d
```

### STOP SGX Wallet Containers
```bash
cd sgxwallet/run_sgx
sudo docker-compose stop
```