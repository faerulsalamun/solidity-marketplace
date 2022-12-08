const contract = require('../artifacts/contracts/MarketPlace.sol/MarketPlace.json');
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const Web3 = require('web3');
const web3 = new Web3("ws://localhost:8545");
const nftContract = new web3.eth.Contract(contract.abi,contractAddress);

const ACCOUNT_PUBLIC_KEY = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const ACCOUNT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

async function sell(){
    const nonce = await web3.eth.getTransactionCount(ACCOUNT_PUBLIC_KEY,'latest');

    const data = {
        name: 'Laptop',
        description: 'Laptop dengan spesifikasi tercanggih tahun 2022',
        image: 'https://google.com',
        price: 10000000,
        qty: 5
    };

    const tx = {
        'from': ACCOUNT_PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 1000000,
        'data': nftContract.methods.sell(
            'Laptop',
            'Laptop dengan spesifikasi tercanggih tahun 2022',
            'https://google.com',
            10000000,
            5
        ).encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx,ACCOUNT_PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
}

async function getItems(){
    const items = await nftContract.items.call(0);

    console.log(`Total nft from address ${ACCOUNT_PUBLIC_KEY} is : ${items}`);
}

// sell();
getItems();