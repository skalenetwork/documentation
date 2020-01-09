## File Storage

Storing files on the blockchain is possible within the SKALE Network. You can use SKALE to host your text, image, HTML, and other file formats through the  [file-storage npm package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

See the file storage demo on [Github](https://github.com/skalenetwork/skale-demo/tree/master/file-storage).  

Please note: the code samples below are for version  [**0.2.5**](https://www.npmjs.com/package/@skalenetwork/filestorage.js)  

<TCSectionLayout>
<TCColumnOne>

### Usage

You have full control over maintaining your files on the SKALE Network, and you can maintain your files by uploading, downloading, or deleting files within your account. Additional documentation on the methods available within File Storage can be found  [here](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

</TCColumnOne>
<TCColumnTwo>

```bash
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
const Filestorage = require('@skalenetwork/filestorage.js/src/index');

let filestorage = new Filestorage("[YOUR_SKALE_CHAIN_ENDPOINT]");

```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

### Upload Files

Uploading files can be accomplished by using the  **uploadFile**  method available within the  [NPM package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

</TCColumnOne>
<TCColumnTwo>

```javascript
//Input field to add to your HTML
<input onChange={(e) => upload(e)} 
type="file" id="files" / >

//JavaScript function for handling the file upload
async function upload(event){
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

  //file storage method to upload file
  reader.onload = async function(e) {
    const arrayBuffer = reader.result
    const bytes = new Uint8Array(arrayBuffer);
    let link = filestorage.uploadFile(
      account, 
      file.name, 
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

### Show Files

Displaying files can be accomplished by using the  **listDirectory**  method available within the  [NPM package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

</TCColumnOne>
<TCColumnTwo>

```javascript
async function getFiles(){
  //create web3 connection
  const web3Provider = new Web3.providers.HttpProvider(
    "[YOUR_SKALE_CHAIN_ENDPOINT]"
  );
  let web3 = new Web3(web3Provider);

  //get filestorage instance
  let filestorage = new Filestorage(web3, true);

  //provide your account & private key
  let account = "[YOUR_ACCOUNT_ADDRESS]";

  let files = await filestorage.listDirectory(
    web3.utils.stripHexPrefix(account)
  );
}

```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

### Download Files

Downloading files can be accomplished by using the FilestorageClient.downloadToFile or the  **downloadToBuffer**  method available within the  [NPM package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

</TCColumnOne>
<TCColumnTwo>

```javascript
async function downloadFileToDesktop(link) {
  //create web3 connection
  const web3Provider = new Web3.providers.HttpProvider(
    "[YOUR_SKALE_CHAIN_ENDPOINT]"
  );
  let web3 = new Web3(web3Provider);

  //get filestorage instance
  let filestorage = new Filestorage(web3, true);

  await filestorage.downloadToFile(link);
}

async function downloadFileToVariable(link) {
  //create web3 connection
  const web3Provider = new Web3.providers.HttpProvider(
    "[YOUR_SKALE_CHAIN_ENDPOINT]"
  );
  let web3 = new Web3(web3Provider);

  //get filestorage instance
  let filestorage = new FilestorageClient(web3, true);

  let file = await filestorage.downloadToBuffer(link);
  file = 'data:image/png;base64,' + file.toString('base64');
}

```

</TCColumnTwo>
</TCSectionLayout>
<TCSectionLayout>
<TCColumnOne>

### Delete Files

Deleting files can be accomplished by using the  **deleteFile**  method available within the  [NPM package](https://www.npmjs.com/package/@skalenetwork/filestorage.js).  

</TCColumnOne>
<TCColumnTwo>

```javascript
async function deleteFile(fileName) {
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

  await filestorage.deleteFile(account, fileName, privateKey);

```

</TCColumnTwo>
</TCSectionLayout>
