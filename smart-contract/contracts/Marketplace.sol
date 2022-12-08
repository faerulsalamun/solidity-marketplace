// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Marketplace {
    uint256 public marketPlaceFee = 10;

    struct Item{
        bytes32 itemId;
        string name;
        string description;
        string image;
        uint256 price;
        uint256 stock;
        address ownerId;
        uint256 createdAt;
    }

    struct Transaction{
        bytes32 transactionId;
        bytes32 itemId;
        string name;
        string description;
        string image;
        uint256 price;
        uint256 qty;
        address buyer;
        uint256 createdAt;
    }

    // List Toko
    address[] public stores;

    // List Item dari Toko
    mapping(address => Item[]) public items;
   
    // List transaction
    mapping(address => Transaction[]) public transactions;

    // List wallet store
    mapping(address => uint256) public wallets;

	modifier onlyStore() {
		require(checkStore() == true, "Anda harus mendaftar menjadi toko terlebih dahulu");
		_;
	}

    function createStore() public {
        require(checkStore() == false, "Anda sudah mendaftar menjadi toko");

         stores.push(msg.sender);
    }

    function getStore() public view returns(address[] memory) {
        return stores;
    }

     function checkStore() public view returns(bool) { 
        for (uint i=0; i<stores.length; i++) {
            if(stores[i] == msg.sender) return true;
		}

        return false;
    }

    function getItemByIdAndStoreId(address address_,bytes32 itemId_) public view returns(Item memory) {
        for (uint i=0; i<items[address_].length; i++) {
            if(items[address_][i].itemId == itemId_) return items[address_][i];
		}

        revert('Not found');
    }

     function updateItemStock(address address_,bytes32 itemId_,uint256 qty_) internal {
        for (uint i=0; i<items[address_].length; i++) {
            if(items[address_][i].itemId == itemId_) items[address_][i].stock -= qty_;
		}
    }

    function getItemStoreByAddress(address address_) public view returns(Item[] memory) {
        return items[address_];
    }

    function getTransactionByAddress() public view returns(Transaction[] memory) {
        return transactions[msg.sender];
    }

    function sell(
        string calldata name_,
        string calldata description_,
        string calldata image_,
        uint256 price_,
        uint256 qty_
    ) public onlyStore {

        bytes32 itemId = keccak256(abi.encodePacked(msg.sender, block.timestamp)); 
		Item memory item = Item(
            itemId,
            name_,
            description_,
            image_, 
            price_,
            qty_,
            msg.sender, 
            block.timestamp
        ); 

        items[msg.sender].push(item);
    }

    function buy(
        address addressSeller_,
        bytes32 itemId_, 
        uint256 qty_
    ) external payable {
        Item memory item = getItemByIdAndStoreId(addressSeller_, itemId_);
        require(item.stock >= qty_, "Stock tidak tersedia");      
        require(msg.value == item.price * qty_,"Wrong value!");

        bytes32 transactionId = keccak256(abi.encodePacked(msg.sender, itemId_, block.timestamp)); 
        Transaction memory transaction = Transaction(
            transactionId,
            itemId_,
            item.name,
            item.description,
            item.image,
            item.price,
            qty_,
            msg.sender,
            block.timestamp
        );

        wallets[item.ownerId] += msg.value;
        updateItemStock(addressSeller_, itemId_,qty_);

        transactions[msg.sender].push(transaction);
    }

     function withdrawMoney() external {
        (bool success,) = msg.sender.call{value : wallets[msg.sender]}("");
        require(success, "Transfer failed.");
        wallets[msg.sender] = 0;
    }
}