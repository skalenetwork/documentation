## File Storage

Storing files on the blockchain is possible within the SKALE Network. You can use SKALE to host your text, image, HTML, and other file formats through the  [file-storage npm package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

See the file storage demo on [Github](https://github.com/skalenetwork/skale-demo/tree/master/file-storage).  

Please note: the code samples below are for version  [**0.2.10**](https://www.npmjs.com/package/@skalenetwork/filestorage.js)  

<TCSectionLayout>
<TCColumnOne>

## Usage

You have full control over maintaining your files on the SKALE Network, and you can maintain your files by uploading, downloading, or deleting files within your account. Additional documentation on the methods available within File Storage can be found  [here](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

</TCColumnOne>
<TCColumnTwo>

```shell
npm i @skalenetwork/filestorage.js
```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

### Instantiate the Client

To instantiate the client you only need to pass the SKALE endpoint into the constructor.  

</TCColumnOne>
<TCColumnTwo>

```javascript
const Filestorage = require('@skalenetwork/filestorage.js');
const Web3 = require('web3');

const web3Provider = new Web3.providers.HttpProvider('----SKALE ENDPOINT----');
let filestorage = new Filestorage(web3Provider);
```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

#### Using in HTML

To use filestorage.js in HTML you should import `filestorage.min.js` from npm package:

</TCColumnOne>
<TCColumnTwo>

```html
<script src="PATH_TO_PACKAGE/@skalenetwork/filestorage.js/dist/filestorage.min.js"></script>
<script type="text/javascript">
    async function downloadFile() {
        let fs = new filestorage('----SKALE ENDPOINT----', true);
        await fs.downloadToFile('----STORAGEPATH----');
    }
</script>   
```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

### Upload Files

Uploading files can be accomplished by using the  **uploadFile**  method available within the  [NPM package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

`specificDirectory` - (Optional) path to the directory inside account's root directory to create file: `dirA/dirB`

</TCColumnOne>
<TCColumnTwo>

```javascript
//Input field to add to your HTML
<input onChange={(e) => upload(e)} 
type="file" id="files" / >

//JavaScript function for handling the file upload
async function upload(event, specificDirectory=''){
  event.preventDefault();
  //create web3 connection
  const web3Provider = new Web3.providers.HttpProvider(
    "[YOUR_SKALE_CHAIN_ENDPOINT]"
  );
  let web3 = new Web3(web3Provider);

  //get filestorage instance
  let filestorage = new Filestorage(web3, true);

  //provide your account & private key
  //note this must include the 0x prefix
  let privateKey = '0x' + '[YOUR_PRIVATE_KEY]';
  let account = "[YOUR_ACCOUNT_ADDRESS]";

  //get file data from file upload input field
  let file = document.getElementById('files').files[0];
  let reader = new FileReader();

  //file path in account tree (dirA/file.name)
  let filePath;
  if (specificDirectory === '') {
    filePath = file.name;
  } else {
    filePath = specificDirectory + '/' + file.name;
  }

  //file storage method to upload file
  reader.onload = async function(e) {
    const arrayBuffer = reader.result
    const bytes = new Uint8Array(arrayBuffer);
    let link = filestorage.uploadFile(
      account, 
      filePath, 
      bytes,
      privateKey
    );
  };
  reader.readAsArrayBuffer(file);
}

```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

### Show Contents

Displaying files and directories can be accomplished by using the  **listDirectory**  method available within the  [NPM package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

`storagePath` - [storagePath](#storagePath) to the certain directory in File Storage

</TCColumnOne>
<TCColumnTwo>

```javascript
async function getFiles(storagePath){
  //create web3 connection
  const web3Provider = new Web3.providers.HttpProvider(
    "[YOUR_SKALE_CHAIN_ENDPOINT]"
  );
  let web3 = new Web3(web3Provider);

  //get filestorage instance
  let filestorage = new Filestorage(web3, true);

  //provide your account & private key
  let account = "[YOUR_ACCOUNT_ADDRESS]";

  let files = await filestorage.listDirectory(storagePath);
}

```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

### Download Files

Downloading files can be accomplished by using the FilestorageClient.downloadToFile or the  **downloadToBuffer**  method available within the  [NPM package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

`storagePath` - [storagePath](#storagePath) to the certain directory in File Storage

</TCColumnOne>
<TCColumnTwo>

```javascript
async function downloadFileToDesktop(storagePath) {
  //create web3 connection
  const web3Provider = new Web3.providers.HttpProvider(
    "[YOUR_SKALE_CHAIN_ENDPOINT]"
  );
  let web3 = new Web3(web3Provider);

  //get filestorage instance
  let filestorage = new Filestorage(web3, true);

  await filestorage.downloadToFile(storagePath);
}

async function downloadFileToVariable(storagePath) {
  //create web3 connection
  const web3Provider = new Web3.providers.HttpProvider(
    "[YOUR_SKALE_CHAIN_ENDPOINT]"
  );
  let web3 = new Web3(web3Provider);

  //get filestorage instance
  let filestorage = new Filestorage(web3, true);

  let file = await filestorage.downloadToBuffer(storagePath);
  file = 'data:image/png;base64,' + file.toString('base64');
}
```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

### Delete Files

Deleting files can be accomplished by using the  **deleteFile**  method available within the  [NPM package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

`filePath` - path to the file inside account's root directory: `dirA/dirB/file.txt`

</TCColumnOne>
<TCColumnTwo>

```javascript
async function deleteFile(filePath) {
  //create web3 connection
  const web3Provider = new Web3.providers.HttpProvider(
    "[YOUR_SKALE_CHAIN_ENDPOINT]"
  );
  let web3 = new Web3(web3Provider);

  //get filestorage instance
  let filestorage = new Filestorage(web3, true);

  //provide your account & private key
  //note this must include the 0x prefix
  let privateKey = '[YOUR_PRIVATE_KEY]';
  let account = "[YOUR_ACCOUNT_ADDRESS]";

  await filestorage.deleteFile(account, filePath, privateKey);
```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

### Create directory

Creating directory can be accomplished by using the **createDirectory**  method available within the [NPM package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).

`directoryPath` - path to the directory inside account's root directory: `dirA/dirB/newDir`

</TCColumnOne>
<TCColumnTwo>

```javascript
async function createDirectory(directoryPath) {
    //create web3 connection
    const web3Provider = new Web3.providers.HttpProvider(
        "[YOUR_SKALE_CHAIN_ENDPOINT]"
    );
    let web3 = new Web3(web3Provider);

    //get filestorage instance
    let filestorage = new Filestorage(web3, true);

    //provide your account & private key
    //note this must include the 0x prefix
    let privateKey = '[YOUR_PRIVATE_KEY]';
    let account = "[YOUR_ACCOUNT_ADDRESS]";

    await filestorage.createDirectory(account, directoryPath, privateKey);
}
```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

### Delete directory

Deleting directory can be accomplished by using the **deleteDirectory**  method available within the [NPM package](https://www.npmjs.com/package/@skalenetwork/filestorage.js). The directory should be empty to delete it.

`directoryPath` - path to the directory inside account's root directory: `dirA/dirB/newDir`

</TCColumnOne>
<TCColumnTwo>

```javascript
async function deleteDirectory(directoryPath) {
    //create web3 connection
    const web3Provider = new Web3.providers.HttpProvider(
        "[YOUR_SKALE_CHAIN_ENDPOINT]"
    );
    let web3 = new Web3(web3Provider);

    //get filestorage instance
    let filestorage = new Filestorage(web3, true);

    //provide your account & private key
    //note this must include the 0x prefix
    let privateKey = '[YOUR_PRIVATE_KEY]';
    let account = "[YOUR_ACCOUNT_ADDRESS]";

    await filestorage.deleteDirectory(account, directoryPath, privateKey);
}
```

</TCColumnTwo>
</TCSectionLayout>

## Notes

### Storage path <a name="storagePath"></a>

Storage path is a label used to point to file or directory in Filestorage. It contains 2 parts through slash:
1. File owner address (without 0x)
2. File/directory path in owner's root directory

Example:

```bash
77333Da3492C4BBB9CCF3EA5BB63D6202F86CDA8/directoryA/random_text.txt
77333Da3492C4BBB9CCF3EA5BB63D6202F86CDA8/random_text.txt
0x77333Da3492C4BBB9CCF3EA5BB63D6202F86CDA8/random_text.txt #Invalid storagePath
```