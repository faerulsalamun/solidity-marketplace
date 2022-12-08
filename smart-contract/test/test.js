const { expect } = require('chai');
const { ethers } = require('hardhat');
const { utils } = require('ethers');

describe('Salamun Contract', () =>{
    const PRICE = 0.003;

    beforeEach(async() => {
        const Marketplace = await ethers.getContractFactory('Marketplace');
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        marketplace = await Marketplace.deploy();
    });

  //   describe('Store', () => {
  //     it('should call a function store correctly', async() =>{
  //         await marketplace.createStore();

  //         console.log(await marketplace.getStore())
  //     });
  // });

    describe('Sell 1', () => {
        it('should call a function sell correctly', async() =>{
            await marketplace.createStore();

            await marketplace.sell(
              'Laptop',
              'Laptop dengan spesifikasi tercanggih tahun 2022',
              'https://faerul.com',
              ethers.utils.parseEther(`${0,5}`),
              5
            )

            await marketplace.sell(
              'Laptop 2',
              'Laptop dengan spesifikasi tercanggih tahun 2022',
              'https://faerul.com',
              ethers.utils.parseEther(`${0,5}`),
              5
            )

            // Get item store
            const itemStores = await marketplace.getItemStoreByAddress(owner.address);

            // Get item
            const item = await marketplace.getItemByIdAndStoreId(owner.address,itemStores[0].itemId);

            console.log(item)

            let balanceOwner = await ethers.provider.getBalance(owner.address);
            console.log(ethers.utils.formatEther(balanceOwner));

            let balance = await ethers.provider.getBalance(addr1.address);
            console.log(ethers.utils.formatEther(balance));

            console.log(ethers.utils.parseEther(`${0,5}`));
            // Buy
            await marketplace.connect(addr1).buy(owner.address,item.itemId,1, {value: '5000000000000000000'});


            // Get Transaction
            const tansactions = await marketplace.connect(addr1).getTransactionByAddress();
            console.log('-----')
            
            balanceOwner = await ethers.provider.getBalance(owner.address);
            console.log(ethers.utils.formatEther(balanceOwner));

            balance = await ethers.provider.getBalance(addr1.address);
            console.log(ethers.utils.formatEther(balance));

            // Check balance
            let balanceWallet = await marketplace.wallets(owner.address);  
            console.log(balanceWallet)
            console.log('B-----')

            // Withdraw Money
            const withdraw = await marketplace.withdrawMoney();

            console.log('-----')
            
            balanceOwner = await ethers.provider.getBalance(owner.address);
            console.log(ethers.utils.formatEther(balanceOwner));

            balance = await ethers.provider.getBalance(addr1.address);
            console.log(ethers.utils.formatEther(balance));

            balanceWallet = await marketplace.wallets(owner.address);  
            console.log(balanceWallet)
            console.log('B-----')

             // Get item
             const items = await marketplace.getItemByIdAndStoreId(owner.address,itemStores[0].itemId);

             console.log(items)

        });
    });
});