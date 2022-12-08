import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Col, Container, Row,Button, Card, Form, ListGroup } from 'react-bootstrap';
import Header from '../../components/Header';
import contract from '../../utils/contract/Marketplace.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = contract.abi;

const Web3 = require('web3');
const web3 = new Web3('ws://localhost:8545');

const nftContract = new web3.eth.Contract(abi,contractAddress);

export default function Detail() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamask, setMetamask] = useState(null);
  const [itemStores, setItemStores] = useState([]);

  const router = useRouter()
  const {address} = router.query;

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

      await getItemStores(account);
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

      await getItemStores(account);
    }else{
      console.log('Account tidak diberi otoritas');
    }
  };

  const getItemStores = async(account) => {
    const data = await nftContract.methods.getItemStoreByAddress(account).call();

    setItemStores(data);
  }

  const buyHandler = async (item) => {

    const tx ={
      to: contractAddress,
      from: currentAccount,
      value:  Web3.utils.toHex(item.price),
      data: nftContract.methods.buy(item.ownerId,item.itemId,1).encodeABI()
    }

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
      })

      await getItemStores(currentAccount);
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
                {
                  currentAccount ? `Store : ${address}` 
                    : connectButton()
                  }
          </Card>
        </Col>

        {
          (currentAccount) && (
            <Col>
              <Card className='mt-5 p-5'>
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
                              <Button variant="primary" onClick={() => { buyHandler(item) }}>Buy</Button>

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
