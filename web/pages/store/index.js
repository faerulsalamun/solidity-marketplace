import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row,Button, Card, Form, ListGroup } from 'react-bootstrap';
import Header from '../../components/Header';
import contract from '../../utils/contract/Marketplace.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = contract.abi;

const Web3 = require('web3');
const web3 = new Web3('ws://localhost:8545');

const nftContract = new web3.eth.Contract(abi,contractAddress);

export default function Index() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamask, setMetamask] = useState(null);
  const [store, setStore] = useState(false);
  const [walletStore, setWalletStore] = useState(0);
  const [balance, setBalance] = useState(0);
  const [itemStores, setitemStores] = useState([]);

  const checkWalletIsConnected = async() =>{
    const {ethereum} = window;

    if(!ethereum){
      console.log('Metamask belum terinstall');
      setMetamask(false);
      return;
    }else{
      setMetamask(true);

      window.ethereum.on("accountChanged",(accounts) =>{
        window.location.reload();
      })
      window.ethereum.on("chainChanged",(accounts) =>{
        window.location.reload();
      })
    }

    const accounts = await ethereum.request({method:'eth_accounts'});

    if(accounts.length !== 0){
      const account = accounts[0];

      setCurrentAccount(account);

      await Promise.all([
        await checkStore(account),
        await checkWalletStore(account),
        await getItemStore(account),
        await getBalance(account)
      ]);
    }else{
      console.log('Account tidak diberi otoritas');
    }
  };

  const connectWalletHandler = async() =>{
    const {ethereum} = window;

    if(!ethereum){
      console.log('Metamask belum terinstall');
      setMetamask(false);
      return;
    }else{
      setMetamask(true);

      window.ethereum.on("accountChanged",(accounts) =>{
        window.location.reload();
      })
      window.ethereum.on("chainChanged",(accounts) =>{
        window.location.reload();
      })
    }

    const accounts = await ethereum.request({method:'eth_requestAccounts'});

    if(accounts.length !== 0){
      const account = accounts[0];

      setCurrentAccount(account);

      await Promise.all([
        await checkStore(account),
        await checkWalletStore(account),
        await getItemStore(account),
        await getBalance(account)
      ]);
    }else{
      console.log('Account tidak diberi otoritas');
    }
  };

  const checkStore = async(account) => {
    const data = await nftContract.methods.checkStore().call();

    setStore(data);
  }

  const checkWalletStore = async(account) => {
    const data = await nftContract.methods.wallets(account).call();

    setWalletStore(data);
  }

  const getBalance = async(account) =>{
    const data = await web3.eth.getBalance(account);

    setBalance(data);
  }

  const getItemStore = async(account) => {
    const data = await nftContract.methods.getItemStoreByAddress(account).call();

    setitemStores(data);
  }

  const createStoreHandler = async() =>{
    const tx ={
      to: contractAddress,
      from: currentAccount,
      data: nftContract.methods.createStore().encodeABI()
    }

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
      })

      await Promise.all([
        await checkStore(currentAccount),
        await checkWalletStore(currentAccount),
        await getItemStore(currentAccount),
        await getBalance(currentAccount)
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const withdrawHandler = async() =>{
    const tx ={
      to: contractAddress,
      from: currentAccount,
      data: nftContract.methods.withdrawMoney().encodeABI()
    }

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
      })

      await Promise.all([
        await checkWalletStore(currentAccount),
        await getBalance(currentAccount),
      ])
    } catch (error) {
      console.log(error);
    }
  };

  const createItemHandler = async(event) =>{
    event.preventDefault();

    const data = {
      name: event.target.name.value,
      description: event.target.description.value,
      linkImage: event.target.linkImage.value,
      price: Web3.utils.toWei(event.target.price.value,'ether'),
      stock: event.target.stock.value
    }

    const tx ={
      to: contractAddress,
      from: currentAccount,
      data: nftContract.methods.sell(data.name,data.description,data.linkImage,data.price,data.stock).encodeABI()
    }

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
      })

      await Promise.all([
        await checkWalletStore(currentAccount),
        await getItemStore(currentAccount)
      ]);

      event.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() =>{
    checkWalletIsConnected();
  },[])

  const connectButton = () => (<Button variant='primary' className='w-100' onClick={connectWalletHandler}>Connect</Button>);
  
  return (
    <>
      <Header/>
      <Container className='h-100'>
        <Col>
          <Card className='mt-5 p-5'>
            <Row className='h-100 '>
              <Col>
                {
                  currentAccount ?
                      store === true ? (
                        <>
                          <div>Wallet : {walletStore == 0 ? 0 : Web3.utils.fromWei(walletStore,'ether')} </div>
                          <div>Balance : {balance == 0 ? 0 : Web3.utils.fromWei(balance,'ether')} </div>
                          <Button variant='primary' className='w-100 mb-2 mt-2' onClick={withdrawHandler}>Withdraw</Button>
                        </>
                      ): (
                        <>
                          <Button variant='primary' className='w-100 mb-2 mt-2' onClick={createStoreHandler}>Create</Button>
                        </>
                      )  
                    : connectButton()
                  }
              </Col>
            </Row>
          </Card>
        </Col>

        {
          (currentAccount && store === true) && (
            <Col>
              <Card className='mt-5 p-5'>
                <Form onSubmit={createItemHandler}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' placeholder='Name' id="name" name="name"/>
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type='text' placeholder='Description' id="description" name="description" />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Link Image</Form.Label>
                        <Form.Control type='text' placeholder='Link Image' id="linkImage" name="linkImage" />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Price (ETH)</Form.Label>
                        <Form.Control type='number'  step="any" placeholder='Price (ETH)' id="price" name="price" min={0} />
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Stock</Form.Label>
                        <Form.Control type='number' placeholder='Stock' id="stock" name="stock" min={1}/>
                    </Form.Group>

                    <Button variant='primary' type='submit' className='w-100 mb-2 mt-2'>Create</Button>
                </Form>
              </Card>
            </Col>
          )
        }

        {
          (currentAccount && store === true) && (
            <Col>
              <Card className='mt-5 p-5 mb-5'>
                <div className='text-center mb-5'><h2>List Item</h2></div>
                <Row className='gy-5'>
                    {
                      itemStores.map((item, i) => 
                        <Col className='col-md-4'>
                          <Card style={{minHeight:"450px"}}>
                            <Card.Img variant="top" src={item.image} />
                            <Card.Body>
                              <Card.Title>{item.name}</Card.Title>
                              <Card.Text>
                                {item.description}<hr/>
                                <div className='mt-2'>Price : {Web3.utils.fromWei(item.price,'ether')} Eth</div>
                                <div> Stock : {item.stock}</div>
                              </Card.Text>
                            </Card.Body>
                            </Card>
                        </Col>
                      )
                    }
                </Row>
              </Card>
            </Col>
          )
        }
        
      </Container>
    </>
  )
}
