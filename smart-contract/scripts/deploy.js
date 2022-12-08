const hre = require('hardhat');

async function deploy(){
    const Marketplace = await hre.ethers.getContractFactory('Marketplace');
    const marketplace = await Marketplace.deploy();

    await marketplace.deployed();

    console.log("Marketplace deployed to:", marketplace.address);
}

deploy()
    .then(() =>process.exit(0))
    .catch((error) =>{
        console.log(error)
        process.exit(1);
    });